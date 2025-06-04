const fs = require('fs').promises;
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
require('dotenv').config();

// Configuración de Firebase


const firebaseConfig2 = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbBaraOB7_FlHzxMIB8q2c5Dy8k83YZk0",
  authDomain: "feathers-dev-464d4.firebaseapp.com",
  projectId: "feathers-dev-464d4",
  storageBucket: "feathers-dev-464d4.firebasestorage.app",
  messagingSenderId: "826572721907",
  appId: "1:826572721907:web:2ed0ab48a91e413ef3b186"
};

async function generateRoutes() {
  try {
    // --- DEBUG: Verificando qué configuración de Firebase se está usando ---
    console.log("DEBUG: Iniciando generateRoutes script...");
    console.log("DEBUG: Usando la configuración 'firebaseConfig' hardcodeada.");
    console.log(`DEBUG: Proyecto de Firebase utilizado: ${firebaseConfig.projectId}`);
    console.log(`DEBUG: API Key utilizada (primeros 5 caracteres): ${firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 5) + '...' : 'No definida'}`);
    // --- Fin DEBUG ---

    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Obtener las categorías de los quizzes desde Firestore
    console.log("DEBUG: Intentando obtener quizzes de la colección 'quizzes' en Firestore...");
    const snapshot = await getDocs(collection(db, "quizzes"));
    console.log(`DEBUG: Se encontraron ${snapshot.size} documentos en la colección 'quizzes'.`); // Usamos .size para saber cuántos docs se encontraron

    const categories = new Set();
    const quizRoutes = [];

    const fixedroutes = [
      '/',
      '/quizzes/',
      '/cookies/',
      '/privacypolicy/',
      '/termsofservice/',
      '/signin/',
      '/about/',
      '/feathers/',
      '/profile/',
      '/games/',
      '/games/alphabetsoup/',
    ];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.category_slug) {
        categories.add(`/quizzes/${data.category_slug}/`);
      }
      if (data.category_slug && data.title_slug) {
        quizRoutes.push(`/quizzes/${data.category_slug}/${data.title_slug}/`);
      }
    });

    console.log(`DEBUG: Rutas de categorías dinámicas encontradas: ${Array.from(categories).length}`);
    console.log(`DEBUG: Rutas de quizzes dinámicas encontradas: ${quizRoutes.length}`);

    const routesToPrecache = fixedroutes.concat(Array.from(categories)).concat(quizRoutes); // Añadir fixedroutes al principio

    // Escribir las rutas en el archivo routesprecache.json
    const filePath = path.join(__dirname, '..', 'public', 'routesprecache.json');
    await fs.writeFile(filePath, JSON.stringify(routesToPrecache), 'utf-8');
    console.log('Archivo public/routesprecache.json generado exitosamente con las categorías de quizzes.');
    console.log("DEBUG: Contenido total del archivo routesprecache.json (primeras 500 chars):", JSON.stringify(routesToPrecache).substring(0, 500) + '...');
  } catch (error) {
    console.error('Error al obtener las categorías de Firebase o al escribir el archivo:', error);
    // DEBUG: Mostrar el stack de error completo
    console.error('DEBUG: Stack del error:', error.stack);
  }
}

generateRoutes();