import React, { useEffect, useState } from 'react';
import { AdMob } from '@capacitor-community/admob';

const AdMobBanner1 = () => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(null); // Para almacenar errores

  useEffect(() => {
    const initializeAdMob = async () => {
      try {
        // Inicializa AdMob
        await AdMob.initialize({
          requestTrackingAuthorization: true,
          testingDevices: [],
          initializeForTesting: true, // <-- AHORA EN TRUE para depuración
        });

        // *** Añade Event Listeners aquí para ver lo que sucede ***
        AdMob.addListener('onAdLoaded', (rewardItem) => {
          console.log('AdMob: Anuncio cargado correctamente!', rewardItem);
          setAdLoaded(true);
          setAdError(null); // Limpia cualquier error anterior
        });

        AdMob.addListener('onAdFailedToLoad', (error) => {
          console.error('AdMob: Falló la carga del anuncio!', error);
          setAdLoaded(false);
          setAdError(error); // Guarda el error para mostrarlo si es necesario
        });

        AdMob.addListener('onAdFailedToShow', (error) => {
          console.error('AdMob: Falló al mostrar el anuncio!', error);
          setAdLoaded(false);
          setAdError(error);
        });

        console.log('AdMob: Intentando mostrar el banner...');
        // Prepara y muestra el banner ad
        await AdMob.showBanner({
          adId: 'ca-app-pub-7055753745584437/3645442365', // Tu ID de anuncio real
          position: AdMob.AD_POSITION.BOTTOM_CENTER,
        });

        // NOTA: setAdLoaded(true) se hará dentro del listener 'onAdLoaded'
      } catch (error) {
        console.error(
          'AdMob: Error en la inicialización o al intentar mostrar el banner (nivel de try-catch):',
          error,
        );
        setAdError(error);
      }
    };

    if (window.Capacitor) {
      // Asegura que Capacitor esté disponible (i.e., ejecutándose en una plataforma nativa)
      initializeAdMob();
    } else {
      console.warn(
        'AdMob: Capacitor no está disponible. ¿Ejecutando en navegador web?',
      );
    }

    return () => {
      // Limpieza: ocultar y eliminar el banner cuando el componente se desmonte
      if (window.Capacitor && adLoaded) {
        AdMob.hideBanner();
        AdMob.removeAllListeners(); // Importante para evitar fugas de memoria
      }
    };
  }, []); // El array de dependencias vacío asegura que se ejecute solo una vez al montar

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      {adLoaded ? (
        <p>Ad Banner (Nativo) - ¡Cargado!</p>
      ) : (
        <p>Cargando Anuncio...</p>
      )}
      {adError && (
        <p style={{ color: 'red' }}>
          Error del Anuncio: {adError.message || JSON.stringify(adError)}
        </p>
      )}
    </div>
  );
};

export default AdMobBanner1;
