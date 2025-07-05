// src/components/GoogleRegister.jsx
import React, { useContext, useEffect, useState } from 'react'; // Added useState
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { app } from '../firebase';
import { useRouter } from 'next/router';
import { AppClientContext } from '../context/ClientDataProvider';

import useJwtToken from './useJwtToken';
import useOnlineStatus from './useOnlineStatus';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';

const GoogleRegister = ({ acceptedTerms }) => {
  const { isReliablyOnline } = useOnlineStatus();
  const [localErrorMessage, setLocalErrorMessage] = useState(null); // Nuevo estado para errores locales
  const [localSuccessMessage, setLocalSuccessMessage] = useState(null); // Nuevo estado para éxitos locales

  const auth = getAuth(app);
  const router = useRouter();

  const { initializeToken, fetchWithToken } = useJwtToken();

  useEffect(() => {
    initializeToken();
  }, [initializeToken]);

  const { setUser, setClientData } = useContext(AppClientContext);

  // Función para limpiar los mensajes
  const resetMessages = () => {
    setLocalErrorMessage(null);
    setLocalSuccessMessage(null);
  };

  const handleGoogleAuth = async () => {
    resetMessages(); // Limpia los mensajes anteriores

    if (!acceptedTerms) {
      setLocalErrorMessage(
        'You must accept the terms and conditions and confirm your age before registering.',
      );
      return;
    }

    try {
      // Obtiene la credencial de Google usando el plugin nativo de Capacitor
      const result = await FirebaseAuthentication.signInWithGoogle();
      const idToken = result.credential?.idToken;

      if (!idToken) {
        console.error(
          '❌ No se pudo obtener el ID Token de Google desde el plugin.',
        );
        if (result.code === 'cancelled') {
          setLocalErrorMessage('Registration cancelled by the user.');
        } else {
          setLocalErrorMessage(
            'Error getting Google credentials. Please try again.',
          );
        }
        return;
      }

      // Crea una credencial de Firebase a partir del idToken de Google
      const credential = GoogleAuthProvider.credential(idToken);

      // Inicia sesión en Firebase con esta credencial
      const firebaseUserCredential = await signInWithCredential(
        auth,
        credential,
      );
      const user = firebaseUserCredential.user;

      if (!user || !user.email) {
        console.error(
          '❌ No se pudo obtener la información del usuario de Firebase después de signInWithCredential.',
        );
        setLocalErrorMessage('Registration error. Please try again.');
        return;
      }

      const userData = {
        name: user.displayName,
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
        setLocalSuccessMessage(
          'User registered and saved successfully! Redirecting...',
        );
        setUser(user);
        setClientData(data.client);
        router.push('/');
      } else if (response.status === 409) {
        console.warn('⚠️ User already registered. Logging in automatically...');

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
          setLocalErrorMessage('Error getting client data.');
        }
      } else {
        console.error('❌ Registration error:', data);
        setLocalErrorMessage(
          'Registration error. Check your connection and try again.',
        );
      }
    } catch (error) {
      console.error('❌ Error registering with Google:', error);
      if (error.code === 'cancelled') {
        setLocalErrorMessage('Google registration cancelled by the user.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        setLocalErrorMessage('Authentication popup was closed by the user.');
      } else {
        setLocalErrorMessage(
          'Connection error or authentication failed. Please try again.',
        );
      }
    }
  };

  return (
    <>
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
      <button
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition
        disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400
        "
        onClick={handleGoogleAuth}
        // El botón se deshabilita si no hay conexión o si los términos no son aceptados
        disabled={!isReliablyOnline || !acceptedTerms}
      >
        Register with Google
      </button>
    </>
  );
};

export default GoogleRegister;
