// pages/_app.js
import { useEffect, useState } from 'react'; // Importa useState
import '../styles/global.css';
import { ClientDataProvider } from '../context/ClientDataProvider';
import Layout from '../components/Layout';
import { ThemeProvider } from '../context/ThemeContextProvider';

function MyApp({ Component, pageProps }) {
  const [newVersionAvailable, setNewVersionAvailable] = useState(false); // Estado para la nueva versión

  useEffect(() => {
    const isCapacitor = typeof window !== 'undefined' && window.Capacitor;

    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      !isCapacitor
    ) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registrado para APK:', registration.scope);

          // Escucha los cambios en la actualización del Service Worker
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (
                  newWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  // Un nuevo worker está instalado y listo para activar en la próxima recarga
                  setNewVersionAvailable(true);
                  console.log('¡Nueva versión del Service Worker instalada!');
                }
              });
            }
          });

          // Opcional: Verifica si ya hay un Service Worker en espera (ej. si el usuario ya estaba en la página)
          if (registration.waiting) {
            setNewVersionAvailable(true);
          }
        })
        .catch((err) => {
          console.error('Error registrando SW:', err);
        });

      // Escucha mensajes del Service Worker (si decides enviarlos desde sw.js)
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'NEW_VERSION_AVAILABLE') {
          setNewVersionAvailable(true);
        }
      });
    } else if (process.env.NODE_ENV === 'development') {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((reg) => reg.unregister());
      });
    }
  }, []);

  // Función para forzar la recarga de la página
  const handleRefresh = () => {
    window.location.reload(true); // El 'true' asegura una recarga completa desde el servidor
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <ClientDataProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>

        {/* Mensaje de aviso de nueva versión */}
        {newVersionAvailable && (
          <div
            style={{
              position: 'fixed',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#333',
              color: 'white',
              padding: '15px 20px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              zIndex: 1000,
              textAlign: 'center',
            }}
          >
            A new version is available
            <button
              onClick={handleRefresh}
              style={{
                marginLeft: '20px',
                padding: '8px 15px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Update now
            </button>
          </div>
        )}
      </ClientDataProvider>
    </ThemeProvider>
  );
}

export default MyApp;
