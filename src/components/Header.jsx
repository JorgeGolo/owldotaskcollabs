import React, { memo, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import GoogleLogin from "../components/GoogleLogin";
import { AppClientContext } from "../context/ClientDataProvider";
import { FaFeather, FaSpinner } from "react-icons/fa";
import PointsDisplay from "../components/PointsDisplay";
import useOnlineStatus from "../components/useOnlineStatus"; // Asumo que ya tienes este hook
import useAuthStatus from "../components/useAuthStatus"; // ¡Importa el nuevo hook!
import ThemeToggleButton from "./ThemeToggleButton";

const Header = memo(() => {
  const { user, clientData, bebasNeueClass } = useContext(AppClientContext);
  const router = useRouter();
  const { isReliablyOnline } = useOnlineStatus(); // Estado de conectividad de la red
  const isLoggedIn = useAuthStatus(); // ¡Usa el nuevo hook!

  // Estado local para controlar la carga inicial de la UI, no de la autenticación en sí
  const [isUiLoading, setIsUiLoading] = useState(true);

  // Este useEffect se encarga de determinar cuándo la UI puede dejar de "cargando"
  // Considera que la UI está lista cuando:
  // 1. La verificación de login ha terminado (isLoggedIn no es null).
  // 2. Si el usuario está logueado, necesitamos también clientData.
  // 3. Si no está logueado, no necesitamos clientData.
  useEffect(() => {
    if (isLoggedIn !== null) {
      // Solo proceder si el estado de autenticación ya se ha verificado
      if (isLoggedIn) {
        // Si está logueado, esperamos que clientData esté cargado
        if (clientData !== null && clientData !== undefined) {
          setIsUiLoading(false);
        }
        // Si clientData es null y isLoggedIn es true, significa que no se encontraron datos de cliente
        // en la DB. Podrías querer mostrar un mensaje de error o una experiencia de usuario diferente.
        // Por ahora, asumimos que si clientData es null, la carga ha terminado.
        if (clientData === null) {
          setIsUiLoading(false);
        }
      } else {
        // Si no está logueado, la UI está lista (no necesitamos clientData)
        setIsUiLoading(false);
      }
    }

    // Un pequeño retardo inicial para asegurar que la UI no parpadee si la carga es muy rápida
    const timer = setTimeout(() => {
      if (isUiLoading) {
        // Solo si aún está en cargando después de 500ms
        setIsUiLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isLoggedIn, clientData, isUiLoading]); // Dependencias del useEffect

  // Determinamos qué mostrar en la sección de autenticación siguiendo un orden estricto
  const renderAuthSection = () => {
    // PASO 1: Si la UI está cargando (independientemente del estado de auth), muestra el indicador
    // También si isLoggedIn es null (aún verificando el estado de autenticación)
    if (isUiLoading || isLoggedIn === null) {
      return (
        <div className="flex items-center space-x-2 h-10">
          <span className="text-white">Cargando...</span>
          <FaSpinner className="animate-spin text-white" />
        </div>
      );
    }

    // PASO 2: Si el usuario está autenticado y tenemos sus datos de cliente
    // (Asegúrate de que user.photoURL exista antes de intentar mostrarlo)
    else if (isLoggedIn && user && clientData?.id) {
      return (
        <div className="flex items-center space-x-2 cursor-pointer h-10">
          <div
            className="flex items-center"
            onClick={() => router.push("/feathers")}
          >
            <PointsDisplay />
            <div className="avatar bg-yellow-500 rounded-full flex items-center justify-center shadow-lg p-2">
              <FaFeather className="text-white" />
            </div>
          </div>
          <img
            src={user.photoURL || "/assets/images/usuario.png"} // Usa photoURL o el avatar por defecto
            alt="Foto de perfil"
            className="avatar cursor-pointer"
            onClick={() => router.push("/profile")}
            onError={(e) => {
              e.target.src = "/assets/images/usuario.png"; // Fallback por si la URL de la imagen es inválida
            }}
          />
        </div>
      );
    }

    // PASO 3: Si no hay usuario autenticado, muestra los botones de login/signin
    else {
      return (
        <div className="md:block space-x-2 h-10">
          {!isReliablyOnline && (
            <span className="text-gray italic bold">Offline</span>
          )}

          <GoogleLogin />
          <button
            className="inline-block bg-white text-black p-2 rounded hover:bg-gray-600 transition
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400
                  "
            disabled={!isReliablyOnline ? true : false}
            onClick={() => router.push("/signin")}
          >
            Sign in
          </button>
        </div>
      );
    }
  };

  return (
    <header className="header-container">
      <div
        id="header"
        className="bg-primary text-white p-2 w-full flex flex-wrap items-center"
      >
        {/* Logo */}
        <div
          id="logoheader"
          className={`flex items-center cursor-pointer ${bebasNeueClass}`}
          onClick={() => router.push("/")}
        >
          <img
            src="/assets/images/logo-64x64.svg"
            alt="Logo"
            className="logo"
            title="OwldoTask Logo"
          />
          <span className="title text-white text-3xl font-bebas flex items-center mt-2">
            Owl<span className="text-secondary">do</span>Task
          </span>
        </div>
        <div className="flex-1"></div>
        {/* Sección de autenticación */}
        <div id="loginheader" className="flex items-center">
          {renderAuthSection()}
        </div>
        <ThemeToggleButton />
      </div>
    </header>
  );
});

export default Header;
