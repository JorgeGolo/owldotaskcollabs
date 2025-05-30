import React, { createContext, useState, useEffect, useMemo, useCallback  } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from '../firebase';
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaFeather, FaReddit  } from "react-icons/fa";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, RedditShareButton  } from "react-share";
import { Bebas_Neue } from "next/font/google";

import useJwtToken from '../components/useJwtToken'; // Importar el hook que creamos

import useOnlineStatus from '../components/useOnlineStatus';

// ⚙️ Importa y configura la fuente
const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const AppClientContext = createContext();

export const ClientDataProvider = ({ children }) => {

  const { isReliablyOnline } = useOnlineStatus(); //  Hook para verificar el estado de conexión

  const [user, setUser] = useState(null);
  const [clientData, setClientData] = useState(null);

  const [levelData, setGlobalLevels] = useState(null);

  const [iconCategories, setIconCategories] = useState([]); // Initialize as empty array

  const { initializeToken, fetchWithToken } = useJwtToken();

  const [canEarnPoints, setCanEarnPoints] = useState('cargando');

  const [pointsError, setPointsError] = useState(null);

  const [canEarnPointsFromGames, setCanEarnPointsFromGames] = useState(null);
  const [pointsForGamesError, setPointsFromGamesError] = useState(null);
  
  const socialIcons = useMemo(() => [
    { icon: <FaFacebook size={20} />, link: "https://facebook.com" },
    { icon: <FaTwitter size={20} />, link: "https://twitter.com" },
    { icon: <FaWhatsapp size={20} />, link: "https://instagram.com" },
  ], []);

  const socialIcons2 = useMemo(() => [
    { icon: <FaFacebook size={20} />, link: "https://www.facebook.com/owldotask/" },
    { icon: <FaTwitter size={20} />, link: "https://x.com/owldotask" },
    { icon: <FaInstagram size={20} />, link: "https://www.instagram.com/owldotask" },
  ], []);

  // Inicializar el token cuando se monta el componente
  useEffect(() => {
    initializeToken();
  }, [initializeToken]);

  const featherIcon = useMemo(() => <FaFeather />, []);
  
  const shareOnSocial = (platform, url, message) => {
    switch (platform) {
      case 'facebook':
        return (
          <span className="flex items-center justify-center">          
            <FacebookShareButton url={url} quote={message} >
              <FaFacebook size={24} />
            </FacebookShareButton>
          </span>
        );
      case 'twitter':
        return (
          <span className="flex items-center justify-center">          
            <TwitterShareButton url={url} title={message}>
              <FaTwitter size={24} />
            </TwitterShareButton>
          </span>
        );
      case 'whatsapp':
        return (
          <span className="flex items-center justify-center">          
            <WhatsappShareButton url={url} title={message}>
              <FaWhatsapp size={24} />
            </WhatsappShareButton>
          </span>
        );
        case 'reddit':
        return (
          <span className="flex items-center justify-center">
            <RedditShareButton url={url} title={message}>
              <FaReddit size={24} /> {/* O FaRedditAlien si lo importaste */}
            </RedditShareButton>
          </span>
        );
      default:
        return null;
    }
  };

  // Nueva función para verificar si se pueden ganar puntos
  const checkCanEarnPoints = async (userId) => {
    try {
      if (!userId) {
        console.log("❌ Error: No hay usuario autenticado");
        setCanEarnPoints(false);
        return false;
      }

      const response = await fetchWithToken(`https://8txnxmkveg.us-east-1.awsapprunner.com/api/checkMaxLevels?uid=${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      //console.log(`📡 Estado HTTP de la API checkMaxLevels: ${response.status}`);
      const data = await response.json();
      //console.log(`📡 Respuesta de la API checkMaxLevels:`, data);
      
      if (data.success) {
        setCanEarnPoints(data.canEarnPoints);
        return data.canEarnPoints; 
      } else {
        setPointsError(data.message || "Error en la respuesta");
        return false;
      }
    } catch (error) {
      console.error(`❌ Error checkCanEarnPoints:`, error);
      setPointsError(error.message);
      return false;
    } 
  };

  // Nueva función para verificar si se pueden ganar puntos
  const checkCanEarnPointsFromGames = async (userId) => {
    try {
      if (!userId) {
        console.log("❌ Error: No hay usuario autenticado");
        setCanEarnPointsFromGames(false);
        return false;
      }

      const response = await fetchWithToken(`https://8txnxmkveg.us-east-1.awsapprunner.com/api/checkGamesMaxLevels?uid=${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      //console.log(`📡 Estado HTTP de la API checkGamesMaxLevels: ${response.status}`);
      const data = await response.json();
      //console.log(`📡 Respuesta de la API checkGamesMaxLevels:`, data);
      
      if (data.success) {
        setCanEarnPointsFromGames(data.canEarnPointsFromGames);
        return data.canEarnPointsFromGames; 
      } else {
        setPointsFromGamesError(data.message || "Error en la respuesta");
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
        throw new Error("No hay usuario autenticado.");
      }
      
      const clientMail = user.email;
      const payload = { mail: clientMail, ...data };
      
      const response = await fetchWithToken(`https://8txnxmkveg.us-east-1.awsapprunner.com/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      
      //console.log(`📡 Estado HTTP de la API: ${response.status}`);
      const text = await response.text();
      //console.log(`📡 Respuesta de la API (raw): ${text}`);
      
      try {
        const result = JSON.parse(text);
        if (!result.success) {
          throw new Error(result.message || "Error desconocido en la API");
        }
        //console.log(`✅ Datos guardados con éxito en ${endpoint}:`, result);
        refreshClientData(); // Refresca los datos del cliente después de guardar
        return result;
      } catch (jsonError) {
        //console.error("⚠️ Respuesta no es JSON válido:", text);
        throw new Error("La API devolvió HTML en lugar de JSON.");
      }
    } catch (error) {
      //console.error(`❌ Error al guardar datos en ${endpoint}:`, error);
      throw error;
    }
  };


  const refreshClientData = async () => {

    if (user && user.uid) {

      if (!isReliablyOnline) {
        console.warn("⚠️ No hay conexión confiable. No se pueden refrescar los datos del cliente desde la API en este momento.");
      return;
      }

      try {
        //console.log("Refrescando datos del cliente...");
        const response = await fetchWithToken(`https://8txnxmkveg.us-east-1.awsapprunner.com/api/getClientData?uid=${user.uid}`);
        if (response.ok) {
          const data = await response.json();
          //console.log("✅ Datos actualizados:", data);
          setClientData(data);
          
          // Guardar los datos del cliente en localStorage
          if (data) {
            localStorage.setItem('clientData', JSON.stringify(data));
            console.log("💾 Datos del cliente guardados en localStorage");
          }
        } else {
          console.warn("⚠️ No se pudieron refrescar los datos del cliente.");
        }
      } catch (error) {
        console.error("❌ Error al refrescar datos del cliente:", error);
      }
    }
  };
  
    // NEW FUNCTION: Provides the JSX for the offline message
  const getOfflineMessage = () => {
      return (
        <div className="bg-yellow-100 border border-yellow-400 p-2 mb-2 text-yellow-700 rounded-md">
          ⚠️ You are currently offline. Some features might be limited.
        </div>
      );
  };





  // Función para obtener los niveles globales y almacenarlos en localStorage
  const loadGlobalLevels = useCallback(async () => {
    const storedLevels = localStorage.getItem('globalLevels');
    if (storedLevels) {
      try {
        const parsedLevels = JSON.parse(storedLevels);
        setGlobalLevels(parsedLevels);
        console.log("✅ Niveles globales cargados desde localStorage.");
        return;
      } catch (error) {
        console.error("⚠️ Error al parsear los niveles globales desde localStorage:", error);
      }
    }

    try {
      console.log("🔍 Buscando datos de niveles en el backend...");
      const response = await fetch(`https://8txnxmkveg.us-east-1.awsapprunner.com/api/getGlobalLevels`);
      const data = await response.json();
      if (response.ok) {
        console.log("✅ Datos de niveles obtenidos:", data);
        if (data && Array.isArray(data) && data.length > 0) {
          const sortedData = [...data].sort((a, b) => a.level - b.level);
          setGlobalLevels(sortedData);
          localStorage.setItem('globalLevels', JSON.stringify(sortedData));
          console.log("💾 Niveles globales guardados en localStorage.");
        } else {
          setGlobalLevels(data);
          localStorage.removeItem('globalLevels'); // Si no hay datos válidos, eliminamos lo que haya en localStorage
        }
      } else {
        console.warn("⚠️ No se encontraron datos de niveles.");
        setGlobalLevels(null);
        localStorage.removeItem('globalLevels');
      }
    } catch (error) {
      console.error("❌ Error al obtener datos de niveles:", error);
    }
  }, []);

  const loadIconCategories = useCallback(async () => {
        const storedIconCategories = localStorage.getItem('iconCategories');
    if (storedIconCategories) {
      try {
        const parsedCategories = JSON.parse(storedIconCategories);
        setIconCategories(parsedCategories);
        //console.log("✅ Icon categories loaded from localStorage.");
        return;
      } catch (error) {
        console.warn("⚠️ Error parsing icon categories from localStorage:", error);
      }

    }
  try {
    console.log("🔍 Fetching icon categories from the backend...");
    const response = await fetch(`https://8txnxmkveg.us-east-1.awsapprunner.com/api/getCategoryIcons`);
    const data = await response.json();
    if (response.ok) {
      //console.log("✅ Icon categories fetched:", data);
      if (data && Array.isArray(data) && data.length > 0) {
        setIconCategories(data);
        localStorage.setItem('iconCategories', JSON.stringify(data));
        //console.log("💾 Icon categories saved to localStorage.");
      } else {
        setIconCategories([]);
        localStorage.removeItem('iconCategories'); // If no valid data, remove what is in localStorage
      }
    } else {
      console.warn("⚠️ No icon categories found.");
    setIconCategories([]);
      localStorage.removeItem('iconCategories');
    }
  } catch (error) {
    console.error("❌ Error fetching icon categories:", error);
    setIconCategories([]);
    localStorage.removeItem('iconCategories');
  }
}, []);

useEffect(() => {
  // Cargar los niveles globales solo una vez cuando el componente se monta
  loadGlobalLevels();
}, [loadGlobalLevels]);

  useEffect(() => {
  // Cargar los niveles globales solo una vez cuando el componente se monta
    loadIconCategories();
  }, [loadIconCategories]); // La dependencia de useCallback asegura que no se ejecute infinitament

  useEffect(() => {
    // Cargar datos del cliente desde localStorage al iniciar
    const storedClientData = localStorage.getItem('clientData');
    if (storedClientData) {
      try {
        const parsedClientData = JSON.parse(storedClientData);
        setClientData(parsedClientData);
        //console.log("✅ Datos del cliente cargados desde localStorage.");
      } catch (error) {
        console.warn("⚠️ Error al parsear los datos del cliente desde localStorage:", error);
      }
    }

    // Mostrar level data
    //loadGlobalLevels();

    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      //console.log("🔄 Detectando cambios en la autenticación:", currentUser);
      setUser(currentUser);
      if (currentUser && currentUser.uid) {

        // Verificar si el usuario tiene conexión confiable
        if (!isReliablyOnline) {
          console.warn("⚠️ Conexión no confiable. No se actualizarán los datos del cliente.");
          return;
        }

        try {
          //console.log("🔍 Buscando datos del usuario en el backend...");
          const response = await fetchWithToken(`https://8txnxmkveg.us-east-1.awsapprunner.com/api/getClientData?uid=${currentUser.uid}`);
          const data = await response.json();
          if (response.ok) {
            //console.log("✅ Datos del cliente obtenidos:", data);
            setClientData(data);
            
            // Guardar en localStorage
            localStorage.setItem('clientData', JSON.stringify(data));
            console.log("💾 Datos del cliente guardados en localStorage");
          } else {
            //console.warn("⚠️ No se encontraron datos del cliente.");
            setClientData(null);
            localStorage.removeItem('clientData');
          }
        } catch (error) {
          //console.error("❌ Error al obtener datos del cliente:", error);
        }
      } else {
        setClientData(null);
        localStorage.removeItem('clientData');
      }
    });

    return () => unsubscribe();
  }, [isReliablyOnline]);


  const updatePoints = (newPoints) => {
    if (clientData) {
      const updatedClientData = {
        ...clientData,
        points: newPoints,
      };s
      
      setClientData(updatedClientData);
      
      // Actualizar también en localStorage
      localStorage.setItem('clientData', JSON.stringify(updatedClientData));
      console.log("💾 Datos del cliente actualizados en localStorage");
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setUser(null);
      setClientData(null);
      
      // Limpiar datos del cliente en localStorage al cerrar sesión
      localStorage.removeItem('clientData');
      console.log("🗑️ Datos del cliente eliminados de localStorage");
    } catch (error) {
      //console.error("❌ Error al cerrar sesión:", error);
    }
  };

   return (
    <AppClientContext.Provider
      value={{
        user,
        setUser,
        clientData,
        updatePoints,
        refreshClientData, // <-- Exponemos la función
        setClientData,
        logout,
        socialIcons,
        socialIcons2,
        featherIcon,
        shareOnSocial,
        bebasNeueClass: bebasNeue.className, // ✅ exportamos aquí
        saveDataToApi,
        fetchWithToken,
        levelData,
        iconCategories,
        canEarnPoints,         // Exponemos el estado
        pointsError,           // Exponemos el error si existe
        checkCanEarnPoints,    // Exponemos la función
        checkCanEarnPointsFromGames, // Exponemos la función
        pointsForGamesError, // Exponemos el error si existe
        canEarnPointsFromGames, // Exponemos el estado
        getOfflineMessage,
      }}

    >
      {children}
    </AppClientContext.Provider>
  );
};

export default ClientDataProvider;