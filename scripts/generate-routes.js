const fs = require("fs").promises;
const path = require("path");
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");
require("dotenv").config({ path: `.env.local` }); // Carga las variables de .env.local

// Configuración de Firebase

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
async function generateRoutes() {
  try {
    // --- DEBUG: Verificando qué configuración de Firebase se está usando ---
    console.log("DEBUG: GenerateRoutes script...");
    console.log(`DEBUG: Firebase project: ${firebaseConfig.projectId}`);
    // --- Fin DEBUG ---

    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Obtener las categorías de los quizzes desde Firestore
    //console.log("DEBUG: Intentando obtener quizzes de la colección 'quizzes' en Firestore...");
    const snapshot = await getDocs(collection(db, "quizzes"));
    console.log(`DEBUG: ${snapshot.size} documents in 'quizzes' collection.`); // Usamos .size para saber cuántos docs se encontraron

    const categories = new Set();
    const quizRoutes = [];

    const fixedroutes = [
      "/",
      "/quizzes/",
      "/cookies/",
      "/privacypolicy/",
      "/termsofservice/",
      "/signin/",
      "/about/",
      "/feathers/",
      "/profile/",
      "/games/",
      "/games/alphabetsoup/",
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

    console.log(`DEBUG: category routes: ${Array.from(categories).length}`);
    console.log(`DEBUG: quizzes routes: ${quizRoutes.length}`);

    const routesToPrecache = fixedroutes
      .concat(Array.from(categories))
      .concat(quizRoutes); // Añadir fixedroutes al principio

    // Escribir las rutas en el archivo routesprecache.json
    const filePath = path.join(
      __dirname,
      "..",
      "public",
      "routesprecache.json",
    );
    await fs.writeFile(filePath, JSON.stringify(routesToPrecache), "utf-8");
    console.log(
      "Archivo public/routesprecache.json generado exitosamente con las categorías de quizzes.",
    );
    console.log(
      "DEBUG: Contenido total del archivo routesprecache.json (primeras 500 chars):",
      JSON.stringify(routesToPrecache).substring(0, 500) + "...",
    );
  } catch (error) {
    console.error(
      "Error al obtener las categorías de Firebase o al escribir el archivo:",
      error,
    );
    // DEBUG: Mostrar el stack de error completo
    console.error("DEBUG: Stack del error:", error.stack);
  }
}

generateRoutes();
