import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import GoogleRegister from "../../components/GoogleRegister";

import useOnlineStatus from "../../components/useOnlineStatus";

const signin = () => {

  const { isReliablyOnline } = useOnlineStatus(); // Estado de conectividad de la red

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  //const navigate = useNavigate(); // Hook para navegar
  const router = useRouter(); // ✅ Sustituye useNavigate

  const [ageConfirmed, setAgeConfirmed] = useState(false);

  return (
    <div>

      {!isReliablyOnline ?? (getOfflineMessage() )}

    <div className="flex justify-center items-center flex-1 bg-gray-100 py-10">
      <div className="p-6 bg-white shadow-lg rounded-lg">
          <p className="mb-4">Sign-in with your Google account.</p>

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
              I accept the{" "}
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
            <label htmlFor="age">
              I confirm that I am over 13 years old
            </label>
          </div>

          <button
            onClick={() => router.back()}
            className="mb-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400" 
                  disabled={!isReliablyOnline ? true : false}
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
    props: {}, // No necesitas pasar props si no hay datos dinámicos
  };
}


export default signin;
