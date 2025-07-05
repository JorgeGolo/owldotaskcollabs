// src/components/EmailAuth.jsx
import React, { useState, useContext, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../firebase';
import { useRouter } from 'next/router';
import { AppClientContext } from '../context/ClientDataProvider';
import useJwtToken from './useJwtToken';

// Recibe initialIsRegistering como prop
const EmailAuth = ({ acceptedTerms, ageConfirmed, initialIsRegistering }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Usa initialIsRegistering para el estado inicial del formulario
  const [isRegistering, setIsRegistering] = useState(initialIsRegistering);
  const [localErrorMessage, setLocalErrorMessage] = useState(null);
  const [localSuccessMessage, setLocalSuccessMessage] = useState(null);

  const router = useRouter();
  const { setUser, setClientData } = useContext(AppClientContext);
  const { initializeToken, fetchWithToken } = useJwtToken();

  useEffect(() => {
    initializeToken();
  }, [initializeToken]);

  // Efecto para actualizar isRegistering si la prop initialIsRegistering cambia
  useEffect(() => {
    setIsRegistering(initialIsRegistering);
    resetMessages(); // También limpia los mensajes al cambiar de modo
  }, [initialIsRegistering]);

  const resetMessages = () => {
    setLocalErrorMessage(null);
    setLocalSuccessMessage(null);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!email || !password) {
      setLocalErrorMessage('Please enter both email and password.');
      return;
    }

    if (isRegistering) {
      // Lógica para el REGISTRO
      if (!acceptedTerms || !ageConfirmed) {
        setLocalErrorMessage(
          'You must accept the terms and conditions and confirm your age before registering.',
        );
        return;
      }

      try {
        const firebaseUserCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const user = firebaseUserCredential.user;

        if (!user || !user.email) {
          setLocalErrorMessage(
            'Error creating user account. Please try again.',
          );
          return;
        }

        const userData = {
          name: user.displayName || email.split('@')[0],
          email: user.email,
          uid: user.uid,
        };

        const response = await fetchWithToken(
          'https://8txnxmkveg.us-east-1.awsapprunner.com/api/register',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          },
        );

        const data = await response.json();

        if (response.status === 201) {
          setLocalSuccessMessage('Registration successful! Redirecting...');
          setUser(user);
          setClientData(data.client);
          router.push('/');
        } else if (response.status === 409) {
          console.warn('User already registered. Attempting to log in...');
          const loginResponse = await fetchWithToken(
            `https://8txnxmkveg.us-east-1.awsapprunner.com/api/getClientData?uid=${user.uid}`,
          );
          const clientData = await loginResponse.json();

          if (loginResponse.ok) {
            setLocalSuccessMessage('Account already exists. Logging in...');
            setUser(user);
            setClientData(clientData);
            router.push('/');
          } else {
            setLocalErrorMessage(
              'Error fetching client data after registration attempt.',
            );
          }
        } else {
          setLocalErrorMessage(
            data.message || 'Registration failed. Please try again.',
          );
        }
      } catch (err) {
        let message = 'Registration failed.';
        if (err.code === 'auth/email-already-in-use') {
          message =
            'This email is already in use. Please log in or use a different email.';
        } else if (err.code === 'auth/weak-password') {
          message = 'Password should be at least 6 characters.';
        } else if (err.code === 'auth/invalid-email') {
          message = 'Invalid email address.';
        }
        setLocalErrorMessage(message);
        console.error('Error during email registration:', err);
      }
    } else {
      // Lógica para el INICIO DE SESIÓN
      try {
        const firebaseUserCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const user = firebaseUserCredential.user;

        if (!user || !user.email) {
          setLocalErrorMessage('Error logging in. User information not found.');
          return;
        }

        const loginResponse = await fetchWithToken(
          `https://8txnxmkveg.us-east-1.awsapprunner.com/api/getClientData?uid=${user.uid}`,
        );
        const clientData = await loginResponse.json();

        if (loginResponse.ok) {
          setLocalSuccessMessage('Login successful! Redirecting...');
          setUser(user);
          setClientData(clientData);
          router.push('/');
        } else {
          setLocalErrorMessage('Error fetching client data after login.');
        }
      } catch (err) {
        let message = 'Login failed.';
        if (err.code === 'auth/wrong-password') {
          message = 'Incorrect password.';
        } else if (err.code === 'auth/user-not-found') {
          message = 'No account found with this email. Please register.';
        } else if (err.code === 'auth/invalid-email') {
          message = 'Invalid email address.';
        } else if (err.code === 'auth/invalid-credential') {
          message =
            'Invalid credentials. Please check your email and password.';
        }
        setLocalErrorMessage(message);
        console.error('Error during email login:', err);
      }
    }
  };

  return (
    <div className="mt-6 p-4 md:p-6 bg-white dark:bg-dark-2 rounded-lg shadow hover:shadow-lg transition">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        {isRegistering ? 'Register with Email' : 'Sign In with Email'}
      </h2>

      {localErrorMessage && (
        <p style={{ color: 'red', fontWeight: 'bold' }} className="mb-4">
          {localErrorMessage}
        </p>
      )}
      {localSuccessMessage && (
        <p style={{ color: 'green', fontWeight: 'bold' }} className="mb-4">
          {localSuccessMessage}
        </p>
      )}

      <form onSubmit={handleAuth}>
        <div className="mb-4">
          <label
            htmlFor="email-input"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email:
          </label>
          <input
            type="email"
            id="email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password-input"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Password:
          </label>
          <input
            type="password"
            id="password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
          disabled={(!acceptedTerms || !ageConfirmed) && isRegistering}
        >
          {isRegistering ? 'Register' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default EmailAuth;
