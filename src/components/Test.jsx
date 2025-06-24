import React, { useEffect, useState, useCallback, useContext } from 'react';
import DotLoader from 'react-spinners/DotLoader';
import Confetti from 'react-confetti';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Popup from './Popup';
import { AppClientContext } from '../context/ClientDataProvider';

//para el cargando
import { FaSpinner } from 'react-icons/fa';

// token
import useJwtToken from './useJwtToken'; // Importar el hook que creamos

import useAuthStatus from './useAuthStatus';
import useOnlineStatus from './useOnlineStatus';

import { mockQuestionData } from '../context/mockQuestion'; // 👈 Importa los datos de prueba

const Test = ({ chapters, numberOfQuestions }) => {
  const { isReliablyOnline } = useOnlineStatus();

  // Usar nuestro hook personalizado
  const { initializeToken, fetchWithToken } = useJwtToken();

  // quiero datos de cliente 1 - añado clientData
  const {
    updatePoints,
    refreshClientData,
    saveDataToApi,
    clientData,
    canEarnPoints, // Usamos canEarnPoints del provider
    pointsError, // Usamos pointsError del provider
    checkCanEarnPoints, // Usamos la nueva función del provider
  } = useContext(AppClientContext);

  // quiero datos de cliente 2
  useEffect(() => {
    setLocalClientData(clientData);
  }, [clientData]);

  // Inicializar el token cuando se monta el componente
  useEffect(() => {
    initializeToken();
  }, [initializeToken]);

  // datos del nivel del cliente
  const [localClientData, setLocalClientData] = useState(clientData);

  // Cambio aquí: inicializar retryAvailable a true para permitir siempre el reinicio
  const [retryAvailable, setRetryAvailable] = useState(false);

  const [user, setUser] = useState(null);

  const [chapter, setChapter] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [questionCount, setQuestionCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState({ isOpen: false, goals: [] });

  let scoretotal = 0;

  const colorheader = '#1e2a47';
  const progress = ((questionCount + 1) / numberOfQuestions) * 100;

  const getRandomChapter = () => {
    if (!chapters || chapters.length === 0) return null;
    return chapters[Math.floor(Math.random() * chapters.length)];
  };

  // Función para obtener preguntas
  const fetchQuestion = useCallback(async () => {
    if (process.env.NODE_ENV === 'development') {
      let chapter = 'texto para simular una pregunta';
      console.log('🔧 Modo Desarrollo: Cargando pregunta de prueba.');
      setLoading(true);

      // Simulamos un pequeño retraso de red para que el spinner de carga sea visible
      setTimeout(() => {
        setQuestionData(mockQuestionData);
        setLoading(false);
      }, 500); // 500ms de retraso simulado

      return; // ¡IMPORTANTE! Salimos de la función para no ejecutar el código de abajo.
    }

    if (!chapter || quizFinished) return;

    if (!isReliablyOnline) return;

    try {
      setLoading(true);

      // Usar fetchWithToken en lugar de fetch normal
      const response = await fetchWithToken(
        'https://8txnxmkveg.us-east-1.awsapprunner.com/api/groq/generate-question',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chapter }),
        },
      );

      const data = await response.json();

      if (response.ok && data.choices && data.choices[0]?.message?.content) {
        try {
          const textResponse = data.choices[0].message.content.trim();
          setQuestionData(JSON.parse(textResponse));
        } catch (err) {
          console.error('❌ Error al parsear JSON desde Laravel+Groq:', err);
        }
      } else {
        console.error('❌ Error en la respuesta del backend:', data);
      }
    } catch (error) {
      console.error('❌ Error al llamar al endpoint Laravel:', error);
    } finally {
      setLoading(false);
    }
  }, [chapter, quizFinished, fetchWithToken, isReliablyOnline]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  useEffect(() => {
    setChapter(getRandomChapter());
  }, [chapters]);
  // Verificamos canEarnPoints cuando cambia el usuario

  // el useeffect de sopa de letras
  // está usando localClientData.uid para checkCanEarnPointsFromGames
  // podríamos usarlo aquí tb?
  useEffect(() => {
    if (user && user.uid) {
      checkCanEarnPoints(user.uid);
    }
  }, [user, checkCanEarnPoints]);

  // Función unificada para enviar datos a la API

  const triggerGoal = (newGoal) => {
    setModalState((prev) => ({
      isOpen: true,
      goals: [...prev.goals, newGoal],
    }));
  };

  const closeModal = () => {
    setModalState((prev) => {
      const newGoals = prev.goals.slice(1);
      return {
        isOpen: newGoals.length > 0,
        goals: newGoals,
      };
    });
  };

  const handleNextQuestion = async () => {
    if (questionCount >= numberOfQuestions - 1) {
      setQuizFinished(true);
      setRetryAvailable(false);

      try {
        if (score > 0 && canEarnPoints === true) {
          // 🔥 Paso 1: Prepara todas las operaciones de guardado que necesitas hacer.
          const promisesToSave = [];
          let scoretotal = score;

          if (score === numberOfQuestions) {
            scoretotal = score + 4 + (localClientData?.level || 0);

            // Añadimos la promesa de guardar el quiz perfecto
            promisesToSave.push(
              saveDataToApi('saveQuizzdone', { quizzesdone: 1 }),
            );

            // Muestra el primer popup
            triggerGoal('perfectScore');
            // Espera un poco para que el usuario lo vea antes del siguiente.
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }

          // Añade el resto de promesas a la lista
          promisesToSave.push(
            saveDataToApi('savePoints', { points: scoretotal }),
          );
          promisesToSave.push(
            saveDataToApi('saveQuestions', { questionsright: score }),
          );
          promisesToSave.push(
            saveDataToApi('saveQuizztoday', {
              quizzestoday: 1,
              score: scoretotal,
            }),
          );

          // 🚀 Paso 2: Ejecuta TODAS las promesas de guardado en paralelo.
          // El código solo continuará cuando TODAS se hayan completado con éxito.
          console.log(
            '🔹 Enviando todas las solicitudes para registrar resultados...',
          );
          await Promise.all(promisesToSave);
          console.log(
            '✅ Todos los resultados han sido registrados correctamente en el servidor.',
          );

          // Muestra el popup de "juego completado"
          triggerGoal('completion');
          await new Promise((resolve) => setTimeout(resolve, 500));

          // ✅ Paso 3: AHORA, y solo ahora, refresca los datos del cliente UNA SOLA VEZ.
          // Esto traerá todos los datos actualizados (puntos, nivel, etc.) de una sola vez.
          await refreshClientData();
        }
      } catch (error) {
        console.error('❌ Error al registrar resultados:', error);
      } finally {
        setRetryAvailable(true);
      }
    } else {
      // ... (lógica para la siguiente pregunta)
      setQuestionCount((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setFeedback('');
      if (!quizFinished) {
        setChapter(getRandomChapter());
      }
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr); // ← guardamos aquí el user real
      if (usr) {
        //console.log("✅ Usuario autenticado:", usr.uid);
      } else {
        //console.warn("⚠️ No hay usuario autenticado.");
      }
    });
    return () => unsubscribe();
  }, []);

  const restartTest = async () => {
    setQuestionCount(0);
    setScore(0);
    setQuizFinished(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setFeedback('');
    setChapter(getRandomChapter());

    // Verificar si se pueden ganar puntos al reiniciar
    if (user && user.uid) {
      await checkCanEarnPoints(user.uid);
    }
  };

  const handleOptionClick = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === questionData?.respuestaCorrecta) {
      setFeedback('✅ Right!');
      setScore((prev) => prev + 1);
    } else {
      setFeedback('❌ Wrong!');
    }
  };

  const isAuthenticated = useAuthStatus();

  return (
    <div>
      {!isAuthenticated ? (
        <div className="bg-yellow-100 border border-yellow-400 p-2 mb-4 text-yellow-700 rounded-md">
          You can gain <b>feathers</b> only when you are logged in.
        </div>
      ) : (
        // mostrar lo siguiente si está autenticado
        <div>
          {pointsError ? (
            <div className="hidden text-green-500">Error: {pointsError}</div>
          ) : (
            <div>
              {canEarnPoints === 'cargando' ? (
                <div className="bg-[#fef9c3] border border-[#eab308] p-2 mb-2 italic text-[#705502] rounded-md">
                  Loading...
                </div>
              ) : canEarnPoints === true ? (
                <div className="hidden text-green-500">
                  You can earn more feathers today.
                </div>
              ) : (
                <div className="bg-[#fef9c3] border border-[#eab308] p-2 mb-2 italic text-[#705502] rounded-md">
                  <p className="rounded-md">
                    You can try more quizzes, but you cannot earn more feathers
                    here today.
                  </p>
                  <p>
                    <a href="/feathers" className="text-blue-500 underline">
                      Check your level and look for more tasks
                    </a>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div>
        {questionCount < numberOfQuestions && (
          <span className="font-bold">
            Question {questionCount + 1} of {numberOfQuestions}
          </span>
        )}
        {quizFinished && score === numberOfQuestions && (
          <Confetti recycle={false} gravity={0.5} tweenDuration={1000} />
        )}
        {quizFinished ? (
          <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-green-100 text-green-800">
            {/* MoneyTagAds adType="vignette"  */}

            <h2 className="text-2xl font-bold">🎉 ¡Quizz Completed!</h2>
            <p className="mt-2">
              You've answered {numberOfQuestions} questions. ¡Congratulations!
            </p>
            <p className="mt-2 font-bold">
              ✅ Final score: {score} / {numberOfQuestions}
            </p>
            <p className="mt-2 font-bold">
              📊 % of success: {((score / numberOfQuestions) * 100).toFixed(2)}%
            </p>

            {/* Botón de reinicio siempre activo */}
            <button
              onClick={restartTest}
              className={`bg-green-500 text-white p-2 rounded transition mt-4
                  ${!retryAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
              disabled={!retryAvailable}
            >
              Free Retry 🆓
              {!retryAvailable && (
                <FaSpinner className="ml-2 inline animate-spin text-gray-600" />
              )}
            </button>
          </div>
        ) : loading ? (
          <DotLoader color={colorheader} loading={loading} size={60} />
        ) : (
          <div className="mt-4 p-4 dark:bg-dark-2 bg-blue-50 rounded-lg relative border border-blue-500">
            <p className="font-semibold mt-2 mb-4">{questionData?.pregunta}</p>
            <ul>
              {questionData?.opciones.map((opcion, index) => (
                <li
                  key={index}
                  className={`bg-white mb-4 cursor-pointer p-2 rounded dark:bg-dark-1 border border-blue-500 dark:border-gray-blue ${
                    selectedOption !== null
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  } ${
                    selectedOption === index
                      ? index === questionData.respuestaCorrecta
                        ? 'bg-green-300'
                        : 'bg-red-300'
                      : 'hover:bg-gray-200'
                  }`}
                  onClick={() => handleOptionClick(index)}
                >
                  {opcion}
                </li>
              ))}
            </ul>

            {feedback && <p>{feedback}</p>}

            <button
              onClick={handleNextQuestion}
              className={`bg-blue-500 text-white p-2 rounded transition mb-4 mt-4 ${
                !isAnswered
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-blue-700'
              }`}
              disabled={!isAnswered}
            >
              {questionCount >= numberOfQuestions - 1
                ? 'Finish'
                : 'Next Question'}
            </button>

            <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-300 rounded">
              <div
                className="h-full bg-blue-500 rounded transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <Popup
        isOpen={modalState.isOpen}
        onClose={closeModal}
        score={score}
        goal={modalState.goals[0]}
      />
    </div>
  );
};

export default Test;
