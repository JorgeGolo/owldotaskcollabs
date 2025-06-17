// Actualización del contexto usando APP_VERSION
import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
<<<<<<< HEAD
} from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../firebase";
=======
} from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from '../firebase';
>>>>>>> main
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
  FaFeather,
  FaReddit,
<<<<<<< HEAD
} from "react-icons/fa";
=======
} from 'react-icons/fa';
>>>>>>> main
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  RedditShareButton,
<<<<<<< HEAD
} from "react-share";
import { Bebas_Neue } from "next/font/google";
=======
} from 'react-share';
import { Bebas_Neue } from 'next/font/google';
>>>>>>> main

import useJwtToken from "../components/useJwtToken";
import useOnlineStatus from "../components/useOnlineStatus";

import LevelUpPopup from "../components/LevelUpPopup"; // Asegúrate de que la ruta sea correcta

// ⚙️ Importa y configura la fuente
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const AppClientContext = createContext();

export const ClientDataProvider = ({ children }) => {
  const { isReliablyOnline } = useOnlineStatus();

  const [user, setUser] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [levelData, setGlobalLevels] = useState(null);
  const [iconCategories, setIconCategories] = useState([]);

  const { initializeToken, fetchWithToken } = useJwtToken();

  const [canEarnPoints, setCanEarnPoints] = useState("cargando");
  const [pointsError, setPointsError] = useState(null);
  const [canEarnPointsFromGames, setCanEarnPointsFromGames] = useState(null);
  const [pointsForGamesError, setPointsFromGamesError] = useState(null);

  // 🆕 Usar APP_VERSION para versionado de datos
<<<<<<< HEAD
  const CURRENT_APP_VERSION = process.env.APP_VERSION || "1.0.0";
=======
  const CURRENT_APP_VERSION = process.env.APP_VERSION || '1.0.0';
>>>>>>> main

  // --- Estados y funciones para el LevelUpPopup ---
  const [isLevelUpPopupOpen, setIsLevelUpPopupOpen] = useState(false);
  const [levelUpDisplayedLevel, setLevelUpDisplayedLevel] = useState(0);

  const showLevelUpPopup = useCallback((level) => {
    setLevelUpDisplayedLevel(level);
    setIsLevelUpPopupOpen(true);
  }, []);

  const hideLevelUpPopup = useCallback(() => {
    setIsLevelUpPopupOpen(false);
  }, []);
  const socialIcons = useMemo(
    () => [
<<<<<<< HEAD
      { icon: <FaFacebook size={20} />, link: "https://facebook.com" },
      { icon: <FaTwitter size={20} />, link: "https://twitter.com" },
      { icon: <FaWhatsapp size={20} />, link: "https://instagram.com" },
=======
      { icon: <FaFacebook size={20} />, link: 'https://facebook.com' },
      { icon: <FaTwitter size={20} />, link: 'https://twitter.com' },
      { icon: <FaWhatsapp size={20} />, link: 'https://instagram.com' },
>>>>>>> main
    ],
    [],
  );

  const socialIcons2 = useMemo(
    () => [
      {
        icon: <FaFacebook size={20} />,
<<<<<<< HEAD
        link: "https://www.facebook.com/owldotask/",
      },
      { icon: <FaTwitter size={20} />, link: "https://x.com/owldotask" },
      {
        icon: <FaInstagram size={20} />,
        link: "https://www.instagram.com/owldotask",
=======
        link: 'https://www.facebook.com/owldotask/',
      },
      { icon: <FaTwitter size={20} />, link: 'https://x.com/owldotask' },
      {
        icon: <FaInstagram size={20} />,
        link: 'https://www.instagram.com/owldotask',
>>>>>>> main
      },
    ],
    [],
  );

  useEffect(() => {
    initializeToken();
  }, [initializeToken]);

  const featherIcon = useMemo(() => <FaFeather />, []);

  const shareOnSocial = (platform, url, message) => {
    switch (platform) {
      case "facebook":
        return (
          <span className="flex items-center justify-center">
            <FacebookShareButton url={url} quote={message}>
              <FaFacebook size={24} />
            </FacebookShareButton>
          </span>
        );
      case "twitter":
        return (
          <span className="flex items-center justify-center">
            <TwitterShareButton url={url} title={message}>
              <FaTwitter size={24} />
            </TwitterShareButton>
          </span>
        );
      case "whatsapp":
        return (
          <span className="flex items-center justify-center">
            <WhatsappShareButton url={url} title={message}>
              <FaWhatsapp size={24} />
            </WhatsappShareButton>
          </span>
        );
      case "reddit":
        return (
          <span className="flex items-center justify-center">
            <RedditShareButton url={url} title={message}>
              <FaReddit size={24} />
            </RedditShareButton>
          </span>
        );
      default:
        return null;
    }
  };

  const checkCanEarnPoints = async (userId) => {
    try {
      if (!userId) {
        //console.log("❌ Error: No hay usuario autenticado");
        setCanEarnPoints(false);
        return false;
      }

      const response = await fetchWithToken(
        `https://8txnxmkveg.us-east-1.awsapprunner.com/api/checkMaxLevels?uid=${userId}`,
        {
<<<<<<< HEAD
          method: "GET",
          headers: { "Content-Type": "application/json" },
=======
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
>>>>>>> main
        },
      );

      const data = await response.json();

      if (data.success) {
        setCanEarnPoints(data.canEarnPoints);
        return data.canEarnPoints;
      } else {
        setPointsError(data.message || 'Error en la respuesta');
        return false;
      }
    } catch (error) {
      console.error(`❌ Error checkCanEarnPoints:`, error);
      setPointsError(error.message);
      return false;
    }
  };

  const checkCanEarnPointsFromGames = async (userId) => {
    try {
      if (!userId) {
        //console.log("❌ Error: No hay usuario autenticado");
        setCanEarnPointsFromGames(false);
        return false;
      }

      const response = await fetchWithToken(
        `https://8txnxmkveg.us-east-1.awsapprunner.com/api/checkGamesMaxLevels?uid=${userId}`,
        {
<<<<<<< HEAD
          method: "GET",
          headers: { "Content-Type": "application/json" },
=======
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
>>>>>>> main
        },
      );

      const data = await response.json();

      if (data.success) {
        setCanEarnPointsFromGames(data.canEarnPointsFromGames);
        return data.canEarnPointsFromGames;
      } else {
        setPointsFromGamesError(data.message || 'Error en la respuesta');
        return false;
      }
    } catch (error) {
      console.error(`❌ Error canEarnPointsFromGames:`, error);
      setPointsFromGamesError(error.message);
      return false;
    }
  };

  const saveDataToApi = async (endpoint, data) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
<<<<<<< HEAD
        throw new Error("No hay usuario autenticado.");
=======
        throw new Error('No hay usuario autenticado.');
>>>>>>> main
      }

      const clientMail = user.email;
      const payload = { mail: clientMail, ...data };

      const response = await fetchWithToken(
        `https://8txnxmkveg.us-east-1.awsapprunner.com/api/${endpoint}`,
        {
<<<<<<< HEAD
          method: "POST",
          headers: { "Content-Type": "application/json" },
=======
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
>>>>>>> main
          body: JSON.stringify(payload),
        },
      );

      const text = await response.text();

      try {
        const result = JSON.parse(text);
        if (!result.success) {
<<<<<<< HEAD
          throw new Error(result.message || "Error desconocido en la API");
=======
          throw new Error(result.message || 'Error desconocido en la API');
>>>>>>> main
        }
        // refreshClientData(); // <--- ¡¡¡ELIMINA ESTA LÍNEA!!!
        return result; // Devuelve el resultado para que se pueda usar await
      } catch (jsonError) {
<<<<<<< HEAD
        throw new Error("La API devolvió HTML en lugar de JSON.");
=======
        throw new Error('La API devolvió HTML en lugar de JSON.');
>>>>>>> main
      }
    } catch (error) {
      throw error;
    }
  };

  const refreshClientData = async () => {
    if (user && user.uid) {
      if (!isReliablyOnline) {
        console.warn(
<<<<<<< HEAD
          "⚠️ No hay conexión confiable. No se pueden refrescar los datos del cliente desde la API en este momento.",
=======
          '⚠️ No hay conexión confiable. No se pueden refrescar los datos del cliente desde la API en este momento.',
>>>>>>> main
        );
        return;
      }

      try {
        // Capture the current level *before* fetching new data
        const levelBeforeRefresh = clientData ? clientData.level : 0;

        const response = await fetchWithToken(
          `https://8txnxmkveg.us-east-1.awsapprunner.com/api/getClientData?uid=${user.uid}`,
        );
        if (response.ok) {
          const data = await response.json();
          setClientData(data);

          // 🆕 Guardar con versión de la app
          if (data) {
            localStorage.setItem("clientData", JSON.stringify(data));
            localStorage.setItem("clientDataVersion", CURRENT_APP_VERSION);
            //console.log(`💾 Datos del cliente guardados en localStorage (v${CURRENT_APP_VERSION})`);

            const levelAfterRefresh = data.level || 0;
            if (levelAfterRefresh !== levelBeforeRefresh) {
<<<<<<< HEAD
              console.log("🎉 Level up! New level:", levelAfterRefresh);
              showLevelUpPopup(levelAfterRefresh); // Trigger the popup!
            } else {
              console.log(
                "🔹 No level change. Current level:",
=======
              console.log('🎉 Level up! New level:', levelAfterRefresh);
              showLevelUpPopup(levelAfterRefresh); // Trigger the popup!
            } else {
              console.log(
                '🔹 No level change. Current level:',
>>>>>>> main
                levelAfterRefresh,
              );
            }
          }
        } else {
          console.warn('⚠️ No se pudieron refrescar los datos del cliente.');
        }
      } catch (error) {
        console.error('❌ Error al refrescar datos del cliente:', error);
      }
    }
  };

  const getOfflineMessage = () => {
    return (
      <div className="bg-yellow-100 border border-yellow-400 p-2 mb-2 text-yellow-700 rounded-md">
        ⚠️ You are currently offline. Some features might be limited.
      </div>
    );
  };

  // 🆕 Función mejorada para cargar niveles globales con versionado
  const loadGlobalLevels = useCallback(async () => {
<<<<<<< HEAD
    const storedLevels = localStorage.getItem("globalLevels");
    const storedVersion = localStorage.getItem("globalLevelsVersion");
=======
    const storedLevels = localStorage.getItem('globalLevels');
    const storedVersion = localStorage.getItem('globalLevelsVersion');
>>>>>>> main

    // Solo usar localStorage si la versión coincide con la versión actual de la app
    if (storedLevels && storedVersion === CURRENT_APP_VERSION) {
      try {
        const parsedLevels = JSON.parse(storedLevels);
        setGlobalLevels(parsedLevels);
        //console.log(`✅ Niveles globales cargados desde localStorage (App v${CURRENT_APP_VERSION}).`);
        return;
      } catch (error) {
        console.error(
<<<<<<< HEAD
          "⚠️ Error al parsear los niveles globales desde localStorage:",
=======
          '⚠️ Error al parsear los niveles globales desde localStorage:',
>>>>>>> main
          error,
        );
        // Si hay error, limpiar localStorage
        localStorage.removeItem("globalLevels");
        localStorage.removeItem("globalLevelsVersion");
      }
    } else if (storedVersion && storedVersion !== CURRENT_APP_VERSION) {
      console.log(
        `🔄 Versión de datos obsoleta (${storedVersion} → ${CURRENT_APP_VERSION}). Actualizando desde API...`,
      );
    }

    try {
      //console.log("🔍 Buscando datos de niveles en el backend...");
      const response = await fetch(
        `https://8txnxmkveg.us-east-1.awsapprunner.com/api/getGlobalLevels`,
      );
      const data = await response.json();
      if (response.ok) {
        //console.log("✅ Datos de niveles obtenidos:", data);
        if (data && Array.isArray(data) && data.length > 0) {
          const sortedData = [...data].sort((a, b) => a.level - b.level);
          setGlobalLevels(sortedData);

          // Guardar con la versión actual de la app
          localStorage.setItem("globalLevels", JSON.stringify(sortedData));
          localStorage.setItem("globalLevelsVersion", CURRENT_APP_VERSION);
          //console.log(`💾 Niveles globales guardados en localStorage (App v${CURRENT_APP_VERSION}).`);
        } else {
          setGlobalLevels(data);
          localStorage.removeItem("globalLevels");
          localStorage.removeItem("globalLevelsVersion");
        }
      } else {
        console.warn('⚠️ No se encontraron datos de niveles.');
        setGlobalLevels(null);
        localStorage.removeItem("globalLevels");
        localStorage.removeItem("globalLevelsVersion");
      }
    } catch (error) {
      console.error('❌ Error al obtener datos de niveles:', error);
    }
  }, [CURRENT_APP_VERSION]);

  // 🆕 Función mejorada para cargar categorías de iconos con versionado
  const loadIconCategories = useCallback(async () => {
<<<<<<< HEAD
    const storedIconCategories = localStorage.getItem("iconCategories");
    const storedVersion = localStorage.getItem("iconCategoriesVersion");
=======
    const storedIconCategories = localStorage.getItem('iconCategories');
    const storedVersion = localStorage.getItem('iconCategoriesVersion');
>>>>>>> main

    if (storedIconCategories && storedVersion === CURRENT_APP_VERSION) {
      try {
        const parsedCategories = JSON.parse(storedIconCategories);
        setIconCategories(parsedCategories);
        //console.log(`✅ Categorías de iconos cargadas desde localStorage (App v${CURRENT_APP_VERSION}).`);
        return;
      } catch (error) {
        console.warn(
<<<<<<< HEAD
          "⚠️ Error parsing icon categories from localStorage:",
          error,
        );
        localStorage.removeItem("iconCategories");
        localStorage.removeItem("iconCategoriesVersion");
=======
          '⚠️ Error parsing icon categories from localStorage:',
          error,
        );
        localStorage.removeItem('iconCategories');
        localStorage.removeItem('iconCategoriesVersion');
>>>>>>> main
      }
    } else if (storedVersion && storedVersion !== CURRENT_APP_VERSION) {
      //console.log(`🔄 Versión de iconos obsoleta (${storedVersion} → ${CURRENT_APP_VERSION}). Actualizando desde API...`);
    }

    try {
      //console.log("🔍 Fetching icon categories from the backend...");
      const response = await fetch(
        `https://8txnxmkveg.us-east-1.awsapprunner.com/api/getCategoryIcons`,
      );

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && Array.isArray(data) && data.length > 0) {
        setIconCategories(data);
<<<<<<< HEAD
        localStorage.setItem("iconCategories", JSON.stringify(data));
        localStorage.setItem("iconCategoriesVersion", CURRENT_APP_VERSION);
        //console.log(`💾 Categorías de iconos guardadas en localStorage (App v${CURRENT_APP_VERSION}).`);
      } else {
        console.warn("⚠️ No icon categories found.");
        setIconCategories([]);
        localStorage.removeItem("iconCategories");
        localStorage.removeItem("iconCategoriesVersion");
      }
    } catch (error) {
      // Manejo silencioso del error - registra pero no muestra overlay
      console.error("❌ Error fetching icon categories:", error);
      setIconCategories([]);
      localStorage.removeItem("iconCategories");
      localStorage.removeItem("iconCategoriesVersion");
=======
        localStorage.setItem('iconCategories', JSON.stringify(data));
        localStorage.setItem('iconCategoriesVersion', CURRENT_APP_VERSION);
        //console.log(`💾 Categorías de iconos guardadas en localStorage (App v${CURRENT_APP_VERSION}).`);
      } else {
        console.warn('⚠️ No icon categories found.');
        setIconCategories([]);
        localStorage.removeItem('iconCategories');
        localStorage.removeItem('iconCategoriesVersion');
      }
    } catch (error) {
      // Manejo silencioso del error - registra pero no muestra overlay
      console.error('❌ Error fetching icon categories:', error);
      setIconCategories([]);
      localStorage.removeItem('iconCategories');
      localStorage.removeItem('iconCategoriesVersion');
>>>>>>> main

      // Opcional: establecer un estado de error para mostrar UI alternativa
      // setHasConnectionError(true);
    }
  }, [CURRENT_APP_VERSION]);

  useEffect(() => {
    loadGlobalLevels();
  }, [loadGlobalLevels]);

  useEffect(() => {
    loadIconCategories();
  }, [loadIconCategories]);

  useEffect(() => {
    // 🆕 Cargar datos del cliente con versionado
<<<<<<< HEAD
    const storedClientData = localStorage.getItem("clientData");
    const storedClientVersion = localStorage.getItem("clientDataVersion");
=======
    const storedClientData = localStorage.getItem('clientData');
    const storedClientVersion = localStorage.getItem('clientDataVersion');
>>>>>>> main

    if (storedClientData && storedClientVersion === CURRENT_APP_VERSION) {
      try {
        const parsedClientData = JSON.parse(storedClientData);
        setClientData(parsedClientData);
        //console.log(`✅ Datos del cliente cargados desde localStorage (App v${CURRENT_APP_VERSION}).`);
      } catch (error) {
        console.warn(
<<<<<<< HEAD
          "⚠️ Error al parsear los datos del cliente desde localStorage:",
          error,
        );
        localStorage.removeItem("clientData");
        localStorage.removeItem("clientDataVersion");
=======
          '⚠️ Error al parsear los datos del cliente desde localStorage:',
          error,
        );
        localStorage.removeItem('clientData');
        localStorage.removeItem('clientDataVersion');
>>>>>>> main
      }
    } else if (
      storedClientVersion &&
      storedClientVersion !== CURRENT_APP_VERSION
    ) {
      //console.log(`🔄 Versión de datos de cliente obsoleta (${storedClientVersion} → ${CURRENT_APP_VERSION}). Se actualizarán al autenticarse.`);
      localStorage.removeItem("clientData");
      localStorage.removeItem("clientDataVersion");
    }

    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.uid) {
        if (!isReliablyOnline) {
          console.warn(
<<<<<<< HEAD
            "⚠️ Conexión no confiable. No se actualizarán los datos del cliente.",
=======
            '⚠️ Conexión no confiable. No se actualizarán los datos del cliente.',
>>>>>>> main
          );
          return;
        }

        try {
          const response = await fetchWithToken(
            `https://8txnxmkveg.us-east-1.awsapprunner.com/api/getClientData?uid=${currentUser.uid}`,
          );
          const data = await response.json();
          if (response.ok) {
            setClientData(data);

            // Guardar con versión actual
            localStorage.setItem("clientData", JSON.stringify(data));
            localStorage.setItem("clientDataVersion", CURRENT_APP_VERSION);
            //console.log(`💾 Datos del cliente guardados en localStorage (App v${CURRENT_APP_VERSION})`);
          } else {
            setClientData(null);
            localStorage.removeItem("clientData");
            localStorage.removeItem("clientDataVersion");
          }
        } catch (error) {
          console.error('❌ Error al obtener datos del cliente:', error);
        }
      } else {
        setClientData(null);
        localStorage.removeItem("clientData");
        localStorage.removeItem("clientDataVersion");
      }
    });

    return () => unsubscribe();
  }, [isReliablyOnline, CURRENT_APP_VERSION, fetchWithToken]);

  const updatePoints = (newPoints) => {
    if (clientData) {
      const updatedClientData = {
        ...clientData,
        points: newPoints,
      };

      setClientData(updatedClientData);

      // Actualizar también en localStorage con versión actual
      localStorage.setItem("clientData", JSON.stringify(updatedClientData));
      localStorage.setItem("clientDataVersion", CURRENT_APP_VERSION);
      //console.log(`💾 Datos del cliente actualizados en localStorage (App v${CURRENT_APP_VERSION})`);
    }
  };

  // 🆕 Función para limpiar caché (útil para debugging)
  const clearAppCache = () => {
    const keysToRemove = [
<<<<<<< HEAD
      "globalLevels",
      "globalLevelsVersion",
      "iconCategories",
      "iconCategoriesVersion",
      "clientData",
      "clientDataVersion",
=======
      'globalLevels',
      'globalLevelsVersion',
      'iconCategories',
      'iconCategoriesVersion',
      'clientData',
      'clientDataVersion',
>>>>>>> main
    ];

    keysToRemove.forEach((key) => localStorage.removeItem(key));
    //console.log(`🗑️ Caché de la aplicación limpiado (App v${CURRENT_APP_VERSION})`);
  };

  const logout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setUser(null);
      setClientData(null);

      // Limpiar datos del cliente al cerrar sesión
      localStorage.removeItem("clientData");
      localStorage.removeItem("clientDataVersion");
      //console.log("🗑️ Datos del cliente eliminados de localStorage");
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
    }
  };

  return (
    <AppClientContext.Provider
      value={{
        user,
        setUser,
        clientData,
        updatePoints,
        refreshClientData,
        setClientData,
        logout,
        socialIcons,
        socialIcons2,
        featherIcon,
        shareOnSocial,
        bebasNeueClass: bebasNeue.className,
        saveDataToApi,
        fetchWithToken,
        levelData,
        iconCategories,
        canEarnPoints,
        pointsError,
        checkCanEarnPoints,
        checkCanEarnPointsFromGames,
        pointsForGamesError,
        canEarnPointsFromGames,
        getOfflineMessage,
        clearAppCache, // 🆕 Para debugging
        appVersion: CURRENT_APP_VERSION, // 🆕 Exponer la versión
        // Exponemos las funciones para el popup
        showLevelUpPopup,
        hideLevelUpPopup,
      }}
    >
      {children}
      <LevelUpPopup
        isOpen={isLevelUpPopupOpen}
        onClose={hideLevelUpPopup} // Utiliza hideLevelUpPopup aquí
        newLevel={levelUpDisplayedLevel}
      />
    </AppClientContext.Provider>
  );
};

export default ClientDataProvider;
