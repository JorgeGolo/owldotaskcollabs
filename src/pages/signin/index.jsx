// src/pages/signin.jsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import GoogleRegister from '../../components/GoogleRegister';
import EmailAuth from '../../components/EmailAuth';

import useOnlineStatus from '../../components/useOnlineStatus';
import GoogleLogin from '../../components/GoogleLogin';

const signin = () => {
  const { isReliablyOnline } = useOnlineStatus();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const router = useRouter();
  const { query } = router; // Obtiene los parámetros de la URL
  const [ageConfirmed, setAgeConfirmed] = useState(false);

  // Estado para controlar el formulario inicial en EmailAuth
  // Por defecto, es registro (true). Si 'mode' es 'login', será false.
  const [initialIsRegistering, setInitialIsRegistering] = useState(true);

  // MENSAJE QUE VIENE DE LOGIN - cuando hacen login y no están registrados
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (router.query.message) {
      const messageType = router.query.message;
      if (messageType === 'not-registered') {
        setErrorMessage(
          "It looks like you're not registered. Please create an account.",
        );
      }
    }
  }, [router.query.message]);

  // Efecto para actualizar initialIsRegistering basado en el parámetro 'mode' de la URL
  useEffect(() => {
    if (query.mode === 'login') {
      setInitialIsRegistering(false); // Si el modo es 'login', mostrar el formulario de login
    } else {
      setInitialIsRegistering(true); // Por defecto o si el modo es 'register', mostrar el formulario de registro
    }
    // También limpiamos el mensaje de error al cambiar de modo
    setErrorMessage('');
  }, [query.mode]); // Se ejecuta cada vez que el parámetro 'mode' cambia

  // Función auxiliar para mostrar un mensaje de offline
  const getOfflineMessage = () => (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
      role="alert"
    >
      <strong className="font-bold">Offline!</strong>
      <span className="block sm:inline">
        {' '}
        You are currently offline. Some features may not work.
      </span>
    </div>
  );

  return (
    <div className="min-h-screen flex justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        {!isReliablyOnline && getOfflineMessage()}

        <div className="mt-6 mb-6 p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition">
          {errorMessage && (
            <p style={{ color: 'red', fontWeight: 'bold' }} className="mb-4">
              {errorMessage}
            </p>
          )}

          <p className="mb-4 text-gray-700 dark:text-gray-300 text-center">
            Use your Google account.
          </p>

          {initialIsRegistering ? (
            <GoogleRegister acceptedTerms={acceptedTerms && ageConfirmed} />
          ) : (
            <GoogleLogin />
          )}

          {/* Botón de Registro con Google */}

          {/* Separador visual entre las opciones de autenticación */}
          <div className="text-center my-6 text-gray-500 dark:text-gray-400">
            — OR —
          </div>

          {/* Componente para Autenticación con Correo/Contraseña */}
          <EmailAuth
            acceptedTerms={acceptedTerms}
            ageConfirmed={ageConfirmed}
            initialIsRegistering={initialIsRegistering} // Pasa el estado inicial al componente EmailAuth
          />

          {/* Checkbox de términos y condiciones */}
          {initialIsRegistering && (
            <>
              <div className="flex items-center my-4">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={() => setAcceptedTerms(!acceptedTerms)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="terms"
                  className="text-gray-700 dark:text-gray-300"
                >
                  I accept the{' '}
                  <Link
                    href="/termsofservice"
                    className="text-blue-500 underline hover:text-blue-700"
                  >
                    Terms of service
                  </Link>
                </label>
              </div>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="age"
                  checked={ageConfirmed}
                  onChange={() => setAgeConfirmed(!ageConfirmed)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="age"
                  className="text-gray-700 dark:text-gray-300"
                >
                  I confirm that I am over 13 years old
                </label>
              </div>
            </>
          )}

          {/* Botón de "Volver" */}
          <button
            onClick={() => router.back()}
            className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: {},
  };
}

export default signin;
