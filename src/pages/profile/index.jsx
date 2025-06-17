import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Breadcrumb from '../../components/BreadCrumb';
import { AppClientContext } from '../../context/ClientDataProvider';
import {
  getAuth,
  deleteUser,
  GoogleAuthProvider,
  signInWithPopup,
  reauthenticateWithPopup,
} from 'firebase/auth';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTasks } from "@fortawesome/free-solid-svg-icons";

import useJwtToken from "../../components/useJwtToken"; // Importar el hook que creamos

import useOnlineStatus from '../../components/useOnlineStatus';

const Profile = () => {
  const { isReliablyOnline } = useOnlineStatus(); // Estado de conectividad de la red

  const { user, clientData, logout, saveDataToApi, getOfflineMessage } =
    useContext(AppClientContext);
  const router = useRouter();

  const [localUser, setLocalUser] = useState(user);
  const [localClientData, setLocalClientData] = useState(clientData);
  const [progress, setProgress] = useState(0);

  const [paypal, setPaypal] = useState(clientData?.paypal || '');
  const [wallet, setWallet] = useState(clientData?.wallet || '');

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // For re-authentication
  const [reauthError, setReauthError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const { featherIcon } = useContext(AppClientContext);
  const { initializeToken, fetchWithToken } = useJwtToken();

  const faIconsQuizz = [faTasks];

  useEffect(() => {
    setLocalUser(user);
    setLocalClientData(clientData);
    setPaypal(clientData?.paypal || "");
    setWallet(clientData?.wallet || "");
  }, [user, clientData]);

  useEffect(() => {
    if (localClientData && localClientData.points !== undefined) {
      const calculatedProgress = Math.min(
        (localClientData.points / 150) * 100,
        100,
      );
      setProgress(calculatedProgress);
    } else {
      setProgress(0);
    }
  }, [localClientData]);

  // Inicializar el token cuando se monta el componente
  useEffect(() => {
    initializeToken();
  }, [initializeToken]);

  const handleSavePaypal = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // 1. Guarda el dato en el servidor.
      await saveDataToApi('savePaypal', { paypal });

      // 2. Refresca el estado global de la aplicación.
      await refreshClientData();

      setMessage('✅ PayPal saved.');
      // 3. Ya no necesitas la línea setLocalClientData. El useEffect se encargará de actualizar el estado local
      // cuando el clientData global del contexto cambie.
    } catch (error) {
      setMessage(error.message || '❌ Error updating PayPal.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWallet = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // 1. Guarda el dato en el servidor.
      await saveDataToApi('saveWallet', { wallet });

      // 2. Refresca el estado global de la aplicación.
      await refreshClientData();

      setMessage('✅ Wallet saved.');
      // 3. Ya no necesitas la línea setLocalClientData.
    } catch (error) {
      setMessage(error.message || '❌ Error updating Wallet.');
    } finally {
      setLoading(false);
    }
  };

  const handleReauthenticate = async () => {
    setReauthError("");
    setIsDeleting(true);

    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();

      // Reauthenticate with Google popup
      await reauthenticateWithPopup(auth.currentUser, provider);

      // If we reach here, authentication was successful
      // Now proceed with account deletion
      await performAccountDeletion();
    } catch (error) {
      console.error('Reauthentication error:', error);
      setReauthError('Failed to authenticate. Please try again.');
      setIsDeleting(false);
    }
  };

  const performAccountDeletion = async () => {
    try {
      const auth = getAuth();
      await deleteUser(auth.currentUser);
      const response = await fetchWithToken(
        `https://8txnxmkveg.us-east-1.awsapprunner.com/api/delete-client/${localUser.uid}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (response.ok) {
        alert('✅ Account deleted successfully.');
        await logout();
        router.push('/');
      } else {
        const data = await response.json();
        console.error('❌ Error:', data);
        setReauthError('Error deleting account from database.');
        setIsDeleting(false);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      setReauthError(
        'Error deleting account: ' + (error.message || 'Unknown error'),
      );
      setIsDeleting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!localUser) {
      alert('No authenticated user');
      return;
    }

    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.',
    );
    if (!confirmDelete) return;

    // For Google Auth users, we'll trigger the Google sign-in popup directly
    handleReauthenticate();
  };

  const breadcrumbSegments = [
    { name: 'Home', path: '/' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <div className="p-4 w-full">
      <Breadcrumb segments={breadcrumbSegments} />

      {!isReliablyOnline && getOfflineMessage()}

      <div className="mb-6 p-6 dark:bg-dark-2 bg-white rounded-lg shadow hover:shadow-lg">
        {!localClientData?.id ? (
          <p className="text-red-500 dark:text-light-red">
            Please Login to see your profile
          </p>
        ) : (
          <>
            <h1 className="text-3xl font-bold dark:text-light-2 text-gray-800 mb-4 lg:mb-6">
              Profile
            </h1>

            <div className="mb-6 p-4 bg-gray-50 rounded-md shadow-inner">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 lg:mb-6">
                Account Information
              </h2>
              <div className="flex flex-wrap gap-4 justify-between">
                <div className="w-full my-2">
                  <label className="text-gray-600 w-full md:w-smallwidth inline-block">
                    Mail:
                  </label>
                  <input
                    type="text"
                    value={localClientData.email}
                    className="my-2 md:mr-2 md:w-auto w-full p-2 rounded border border-gray-300 flex-grow"
                    disabled
                  />
                  <span className="italic text-gray-600">
                    This data cannot be modified
                  </span>
                </div>
                <div className="w-full my-2">
                  <form onSubmit={handleSavePaypal}>
                    <label className="text-gray-600 w-full md:w-smallwidth inline-block">
                      Paypal:
                    </label>
                    <input
                      type="email"
                      value={paypal}
                      onChange={(e) => setPaypal(e.target.value)}
                      placeholder="Add your PayPal email"
                      className="my-2 md:mr-2 md:w-auto w-full p-2 rounded border border-gray-300 flex-grow"
                    />
                    <button
                      type="submit"
                      className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition self-end ${loading || !isReliablyOnline ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={loading || !isReliablyOnline}
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                  </form>
                </div>
                <div className="w-full my-2">
                  <form onSubmit={handleSaveWallet}>
                    <label className="text-gray-600 w-full md:w-smallwidth inline-block">
                      Wallet:
                    </label>
                    <input
                      type="text"
                      value={wallet}
                      onChange={(e) => setWallet(e.target.value)}
                      placeholder="Add your wallet address"
                      className="my-2 md:mr-2 md:w-auto w-full p-2 rounded border border-gray-300 flex-grow"
                    />
                    <button
                      className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition self-end ${loading || !isReliablyOnline ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={loading || !isReliablyOnline}
                      type="submit"
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                  </form>

                  {message && <p className="text-gray-700 mt-2">{message}</p>}
                </div>
              </div>
            </div>

            <hr className="my-4 border-gray-300" />

            <button
              onClick={logout}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition mb-2"
            >
              Logout
            </button>

            <hr className="my-4 border-gray-300" />

            <button
              onClick={handleDeleteAccount}
              className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition mb-2 ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading || !isReliablyOnline}
            >
              {isDeleting ? "Processing..." : "Delete account"}
            </button>

            {reauthError && (
              <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
                {reauthError}
                <p className="mt-1 text-sm">
                  Please try again or contact support if the problem persists.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
