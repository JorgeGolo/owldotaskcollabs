import React, { useContext } from "react";
import { getAuth, GoogleAuthProvider, signInWithCredential, signOut } from "firebase/auth"; // CAMBIO: Importamos signInWithCredential
import { app } from "../firebase";
import { useRouter } from "next/router";
import { AppClientContext } from "../context/ClientDataProvider";

import useOnlineStatus from "../components/useOnlineStatus";

import { FirebaseAuthentication } from '@capacitor-firebase/authentication';


const GoogleLogin = () => {
  const { isReliablyOnline } = useOnlineStatus();

  const auth = getAuth(app);
  const router = useRouter();
  const { setUser, setClientData, fetchWithToken } = useContext(AppClientContext);

  const handlePreLoginCheck = async () => {
    try {
      // CAMBIO GRANDE AQUÍ: Ya no usamos GoogleAuthProvider directamente ni signInWithPopup
      // Ahora usamos el plugin nativo de Capacitor para iniciar sesión con Google
      const result = await FirebaseAuthentication.signInWithGoogle(); // Llama al método nativo de Google Sign-In

      // El 'result' del plugin contiene la credencial necesaria
      // Por ejemplo, para Google, suele ser un idToken
      const idToken = result.credential?.idToken; // Acceder al idToken desde el resultado del plugin

      if (!idToken) { // CAMBIO: Validamos si obtuvimos el idToken nativo
        console.error("❌ No se pudo obtener el ID Token de Google desde el plugin.");
        return;
      }

      // CAMBIO: Creamos una credencial de Firebase con el idToken obtenido
      const credential = GoogleAuthProvider.credential(idToken);

      // CAMBIO: Iniciamos sesión en Firebase con la credencial obtenida nativamente
      const firebaseUserCredential = await signInWithCredential(auth, credential);
      const user = firebaseUserCredential.user; // Obtenemos el objeto user de Firebase

      if (!user || !user.email) {
        console.error("❌ No se pudo obtener la información del usuario de Firebase.");
        return;
      }

      const response = await fetchWithToken(
        `https://8txnxmkveg.us-east-1.awsapprunner.com/api/registerCheck/${user.email}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.registered) {
          setUser(user);

          const clientResponse = await fetchWithToken(
            `https://8txnxmkveg.us-east-1.awsapprunner.com/api/getClientData?uid=${user.uid}`
          );

          const clientData = await clientResponse.json();
          if (clientResponse.ok) {
            setClientData(clientData);
          } else {
            console.warn("⚠️ No se pudieron cargar los datos del cliente.");
            setClientData(null);
          }

        } else {
          console.warn("⚠️ Usuario no registrado. Cancelando login...");
          await signOut(auth);
          //router.push("/signin");
          router.push("/signin?message=not-registered");
        }
        
      } else {
        console.error("❌ Error en la respuesta del servidor:", await response.text());
        await signOut(auth);
        //router.push("/signin");
      }
    } catch (error) {
      console.error("⚠️ Error al verificar el usuario antes del login:", error);
      // Aquí puedes añadir más lógica para manejar errores específicos del plugin
      // Por ejemplo, si el usuario cancela la autenticación nativa
      if (error.code === 'cancelled') { // Ejemplo de código de error si el usuario cancela
          console.log('Login de Google cancelado por el usuario.');
      }
      try {
        await signOut(auth);
      } catch (signOutError) {
        console.error("⚠️ Error al cerrar sesión:", signOutError);
      }
      //router.push("/signin");
    }
  };

  return (
    <button
      className="inline-block bg-white text-black p-2 rounded hover:bg-gray-600 transition
      disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400
      "
      disabled={!isReliablyOnline ? true : false}
      onClick={handlePreLoginCheck}
    >
      Login
    </button>
  );
};

export default GoogleLogin;