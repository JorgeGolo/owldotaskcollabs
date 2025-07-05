// src/components/EmailAuth.jsx
import React, { useState, useContext, useEffect } from 'react';
import {
  createUserWithEmailAndPassword, // Para registrar nuevos usuarios con email y contraseña
  signInWithEmailAndPassword, // Para iniciar sesión con email y contraseña
} from 'firebase/auth';
import { auth } from '../firebase'; // Importa la instancia de autenticación de Firebase
import { useRouter } from 'next/router'; // Hook de Next.js para la navegación
import { AppClientContext } from '../context/ClientDataProvider'; // Contexto para manejar datos del cliente
import useJwtToken from './useJwtToken'; // Hook personalizado para manejar tokens JWT

const EmailAuth = ({ acceptedTerms, ageConfirmed }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Estado para alternar entre el formulario de registro (true) y el de inicio de sesión (false)
  const [isRegistering, setIsRegistering] = useState(true);
  const [localErrorMessage, setLocalErrorMessage] = useState(null); // Mensajes de error específicos del componente
  const [localSuccessMessage, setLocalSuccessMessage] = useState(null); // Mensajes de éxito específicos del componente

  const router = useRouter();
  const { setUser, setClientData } = useContext(AppClientContext);
  const { initializeToken, fetchWithToken } = useJwtToken();

  // Inicializa el token JWT cuando el componente se monta
  useEffect(() => {
    initializeToken();
  }, [initializeToken]);

  // Función para limpiar los mensajes de error y éxito
  const resetMessages = () => {
    setLocalErrorMessage(null);
    setLocalSuccessMessage(null);
  };

  // Manejador principal para el registro o inicio de sesión
  const handleAuth = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    resetMessages(); // Limpia mensajes anteriores

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
        // Crea el usuario en Firebase Authentication
        const firebaseUserCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const user = firebaseUserCredential.user; // Obtiene el objeto de usuario de Firebase

        if (!user || !user.email) {
          setLocalErrorMessage(
            'Error creating user account. Please try again.',
          );
          return;
        }

        // Prepara los datos del usuario para enviar a tu backend
        const userData = {
          name: user.displayName || email.split('@')[0], // Usa el nombre de visualización o parte del email
          email: user.email,
          uid: user.uid,
        };

        // Llama a tu API de registro en el backend
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
          // Registro exitoso
          setLocalSuccessMessage('Registration successful! Redirecting...');
          setUser(user); // Actualiza el usuario en el contexto
          setClientData(data.client); // Actualiza los datos del cliente en el contexto
          router.push('/'); // Redirige a la página principal
        } else if (response.status === 409) {
          // El usuario ya está registrado, intenta iniciar sesión automáticamente
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
          // Otros errores del backend
          setLocalErrorMessage(
            data.message || 'Registration failed. Please try again.',
          );
        }
      } catch (err) {
        // Manejo de errores de Firebase Authentication durante el registro
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
        // Inicia sesión con email y contraseña en Firebase
        const firebaseUserCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        const user = firebaseUserCredential.user; // Obtiene el objeto de usuario de Firebase

        if (!user || !user.email) {
          setLocalErrorMessage('Error logging in. User information not found.');
          return;
        }

        // Una vez autenticado con Firebase, obtiene los datos del cliente de tu backend
        const loginResponse = await fetchWithToken(
          `https://8txnxmkveg.us-east-1.awsapprunner.com/api/getClientData?uid=${user.uid}`,
        );
        const clientData = await loginResponse.json();

        if (loginResponse.ok) {
          // Inicio de sesión exitoso y datos del cliente obtenidos
          setLocalSuccessMessage('Login successful! Redirecting...');
          setUser(user); // Actualiza el usuario en el contexto
          setClientData(clientData); // Actualiza los datos del cliente en el contexto
          router.push('/'); // Redirige a la página principal
        } else {
          setLocalErrorMessage('Error fetching client data after login.');
        }
      } catch (err) {
        // Manejo de errores de Firebase Authentication durante el inicio de sesión
        let message = 'Login failed.';
        if (err.code === 'auth/wrong-password') {
          message = 'Incorrect password.';
        } else if (err.code === 'auth/user-not-found') {
          message = 'No account found with this email. Please register.';
        } else if (err.code === 'auth/invalid-email') {
          message = 'Invalid email address.';
        } else if (err.code === 'auth/invalid-credential') {
          // Para versiones más recientes de Firebase
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
          // El botón de registro se deshabilita si los términos no son aceptados
          disabled={!acceptedTerms && isRegistering}
        >
          {isRegistering ? 'Register' : 'Sign In'}
        </button>
      </form>

      <button
        onClick={() => {
          setIsRegistering(!isRegistering); // Cambia entre registro e inicio de sesión
          resetMessages(); // Limpia los mensajes al cambiar de modo
        }}
        className="mt-4 w-full bg-gray-200 text-gray-800 p-2 rounded hover:bg-gray-300 transition dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
      >
        {isRegistering
          ? 'Already have an account? Sign In'
          : 'Need an account? Register'}
      </button>
    </div>
  );
};

export default EmailAuth;
