<<<<<<< HEAD
import React, { useContext, useEffect } from "react";
=======
import React, { useContext, useEffect } from 'react';
>>>>>>> main
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
<<<<<<< HEAD
} from "firebase/auth"; // CAMBIO: Importamos signInWithCredential
import { app } from "../firebase";
import { useRouter } from "next/router";
import { AppClientContext } from "../context/ClientDataProvider";
=======
} from 'firebase/auth'; // CAMBIO: Importamos signInWithCredential
import { app } from '../firebase';
import { useRouter } from 'next/router';
import { AppClientContext } from '../context/ClientDataProvider';
>>>>>>> main

import useJwtToken from "./useJwtToken"; // Importar el hook que creamos

// CAMBIO: Importamos el plugin de Capacitor
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";

<<<<<<< HEAD
import useOnlineStatus from "./useOnlineStatus";
=======
import useOnlineStatus from './useOnlineStatus';
>>>>>>> main

const GoogleRegister = ({ acceptedTerms }) => {
  const { isReliablyOnline } = useOnlineStatus(); // Estado de conectividad de la red

  const auth = getAuth(app);
  const router = useRouter();

  const { initializeToken, fetchWithToken } = useJwtToken();

  // Inicializar el token cuando se monta el componente
  useEffect(() => {
    initializeToken();
  }, [initializeToken]);

  const { setUser, setClientData } = useContext(AppClientContext);

  const handleGoogleAuth = async () => {
    if (!acceptedTerms) {
      alert(
<<<<<<< HEAD
        "You must accept the terms and conditions and confirm your age before registering.",
=======
        'You must accept the terms and conditions and confirm your age before registering.',
>>>>>>> main
      );
      return;
    }

    try {
      // CAMBIO PRINCIPAL AQUÍ:
      // Ya no usamos signInWithPopup directamente.
      // Primero, obtenemos la credencial de Google usando el plugin nativo de Capacitor.
      const result = await FirebaseAuthentication.signInWithGoogle();

      // El resultado del plugin contiene la credencial necesaria, como el idToken de Google.
      const idToken = result.credential?.idToken;

      if (!idToken) {
        console.error(
<<<<<<< HEAD
          "❌ No se pudo obtener el ID Token de Google desde el plugin.",
        );
        // Aquí podrías añadir una lógica para manejar la cancelación por parte del usuario o un error específico del plugin.
        if (result.code === "cancelled") {
          alert("Registro cancelado por el usuario.");
        } else {
          alert("Error al obtener credenciales de Google. Intenta de nuevo.");
=======
          '❌ No se pudo obtener el ID Token de Google desde el plugin.',
        );
        // Aquí podrías añadir una lógica para manejar la cancelación por parte del usuario o un error específico del plugin.
        if (result.code === 'cancelled') {
          alert('Registro cancelado por el usuario.');
        } else {
          alert('Error al obtener credenciales de Google. Intenta de nuevo.');
>>>>>>> main
        }
        return;
      }

      // Una vez que tenemos el idToken de Google (obtenido de forma nativa),
      // creamos una credencial de Firebase a partir de él.
      const credential = GoogleAuthProvider.credential(idToken);

      // Y usamos signInWithCredential para iniciar sesión en Firebase con esta credencial.
      // Esto NO requiere una redirección del navegador.
      const firebaseUserCredential = await signInWithCredential(
        auth,
        credential,
      );
      const user = firebaseUserCredential.user;

      if (!user || !user.email) {
        console.error(
<<<<<<< HEAD
          "❌ No se pudo obtener la información del usuario de Firebase después de signInWithCredential.",
        );
        alert("Error en el registro. Intenta de nuevo.");
=======
          '❌ No se pudo obtener la información del usuario de Firebase después de signInWithCredential.',
        );
        alert('Error en el registro. Intenta de nuevo.');
>>>>>>> main
        return;
      }

      const userData = {
        name: user.displayName,
        email: user.email,
        uid: user.uid,
      };

      // ----------------------------------------------------------------------------------
      // ¡TODO EL RESTO DE TU LÓGICA DE NEGOCIO SE MANTIENE EXACTAMENTE IGUAL!
      // Ya que opera con el objeto 'user' de Firebase, que ya está autenticado.
      // ----------------------------------------------------------------------------------

      const response = await fetchWithToken(
<<<<<<< HEAD
        "https://8txnxmkveg.us-east-1.awsapprunner.com/api/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
=======
        'https://8txnxmkveg.us-east-1.awsapprunner.com/api/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
>>>>>>> main
          body: JSON.stringify(userData),
        },
      );

      const data = await response.json();

      if (response.status === 201) {
        console.log(
<<<<<<< HEAD
          "✅ Usuario registrado y guardado en la base de datos:",
=======
          '✅ Usuario registrado y guardado en la base de datos:',
>>>>>>> main
          data,
        );
        setUser(user);
        setClientData(data.client);
        router.push('/');
      } else if (response.status === 409) {
        console.warn(
<<<<<<< HEAD
          "⚠️ Usuario ya registrado. Iniciando sesión automáticamente...",
=======
          '⚠️ Usuario ya registrado. Iniciando sesión automáticamente...',
>>>>>>> main
        );

        const loginResponse = await fetchWithToken(
          `https://8txnxmkveg.us-east-1.awsapprunner.com/api/getClientData?uid=${user.uid}`,
        );
        const clientData = await loginResponse.json();

        if (loginResponse.ok) {
          console.log(
<<<<<<< HEAD
            "✅ Datos del cliente obtenidos al iniciar sesión:",
=======
            '✅ Datos del cliente obtenidos al iniciar sesión:',
>>>>>>> main
            clientData,
          );
          setUser(user);
          setClientData(clientData);
          router.push('/');
        } else {
          console.error('❌ Error al obtener los datos del cliente.');
          alert('Error al obtener tus datos. Intenta de nuevo.');
        }
      } else {
<<<<<<< HEAD
        console.error("❌ Error en el registro:", data);
        alert(
          "Error en el registro. Verifica tu conexión e intenta nuevamente.",
=======
        console.error('❌ Error en el registro:', data);
        alert(
          'Error en el registro. Verifica tu conexión e intenta nuevamente.',
>>>>>>> main
        );
      }
    } catch (error) {
      console.error('❌ Error al registrarse con Google:', error);
      // Aquí puedes manejar errores específicos del plugin o de Firebase Authentication
      // Por ejemplo, error si el usuario cancela la autenticación nativa
      if (error.code === "cancelled") {
        // No hacer nada, el usuario canceló
<<<<<<< HEAD
        console.log("Registro de Google cancelado por el usuario.");
      } else if (error.code === "auth/popup-closed-by-user") {
        // Para el caso web/PWA
        console.log("El popup de autenticación fue cerrado por el usuario.");
      } else {
        alert(
          "Error en la conexión con el servidor o autenticación fallida. Intenta de nuevo.",
=======
        console.log('Registro de Google cancelado por el usuario.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        // Para el caso web/PWA
        console.log('El popup de autenticación fue cerrado por el usuario.');
      } else {
        alert(
          'Error en la conexión con el servidor o autenticación fallida. Intenta de nuevo.',
>>>>>>> main
        );
      }
    }
  };

  return (
    <button
      className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition
      disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400
      "
      onClick={handleGoogleAuth}
      disabled={!isReliablyOnline} // El botón debería estar deshabilitado si los términos no son aceptados
    >
      Register
    </button>
  );
};

export default GoogleRegister;
