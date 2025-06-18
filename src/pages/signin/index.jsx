import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import GoogleRegister from '../../components/GoogleRegister';

import useOnlineStatus from '../../components/useOnlineStatus';

const signin = () => {
  const { isReliablyOnline } = useOnlineStatus(); // Estado de conectividad de la red

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  //const navigate = useNavigate(); // Hook para navegar
  const router = useRouter(); // ✅ Sustituye useNavigate

  const [ageConfirmed, setAgeConfirmed] = useState(false);

  // MENSAJE QUE VIENE DE LOGIN - cuando hacn logn y no está registrados
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (router.query.message) {
      const messageType = router.query.message;
      if (messageType === 'not-registered') {
        setErrorMessage(
          "It looks like you're not registered. Please create an account.",
        );
      }
      // Puedes añadir más tipos de mensajes aquí si decides usarlos
      // else if (messageType === 'server-error') {
      //   setErrorMessage('Hubo un problema al verificar tu cuenta. Inténtalo de nuevo.');
      // }
    }
  }, [router.query.message]);

  return (
    <div>
      {!isReliablyOnline ?? getOfflineMessage()}

      <div className="mt-6 mb-6 p-4 md:p-6 bg-white dark:bg-dark-2 rounded-lg shadow hover:shadow-lg transition">
        {errorMessage && (
          <p style={{ color: 'red', fontWeight: 'bold' }}>{errorMessage}</p>
        )}

        <p className="mb-4">Register with your Google account.</p>

        {/* Botón de Registro */}
        <GoogleRegister acceptedTerms={acceptedTerms && ageConfirmed} />

        {/* Checkbox de términos */}
        <div className="flex items-center my-4">
          <input
            type="checkbox"
            id="terms"
            checked={acceptedTerms}
            onChange={() => setAcceptedTerms(!acceptedTerms)}
            className="mr-2"
          />
          <label htmlFor="terms">
            I accept the{' '}
            <Link href="/termsofservice" className="text-blue-500 underline">
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
            className="mr-2"
          />
          <label htmlFor="age">I confirm that I am over 13 years old</label>
        </div>

        <button
          onClick={() => router.back()}
          className="mb-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: {}, // No necesitas pasar props si no hay datos dinámicos
  };
}

export default signin;
