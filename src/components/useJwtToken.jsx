import { useCallback, useRef } from 'react';
import useOnlineStatus from './useOnlineStatus';

const useJwtToken = () => {
  const { isReliablyOnline } = useOnlineStatus();

  // 4️⃣ Prevenir "race conditions" al pedir un nuevo token
  // Este ref guardará la promesa de la petición en curso.
  const tokenPromiseRef = useRef(null);

  // Verifica si el token ha expirado
  const isTokenExpired = useCallback((token) => {
    // 1️⃣ GUARDIA SSR: Si estamos en el servidor, no hay 'atob' ni 'localStorage'.
    // Devolvemos 'true' para forzar la obtención de un token en el cliente.
    if (typeof window === 'undefined') return true;

    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload?.exp < currentTime;
    } catch (error) {
      console.error(
        '❌ Error al decodificar el token (probablemente malformado):',
        error,
      );
      // Si el token no se puede decodificar, lo consideramos inválido/expirado.
      return true;
    }
  }, []);

  // Obtiene un nuevo token desde el backend
  const getNewToken = useCallback(async () => {
    // 4️⃣ Si ya hay una petición de token en curso, devolvemos esa misma promesa
    // para no hacer múltiples llamadas a la API.
    if (tokenPromiseRef.current) {
      return tokenPromiseRef.current;
    }

    // Guardamos la promesa en el ref para que las llamadas subsiguientes la usen.
    tokenPromiseRef.current = (async () => {
      try {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔧 Modo Desarrollo: Usando un token JWT de prueba.');
          const mockToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldmVsb3BlciIsImlhdCI6MTUxNjIzOTAyMiwgImV4cCI6OTk5OTk5OTk5OX0.fake-token-for-dev';
          localStorage.setItem('jwt_token', mockToken);
          return mockToken;
        }

        if (!isReliablyOnline) {
          throw new Error('No hay conexión a Internet');
        }

        const res = await fetch(
          'https://8txnxmkveg.us-east-1.awsapprunner.com/api/request-token',
        );

        // 3️⃣ VERIFICACIÓN DE RESPUESTA: Comprobar si la petición fue exitosa (status 200-299)
        if (!res.ok) {
          throw new Error(`Error del servidor al pedir token: ${res.status}`);
        }

        const data = await res.json();

        if (data?.token) {
          localStorage.setItem('jwt_token', data.token);
          return data.token;
        } else {
          throw new Error('La API no devolvió un token válido');
        }
      } catch (err) {
        console.error('❌ Error en getNewToken:', err.message);
        // Devolvemos null para que otras partes de la app sepan que falló.
        return null;
      }
    })();

    try {
      return await tokenPromiseRef.current;
    } finally {
      // Limpiamos el ref una vez que la promesa se resuelve (con éxito o error)
      tokenPromiseRef.current = null;
    }

    // 2️⃣ DEPENDENCIAS CORRECTAS: getNewToken depende de isReliablyOnline.
  }, [isReliablyOnline]);

  const ensureValidToken = useCallback(async () => {
    // 1️⃣ GUARDIA SSR: No hacer nada en el servidor.
    if (typeof window === 'undefined') return null;

    let token = localStorage.getItem('jwt_token');

    if (!token || isTokenExpired(token)) {
      console.log('🔄 Token no válido o expirado, obteniendo uno nuevo...');
      token = await getNewToken();
    }

    return token;
    // 2️⃣ DEPENDENCIAS CORRECTAS: Esta función usa isTokenExpired y getNewToken.
  }, [isTokenExpired, getNewToken]);

  const initializeToken = useCallback(async () => {
    // La lógica de ensureValidToken ya hace esto. Podemos reutilizarla.
    await ensureValidToken();
    // 2️⃣ DEPENDENCIAS CORRECTAS
  }, [ensureValidToken]);

  const fetchWithToken = useCallback(
    async (url, options = {}) => {
      // 1️⃣ GUARDIA SSR
      if (typeof window === 'undefined') {
        throw new Error(
          'fetchWithToken no se puede usar en el lado del servidor.',
        );
      }

      let token = await ensureValidToken();
      if (!token) {
        throw new Error(
          'No se pudo obtener un token JWT válido para la petición.',
        );
      }

      const headers = { ...options.headers, Authorization: `Bearer ${token}` };
      let response = await fetch(url, { ...options, headers });

      if (response.status === 401) {
        console.log('⚠️ Token rechazado (401), reintentando con uno nuevo...');
        const newToken = await getNewToken(); // getNewToken ya maneja la "race condition"

        if (newToken) {
          headers.Authorization = `Bearer ${newToken}`;
          response = await fetch(url, { ...options, headers }); // Reintento
        } else {
          throw new Error('Fallo al renovar el token después de un error 401.');
        }
      }

      return response;
      // 2️⃣ DEPENDENCIAS CORRECTAS
    },
    [ensureValidToken, getNewToken],
  );

  return {
    initializeToken,
    ensureValidToken,
    fetchWithToken,
  };
};

export default useJwtToken;
