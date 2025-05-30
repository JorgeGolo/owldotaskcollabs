import React, { useContext, useEffect } from "react";
import { getAuth, GoogleAuthProvider, signInWithCredential } from "firebase/auth"; // CAMBIO: Importamos signInWithCredential
import { app } from "../firebase";
import { useRouter } from "next/router";
import { AppClientContext } from "../context/ClientDataProvider"; 

import useJwtToken from './useJwtToken'; // Importar el hook que creamos

// CAMBIO: Importamos el plugin de Capacitor
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';


const GoogleRegister = ({ acceptedTerms }) => {
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
      alert("You must accept the terms and conditions and confirm your age before registering.");
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
        console.error("❌ No se pudo obtener el ID Token de Google desde el plugin.");
        // Aquí podrías añadir una lógica para manejar la cancelación por parte del usuario o un error específico del plugin.
        if (result.code === 'cancelled') {
            alert("Registro cancelado por el usuario.");
        } else {
            alert("Error al obtener credenciales de Google. Intenta de nuevo.");
        }
        return;
      }

      // Una vez que tenemos el idToken de Google (obtenido de forma nativa),
      // creamos una credencial de Firebase a partir de él.
      const credential = GoogleAuthProvider.credential(idToken);

      // Y usamos signInWithCredential para iniciar sesión en Firebase con esta credencial.
      // Esto NO requiere una redirección del navegador.
      const firebaseUserCredential = await signInWithCredential(auth, credential);
      const user = firebaseUserCredential.user;

      if (!user || !user.email) {
        console.error("❌ No se pudo obtener la información del usuario de Firebase después de signInWithCredential.");
        alert("Error en el registro. Intenta de nuevo.");
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

      const response = await fetchWithToken("https://8txnxmkveg.us-east-1.awsapprunner.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.status === 201) {
        console.log("✅ Usuario registrado y guardado en la base de datos:", data);
        setUser(user);
        setClientData(data.client);
        router.push("/");
      } else if (response.status === 409) {
        console.warn("⚠️ Usuario ya registrado. Iniciando sesión automáticamente...");

        const loginResponse = await fetchWithToken(
          `https://8txnxmkveg.us-east-1.awsapprunner.com/api/getClientData?uid=${user.uid}`
        );
        const clientData = await loginResponse.json();

        if (loginResponse.ok) {
          console.log("✅ Datos del cliente obtenidos al iniciar sesión:", clientData);
          setUser(user);
          setClientData(clientData);
          router.push("/");
        } else {
          console.error("❌ Error al obtener los datos del cliente.");
          alert("Error al obtener tus datos. Intenta de nuevo.");
        }
      } else {
        console.error("❌ Error en el registro:", data);
        alert("Error en el registro. Verifica tu conexión e intenta nuevamente.");
      }
    } catch (error) {
      console.error("❌ Error al registrarse con Google:", error);
      // Aquí puedes manejar errores específicos del plugin o de Firebase Authentication
      // Por ejemplo, error si el usuario cancela la autenticación nativa
      if (error.code === 'cancelled') {
        // No hacer nada, el usuario canceló
        console.log('Registro de Google cancelado por el usuario.');
      } else if (error.code === 'auth/popup-closed-by-user') { // Para el caso web/PWA
        console.log('El popup de autenticación fue cerrado por el usuario.');
      } else {
        alert("Error en la conexión con el servidor o autenticación fallida. Intenta de nuevo.");
      }
    }
  };

  return (
    <button
      className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition"
      onClick={handleGoogleAuth}
      disabled={!acceptedTerms} // El botón debería estar deshabilitado si los términos no son aceptados
    >
      Register
    </button>
  );
};

export default GoogleRegister;