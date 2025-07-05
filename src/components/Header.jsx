// src/components/Header.jsx
import React, { memo, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import GoogleLogin from './GoogleLogin'; // Componente para login con Google
import { AppClientContext } from '../context/ClientDataProvider';
import { FaFeather, FaSpinner } from 'react-icons/fa';
import PointsDisplay from './PointsDisplay';
import useOnlineStatus from './useOnlineStatus';
import useAuthStatus from './useAuthStatus';
import ThemeToggleButton from './ThemeToggleButton';

const Header = memo(() => {
  const { user, clientData, bebasNeueClass } = useContext(AppClientContext);
  const router = useRouter();
  const { isReliablyOnline } = useOnlineStatus(); // Estado de conectividad de la red
  const isLoggedIn = useAuthStatus(); // Hook para verificar el estado de autenticación

  // Estado local para controlar la carga inicial de la UI, no de la autenticación en sí
  const [isUiLoading, setIsUiLoading] = useState(true);

  // Este useEffect se encarga de determinar cuándo la UI puede dejar de "cargando"
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
    else if (isLoggedIn && user && clientData?.id) {
      return (
        <div className="flex items-center space-x-2 cursor-pointer h-10">
          <div
            className="flex items-center"
            onClick={() => router.push('/feathers')}
          >
            <PointsDisplay />
            <div className="avatar bg-yellow-500 rounded-full flex items-center justify-center shadow-lg p-2">
              <FaFeather className="text-white" />
            </div>
          </div>
          <img
            src={user.photoURL || '/assets/images/usuario.png'} // Usa photoURL o el avatar por defecto
            alt="Foto de perfil"
            className="avatar cursor-pointer rounded-full h-10 w-10 object-cover" // Añadido Tailwind para estilo de avatar
            onClick={() => router.push('/profile')}
            onError={(e) => {
              e.target.src = '/assets/images/usuario.png'; // Fallback por si la URL de la imagen es inválida
            }}
          />
        </div>
      );
    }

    // PASO 3: Si no hay usuario autenticado, muestra los botones de login/signin
    else {
      return (
        <div className="md:block space-x-2 h-10 flex items-center">
          {' '}
          {/* Añadido flex y items-center para alinear los botones */}
          {!isReliablyOnline && (
            <span className="text-gray-400 italic font-bold">Offline</span>
          )}
          {/* Nuevo botón para Login con Email y Contraseña */}
          <button
            className="inline-block bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
            disabled={!isReliablyOnline}
            onClick={() => router.push('/signin?mode=login')} // Redirige a signin en modo login
          >
            Login
          </button>
          {/* Botón de Registro (Sign In) */}
          <button
            className="inline-block bg-green-600 text-white p-2 rounded hover:bg-green-700 transition // Cambiado a color verde para registro
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
            disabled={!isReliablyOnline}
            onClick={() => router.push('/signin?mode=register')} // Redirige a signin en modo registro
          >
            Register
          </button>
        </div>
      );
    }
  };

  return (
    <header className="header-container">
      <div
        id="header"
        className="dark:bg-gray-900 bg-gray-800 text-white p-2 w-full flex flex-wrap items-center shadow-md // Ajustado bg y shadow
        "
      >
        {/* Logo */}
        <div
          id="logoheader"
          className={`flex items-center cursor-pointer ${bebasNeueClass}`}
          onClick={() => router.push('/')}
        >
          <img
            src="/assets/images/logo-64x64.svg"
            alt="Logo"
            className="logo h-10 w-10 mr-2" // Ajustado tamaño y margen
            title="OwldoTask Logo"
          />
          <span className="title text-white text-3xl font-bebas flex items-center mt-2">
            Owl<span className="text-yellow-400">do</span>Task{' '}
            {/* Cambiado color secundario a amarillo */}
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
