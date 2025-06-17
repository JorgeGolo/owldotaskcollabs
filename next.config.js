const BUILD_DATE = new Date().toISOString().split('T')[1]; // formato YYYY-MM-DD
const packageJson = require('./package.json');
const APP_VERSION = packageJson.version;

// Configuración de Next.js
const nextConfig = {
  trailingSlash: true, // Añade una barra diagonal al final de las URLs (ej., /about/ en lugar de /about)
  output: 'export', // Usa el modo "export" de Next.js para generar un sitio estático
  images: {
    unoptimized: true, // Indica que las imágenes no deben ser optimizadas durante la build (útil con 'output: export')
  },
  env: {
    APP_VERSION: APP_VERSION,
  },
};

// Configuración de Next-PWA (Progressive Web App)
const withPWA = require("next-pwa")({
  dest: "public", // Directorio donde se generarán los archivos del Service Worker y manifest.json
  register: true, // Indica si se debe registrar el Service Worker automáticamente
  skipWaiting: true, // Fuerza al nuevo Service Worker a activarse inmediatamente, sin esperar a que se cierren las pestañas anteriores

  // Precaching automático de rutas SSG (Next.js export)
  additionalManifestEntries: (() => {
    const fs = require('fs');
    const path = require('path');
    let routes = ['/', '/offline/']; // Rutas predeterminadas

    try {
      // Leer el archivo routesprecatch.json de la carpeta public
      const routesFilePath = path.join(
        __dirname,
        'public',
        'routesprecache.json',
      );

      if (fs.existsSync(routesFilePath)) {
        const routesData = fs.readFileSync(routesFilePath, "utf8");
        const parsedRoutes = JSON.parse(routesData);

        // Verifica que el contenido sea un array
        if (Array.isArray(parsedRoutes) && parsedRoutes.length > 0) {
          routes = parsedRoutes;
          console.log("Rutas cargadas correctamente para precaching:", routes);
        }
      } else {
        console.log(
          'Archivo routesprecatch.json no encontrado, usando rutas predeterminadas',
        );
      }
    } catch (error) {
      console.error(
        'Error al leer el archivo de rutas para precaching:',
        error,
      );
    }

    //return routes.map(url => ({ url, revision: null }));
    return routes.map((url) => ({ url, revision: BUILD_DATE }));
  })(),

  runtimeCaching: [
    // Configuración del cacheo en tiempo de ejecución (para recursos dinámicos)
    {
      urlPattern: /\/quizzes\/.*/, // Patrón de URL para las rutas relacionadas con "quizzes"
      handler: "NetworkFirst", // Estrategia de caché: intenta obtener de la red primero, luego de la caché si falla
      options: {
        cacheName: "quizzes-cache", // Nombre de la caché para estos recursos
        networkTimeoutSeconds: 3, // Tiempo máximo de espera para la red antes de usar la caché (en segundos)
        expiration: {
          maxEntries: 100, // Máximo número de entradas en la caché
          maxAgeSeconds: 1 * 24 * 60 * 60, // Tiempo máximo de vida de una entrada en la caché: 1 días
        },
        plugins: [
          {
            cacheWillUpdate: async ({ response }) => {
              // Plugin para controlar la actualización de la caché
              // Solo cachea respuestas exitosas (código de estado 200)
              if (response && response.status === 200) {
                return response;
              }
              return null; // No cachea respuestas con otros códigos de estado
            },
          },
        ],
      },
    },
    {
      urlPattern: /\.(png|svg|ico|jpg)$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: 'static-assets', // Usará el hash real
        expiration: { maxEntries: 100, maxAgeSeconds: 86400 },
      },
    },
    // **AÑADIR ESTA SECCIÓN PARA LAS PORTADAS DE LIBROS**
    {
      urlPattern: /\/assets\/bookcovers\/.*/, // **AJUSTADO: sin el dominio completo**
      handler: "CacheFirst", // O 'NetworkFirst' según tu preferencia
      options: {
        cacheName: "bookcovers-cache",
        expiration: {
          maxEntries: 500, // Ajusta el número de entradas
          maxAgeSeconds: 60 * 24 * 60 * 60, // Ejemplo: 60 días
        },
      },
    },
  ],

  // Especifica los archivos a excluir del precaching en el build
  buildExcludes: [
    /middleware-manifest\.json$/,
    /_middleware\.js$/,
    ///_buildManifest\.js$/,
    /app-build-manifest\.json$/,
    /dynamic-css-manifest\.json$/,
  ],
});

// Exportar configuración con PWA habilitado
module.exports = withPWA(nextConfig);
