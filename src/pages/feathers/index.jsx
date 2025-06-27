import React, { useContext, useEffect, useState } from 'react';
import { AppClientContext } from '../../context/ClientDataProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faCalendar,
  faTasks,
  faGamepad,
  faTrophy,
  faCaretDown,
  faCaretRight,
} from '@fortawesome/free-solid-svg-icons';

import useJwtToken from '../../components/useJwtToken';

import useOnlineStatus from '../../components/useOnlineStatus';

import Breadcrumb from '../../components/BreadCrumb';

import { FaSpinner } from 'react-icons/fa';

const Feathers = () => {
  const { isReliablyOnline } = useOnlineStatus(); // Estado de conectividad de la red

  const facal = faCalendar;
  const faIconsQuizz = faTasks;
  const faGame = faGamepad;
  const falevel = faTrophy;
  const faarrowdown = faCaretDown;
  const faarrowright = faCaretRight;

  const {
    user,
    clientData,
    featherIcon,
    levelData,
    refreshClientData,
    checkCanEarnPoints,
    getOfflineMessage,
  } = useContext(AppClientContext);

  {
    /* Mostrar level data*/
  }
  const [localLevelData, setLocalLevelData] = useState(levelData);

  const [localClientData, setLocalClientData] = useState(clientData);

  const [progress, setProgress] = useState(0);
  const [progressLevel, setProgressLevel] = useState(0);

  const [localUser, setLocalUser] = useState(user);
  const [message, setMessage] = useState('');

  const [claimAvailable, setclaimAvailable] = useState(true);

  useEffect(() => {
    //setLocalUser(user);
    setLocalClientData(clientData);
    setLocalLevelData(levelData);
  }, [user, clientData, levelData]);

  // Al cargar esta página, se deben comprobar datos con la función checkCanEarnPoints de ClientDataProvider.jsx
  // y se actualizan los datos del cliente con refreshClientData también de ClientDataProvider.jsx

  useEffect(() => {
    if (localClientData && localClientData.points !== undefined) {
      const calculatedProgress = Math.min(
        (localClientData.points /
          localLevelData[localClientData.level - 1].feathers_needed_to_claim) *
          100,
        100,
      );
      setProgress(calculatedProgress);
    } else {
      setProgress(0);
    }
  }, [localClientData]);

  useEffect(() => {
    if (localClientData && localClientData.totalfeathers !== undefined) {
      const calculatedLevelProgress = Math.min(
        (localClientData.totalfeathers /
          localLevelData[localClientData.level - 1].tolevelup) *
          100,
        100,
      );
      setProgressLevel(calculatedLevelProgress);
    } else {
      setProgressLevel(0);
    }
  }, [localClientData]);

  const { initializeToken, fetchWithToken } = useJwtToken();

  // Inicializar el token cuando se monta el componente
  useEffect(() => {
    initializeToken();
  }, [initializeToken]);

  const claimFeathers = async () => {
    if (!isReliablyOnline || !claimAvailable) {
      // Si no hay conexión, no se puede hacer la reclamación
      return;
    }

    setclaimAvailable(false);

    try {
      const clientMail = localClientData.email;
      const clientWallet = localClientData.wallet;

      // Verificar que existe la wallet
      if (!clientWallet) {
        setMessage('❌ No wallet found. Please add a wallet first.');
        setclaimAvailable(true);
        return;
      }

      const payload = {
        mail: clientMail,
        wallet: clientWallet,
        points: localClientData.points,
      };

      const response = await fetchWithToken(
        `https://8txnxmkveg.us-east-1.awsapprunner.com/api/makePayment2`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );

      console.log(`📡 Estado HTTP de la API: ${response.status}`);

      // Intentar parsear la respuesta como JSON
      let result;
      const text = await response.text();
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.log(`📡 Respuesta de la API (texto): ${text}`);
        result = { message: text };
      }

      if (!response.ok) {
        throw new Error(result.error || `Error: ${response.status}`);
      }

      console.log(`📡 Respuesta de la API (procesada):`, result);
      setMessage(`✅ ${result.message || 'Feathers claimed successfully!'}`);
      await refreshClientData();
    } catch (error) {
      console.error('Error en claimFeathers:', error);
      setMessage(error.message || '❌ Error with the crypto payment.');
    } finally {
      setclaimAvailable(true);
    }
  };

  const breadcrumbSegments = [
    { name: 'Home', path: '/' },
    { name: 'Feathers', path: '/feathers' },
  ];

  return (
    <div className="p-4 w-full">
      <Breadcrumb segments={breadcrumbSegments} />

      {!isReliablyOnline && getOfflineMessage()}

      {!localClientData?.id ? (
        <p className="text-red-500 dark:text-light-red">
          Please Login to se your feathers.
        </p>
      ) : (
        <>
          <div className="mb-6 p-4 bg-gray-50 dark:bg-dark-2 rounded-md shadow-inner">
            <h2 className="flex text-2xl font-bold mb-2 lg:mb-4">
              <span className="text-yellow-500 inline-flex items-center mr-2">
                {featherIcon}
              </span>{' '}
              Feathers
            </h2>
            <p>
              Feathers: {localClientData.points} /{' '}
              {
                localLevelData[localClientData.level - 1]
                  .feathers_needed_to_claim
              }
            </p>
            <div className="w-full bg-gray-300 rounded-full h-2.5 mt-2 mb-4">
              <div
                className="bg-teal-600 h-2.5 rounded-full"
                style={{
                  width: `${progress}%`,
                  transition: 'width 1s ease-in-out',
                }}
              ></div>
            </div>

            {message && <p className="my-2">{message}</p>}

            <button
              onClick={claimFeathers}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition mb-2
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400
              "
              disabled={
                !claimAvailable ||
                !isReliablyOnline ||
                localClientData.points <
                  localLevelData[localClientData.level - 1]
                    .feathers_needed_to_claim
              }
            >
              Claim
              {!claimAvailable && (
                <FaSpinner className="ml-2 inline animate-spin" />
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
            <div className="lg:mb-6 md:mb-6 mb-0 p-4 dark:bg-dark-2 rounded-md shadow-inner">
              <h2 className="flex text-2xl font-bold mb-2 lg:mb-4">
                <span className="text-yellow-500 inline-flex items-center mr-2">
                  <FontAwesomeIcon icon={falevel} />
                </span>{' '}
                Level {localClientData.level}
              </h2>

              <div className="border p-2 rounded-md bg-white">
                <div className="font-bold italic">Benefits</div>
                <p>
                  Quizzes per day: {localClientData.quizzestoday || '0'} /{' '}
                  {localLevelData[localClientData.level - 1]
                    ?.maxquizzesperday || '0'}
                </p>
                <p>
                  Games per day: {localClientData.gamestoday || '0'} /{' '}
                  {localLevelData[localClientData.level - 1]?.maxgamesperday ||
                    '0'}
                </p>
                <p>
                  {4 + localClientData.level} <b>feathers</b> per quiz completed
                </p>
                <p>
                  {10 + localClientData.level} <b>feathers</b> per game
                  completed
                </p>
                <p>
                  {
                    localLevelData[localClientData.level - 1]
                      .feathers_needed_to_claim
                  }{' '}
                  <b>feathers</b> minimun to claim
                </p>
              </div>

              <div className="border p-2 rounded-md bg-white mt-2">
                <div className="font-bold italic">Requirements to level up</div>
                <p>
                  Quizzes finished: {localClientData.quizzesdone} /{' '}
                  {localLevelData[localClientData.level - 1].quizzestolevelup}
                  {localLevelData[localClientData.level - 1].quizzestolevelup <=
                    localClientData.quizzesdone && (
                    <span className="mx-2 text-green-500 font-bold italic text-sm">
                      Done!
                    </span>
                  )}
                </p>
                <p>
                  Games finished: {localClientData.gamesdone} /{' '}
                  {localLevelData[localClientData.level - 1].gamestolevelup}
                  {localLevelData[localClientData.level - 1].gamestolevelup <=
                    localClientData.gamesdone && (
                    <span className="mx-2 text-green-500 font-bold italic text-sm">
                      Done!
                    </span>
                  )}
                </p>

                <p>
                  Feathers to level up: {localClientData.totalfeathers} /{' '}
                  {localLevelData[localClientData.level - 1].tolevelup}
                </p>
                <div className="w-full bg-gray-300 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-teal-600 h-2.5 rounded-full"
                    style={{
                      width: `${progressLevel}%`,
                      transition: 'width 1s ease-in-out',
                    }}
                  ></div>
                </div>
              </div>

              {/* mostrar levelData  - a veces oculta por clase hidden*/}
              <p className="hidden">
                {localLevelData && JSON.stringify(localLevelData)}
              </p>
            </div>

            {/* Flecha vertical para móvil */}
            <div className="flex justify-center lg:hidden">
              <FontAwesomeIcon icon={faarrowdown} className="text-4xl" />
            </div>

            <div className="mb-6 p-4 dark:bg-dark-2 rounded-md shadow-inner">
              <h2 className="flex text-2xl font-bold mb-2 lg:mb-4">
                <span className="text-yellow-500 inline-flex items-center mr-2">
                  <FontAwesomeIcon icon={falevel} />
                </span>
                Level {localClientData.level + 1}
              </h2>
              <div className="border p-2 rounded-md">
                <div className="font-bold italic">Benefits</div>
                <p>
                  Quizzes per day:{' '}
                  {localLevelData[localClientData.level]?.maxquizzesperday ||
                    'N/A'}
                </p>
                <p>
                  Games per day:{' '}
                  {localLevelData[localClientData.level]?.maxgamesperday ||
                    'N/A'}
                </p>
                <p>
                  {4 + localClientData.level + 1} <b>feathers</b> per quiz
                  completed
                </p>
                <p>
                  {10 + localClientData.level + 1} <b>feathers</b> per game
                  completed
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gray-50 dark:bg-dark-2 rounded-md shadow-inner mt-4 dark:bg-dark-2 ">
            <h2 className="flex text-2xl font-bold mb-2 lg:mb-4">
              <span className="text-yellow-500 inline-flex items-center mr-2">
                <FontAwesomeIcon icon={facal} />
              </span>{' '}
              Dailies
            </h2>
            <p className="italic">Coming soon</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Feathers;

{
  /*
            <hr className="border-gray-300" />

          Sección de estadísticas de juegos y quizzes 
            <div className="p-4 bg-gray-50 rounded-md shadow-inner mb-6">
              <h2 className="flex text-2xl font-bold mb-2 lg:mb-4">
                <span className="text-yellow-500 inline-flex items-center mr-2">
                  <FontAwesomeIcon icon={faIconsQuizz} />
              </span>Total Quizzes</h2>
              <p>Correct answers: {localClientData.questionsright}</p>
              <p>Quizzes 100% completed: {localClientData.quizzesdone}</p>
            </div>

            <hr className="my-4 border-gray-300" />

            <div className="p-4 bg-gray-50 rounded-md shadow-inner mb-6">
              <h2 className="flex text-2xl font-bold mb-2 lg:mb-4">
                <span className="text-yellow-500 inline-flex items-center mr-2">
                  <FontAwesomeIcon icon={faGame} />
              </span>Total Games Completed</h2>
              <p>Mini tasks: </p>
              <p>Games completed: </p>
            </div>
            */
}
