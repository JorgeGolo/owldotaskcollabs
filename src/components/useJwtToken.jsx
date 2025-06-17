import { useCallback } from "react";
import useOnlineStatus from "./useOnlineStatus";
/**
 * Hook personalizado para manejar la autenticación con JWT tokens
 * Gestiona automáticamente la renovación de tokens expirados
 */
const useJwtToken = () => {
  const { isReliablyOnline } = useOnlineStatus();

  // Verifica si el token ha expirado
  const isTokenExpired = (token) => {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload && payload.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
      }
      return true;
    } catch (error) {
      console.error(
<<<<<<< HEAD
        "❌ Front-useJwtToken Error al verificar la expiración del token:",
=======
        '❌ Front-useJwtToken Error al verificar la expiración del token:',
>>>>>>> main
        error,
      );
      return true;
    }
  };

  // Obtiene un nuevo token desde el backend
  const getNewToken = async () => {
    // Si no hay conexión, no se puede obtener un nuevo token
    if (!isReliablyOnline) {
      console.error(
<<<<<<< HEAD
        "❌ Front-useJwtToken No se puede obtener un nuevo token, no hay conexión a Internet",
=======
        '❌ Front-useJwtToken No se puede obtener un nuevo token, no hay conexión a Internet',
>>>>>>> main
      );
      return null;
    }

    try {
      const res = await fetch(
<<<<<<< HEAD
        "https://8txnxmkveg.us-east-1.awsapprunner.com/api/request-token",
=======
        'https://8txnxmkveg.us-east-1.awsapprunner.com/api/request-token',
>>>>>>> main
      );
      const data = await res.json();

      if (data && data.token) {
        localStorage.setItem('jwt_token', data.token); // ✅ Guardar token
        return data.token;
      } else {
        throw new Error('Front-useJwtToken No se recibió un token válido');
      }
    } catch (err) {
      console.error('❌ Front-useJwtToken Error al pedir el JWT:', err);
      return null;
    }
  };

  // Asegura que el token actual es válido, y si no lo es, lo renueva
  const ensureValidToken = useCallback(async () => {
    let token = localStorage.getItem('jwt_token');

    if (!token || isTokenExpired(token)) {
      token = await getNewToken();
    }

    return token;
  }, []);

  // Inicializa el token al cargar la app si no existe o ha expirado
  const initializeToken = useCallback(async () => {
    const token = localStorage.getItem('jwt_token');
    if (!token || isTokenExpired(token)) {
      await getNewToken();
    }
  }, []);

  // Hace peticiones con token, gestionando renovación automática si es necesario
  const fetchWithToken = useCallback(
    async (url, options = {}) => {
      try {
        let token = await ensureValidToken();

        if (!token) {
          throw new Error(
<<<<<<< HEAD
            "Front-useJwtToken No se pudo obtener un token JWT válido",
=======
            'Front-useJwtToken No se pudo obtener un token JWT válido',
>>>>>>> main
          );
        }

        const headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };

        let response = await fetch(url, {
          ...options,
          headers,
        });

        // Si el token expiró y falla con 401, obtener uno nuevo
        if (response.status === 401) {
          console.log(
<<<<<<< HEAD
            "⚠️ Front-useJwtToken Token expirado, obteniendo uno nuevo...",
=======
            '⚠️ Front-useJwtToken Token expirado, obteniendo uno nuevo...',
>>>>>>> main
          );
          const newToken = await getNewToken();

          if (newToken) {
<<<<<<< HEAD
            localStorage.setItem("jwt_token", newToken); // ✅ asegurarse de guardar el nuevo token
=======
            localStorage.setItem('jwt_token', newToken); // ✅ asegurarse de guardar el nuevo token
>>>>>>> main
            headers.Authorization = `Bearer ${newToken}`;
            response = await fetch(url, {
              ...options,
              headers,
            });
          } else {
            throw new Error(
<<<<<<< HEAD
              "Front-useJwtToken No se pudo obtener un nuevo token después de expiración",
=======
              'Front-useJwtToken No se pudo obtener un nuevo token después de expiración',
>>>>>>> main
            );
          }
        }

        return response;
      } catch (error) {
<<<<<<< HEAD
        console.error("❌Front-useJwtToken Error en fetchWithToken:", error);
=======
        console.error('❌Front-useJwtToken Error en fetchWithToken:', error);
>>>>>>> main
        throw error;
      }
    },
    [ensureValidToken],
  );

  return {
    initializeToken,
    ensureValidToken,
    fetchWithToken,
    isTokenExpired,
    getNewToken,
  };
};

export default useJwtToken;
