import { useState, useEffect } from 'react';

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true); //  Estado inicial: asumimos online
  const [isReliablyOnline, setIsReliablyOnline] = useState(true); // Nuevo estado para conexión "confiable"

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleOnline = () => {
        setIsOnline(true);
        //  Posiblemente también iniciar la prueba de conectividad aquí
        testConnectivity();
      };

      const handleOffline = () => {
        setIsOnline(false);
        setIsReliablyOnline(false); //  Asumimos no confiable al ir offline
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      //  Prueba inicial y periódica de conectividad
      testConnectivity();
      const intervalId = setInterval(testConnectivity, 5000); //  Prueba cada 5 segundos

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        clearInterval(intervalId);
      };
    }
  }, []);

  // Función para probar la conectividad real
  const testConnectivity = async () => {
    try {
      const response = await fetch('https://8txnxmkveg.us-east-1.awsapprunner.com/health', { //  Cambia a una URL de tu API
        method: 'HEAD', //  Más eficiente que GET para solo verificar el estado
        cache: 'no-store', //  Asegura que no use la caché
      });
      setIsReliablyOnline(response.ok); //  Actualiza el estado de "confiable"
    } catch (error) {
      setIsReliablyOnline(false); //  Error = no confiable
    }
  };

  return { isOnline, isReliablyOnline }; //  Devolvemos ambos estados
}

export default useOnlineStatus;