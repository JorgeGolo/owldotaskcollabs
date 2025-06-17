import React, { useState, useEffect, useContext, useRef } from "react";
import Popup from "../../../components/Popup";
import Breadcrumb from "../../../components/BreadCrumb";
import { AppClientContext } from "../../../context/ClientDataProvider";
import useAuthStatus from "../../../components/useAuthStatus";
import useOnlineStatus from "../../../components/useOnlineStatus";

const SopaDeLetras = () => {
  const { isReliablyOnline } = useOnlineStatus();
  const [isCompleting, setIsCompleting] = useState(false);

  /* Necesario para popup */
  const {
    refreshClientData,
    saveDataToApi,
    clientData,
    canEarnPointsFromGames,
    pointsForGamesError,
    checkCanEarnPointsFromGames,
    getOfflineMessage,
  } = useContext(AppClientContext);

  const [localClientData, setLocalClientData] = useState(clientData || {});
  const [retryAvailable, setRetryAvailable] = useState(false);

  useEffect(() => {
    if (clientData) {
      setLocalClientData(clientData);
    }
  }, [clientData]);

  const [score, setScore] = useState(1);
  const [modalState, setModalState] = useState({ isOpen: false, goals: [] });
  const closeModal = () => {
    setModalState((prev) => {
      const newGoals = prev.goals.slice(1);
      return {
        isOpen: newGoals.length > 0,
        goals: newGoals,
      };
    });
  };
  const triggerGoal = (newGoal) => {
    setModalState((prev) => ({
      isOpen: true,
      goals: [...prev.goals, newGoal],
    }));
  };
  /* Fin Necesario para popup */

  const gameContainerRef = useRef(null);
  const gridContainerRef = useRef(null); // Ref para el contenedor de la cuadrícula

  // Chequeo de puntos que se pueden ganar
  useEffect(() => {
    if (localClientData && localClientData.uid) {
      checkCanEarnPointsFromGames(localClientData.uid);
    }
  }, [localClientData, checkCanEarnPointsFromGames]);

  // Efecto para prevenir pull-to-refresh en móviles
  useEffect(() => {
    const preventDefault = (e) => {
      if (
        gameContainerRef.current &&
        gameContainerRef.current.contains(e.target)
      ) {
        if (window.scrollY <= 0) {
          e.preventDefault();
        }
      }
    };
    document.addEventListener("touchmove", preventDefault, { passive: false });
    return () => {
      document.removeEventListener("touchmove", preventDefault);
    };
  }, []);

  // Lista de palabras
  const palabrasPosibles = [
    "HOUSE",
    "MOTOR",
    "BOOK",
    "TRAIN",
    "SUN",
    "LIGHT",
    "WATER",
    "FIRE",
    "EARTH",
    "AIR",
    "CAR",
    "BOAT",
    "PAPER",
    "PEN",
    "FLOWER",
    "TREE",
    "TABLE",
    "CHAIR",
    "LAPTOP",
    "KEYBOARD",
    "MOUSE",
    "SCREEN",
    "FRAME",
    "CLOCK",
    "PLANT",
    "KITCHEN",
    "DOOR",
    "GARDEN",
    "ROAD",
    "BEACH",
    "SKY",
    "GROUND",
    "FOREST",
    "RIVER",
    "SEA",
    "WALL",
    "WINDOW",
    "DRAWER",
    "DRINK",
    "INKPOT",
    "TICKET",
    "PANTS",
    "SHOES",
    "HAT",
    "SCARF",
    "BOTTLE",
    "GLASS",
    "KNIFE",
    "OVEN",
    "CARD",
    "MONEY",
    "MUSEUM",
    "THEATER",
    "CINEMA",
    "COFFEE",
    "MILK",
    "CHEESE",
    "BREAD",
    "GUITAR",
    "DRUM",
    "BALCONY",
    "PILLOW",
    "SHIRT",
    "SKIRT",
    "JACKET",
    "COAT",
    "STONE",
    "TRUCK",
    "MARCH",
    "TRAVEL",
    "PLANE",
    "BIKE",
    "DREAM",
    "CLOUD",
    "STAR",
    "PLANET",
    "SWORD",
    "HELMET",
    "SHIELD",
    "RING",
    "NECKLACE",
    "EARRING",
    "GAME",
    "TOWER",
    "CASTLE",
    "BRIDGE",
    "PAINT",
    "BRUSH",
    "BRICK",
    "CANDLE",
    "CANOPY",
    "CARPET",
    "CART",
    "CHALK",
    "CLOAK",
    "CUPBOARD",
    "CUSHION",
    "DESK",
    "DOCK",
    "DOLLAR",
    "DRESS",
    "DRIVER",
    "ENGINE",
    "FENCE",
    "FLOOR",
    "FORK",
    "FRIDGE",
    "FRUIT",
    "GLOBE",
    "GOLD",
    "HAMMER",
    "HANDLE",
    "HANGER",
    "HEATER",
    "HILL",
    "ISLAND",
    "JEANS",
    "JUG",
    "KETTLE",
    "LADDER",
    "LAMP",
    "LEMON",
    "LOCKER",
    "MARKER",
    "MIRROR",
    "MUG",
    "NAPKIN",
    "NEEDLE",
    "NIGHT",
    "OCEAN",
    "OFFICE",
    "ORANGE",
    "PALACE",
    "PENCIL",
    "PLATES",
    "PORTAL",
    "POSTER",
    "POTATO",
    "POUCH",
    "QUARTZ",
    "QUILL",
    "RACKET",
    "RAILWAY",
    "REMOTE",
    "ROCKET",
    "ROOF",
    "ROOM",
    "SADDLE",
    "SALAD",
    "SANDAL",
    "SCHOOL",
    "SEAT",
    "SHELF",
    "SHELL",
    "SINK",
    "SOCKET",
    "SPOON",
    "STAPLE",
    "STATUE",
    "STICKER",
    "STOVE",
    "SUITCASE",
    "SWITCH",
    "TENT",
    "FOSSIL",
    "GOWN",
    "LADLE",
    "PEBBLE",
    "SPEAR",
    "VASE",
    "BLADE",
    "PIGEON",
    "POTION",
    "TUNNEL",
    "HARBOR",
    "ANCHOR",
    "TUNICS",
  ];

  const GRID_SIZE = 8;
  const TOTAL_WORDS = 7;

  const [grid, setGrid] = useState([]);
  const [palabras, setPalabras] = useState([]);
  const [encontradas, setEncontradas] = useState([]);
  const [seleccion, setSeleccion] = useState({
    inicio: null,
    fin: null,
    celdas: [],
  });

  // Seleccionar palabras aleatorias
  const seleccionarPalabrasAleatorias = (listaPalabras, cantidad) => {
    const palabrasFiltradas = listaPalabras.filter(
      (p) => p.length >= 4 && p.length <= GRID_SIZE,
    );
    const seleccionadas = [];
    const copiaPalabras = [...palabrasFiltradas];
    while (seleccionadas.length < cantidad && copiaPalabras.length > 0) {
      const indiceAleatorio = Math.floor(Math.random() * copiaPalabras.length);
      seleccionadas.push(copiaPalabras.splice(indiceAleatorio, 1)[0]);
    }
    return seleccionadas;
  };

  // --- FUNCIÓN CORREGIDA ---
  // Crea la sopa de letras de forma robusta, permitiendo cruces de palabras
  // y devolviendo solo las palabras que realmente se pudieron colocar.
  const crearSopaDeLetras = (palabrasParaColocar, tamano) => {
    const grid = Array(tamano)
      .fill(null)
      .map(() =>
        Array(tamano)
          .fill(null)
          .map(() => ({
            letra: "",
            palabraIndices: [],
            esPalabra: false,
          })),
      );

    const palabrasColocadasConIndice = [];

    palabrasParaColocar.forEach((palabra, indiceOriginal) => {
      let colocada = false;
      let intentos = 0;
      const maxIntentos = 100;

      while (!colocada && intentos < maxIntentos) {
        intentos++;
        const direcciones = [
          { dx: 1, dy: 0 },
          { dx: -1, dy: 0 },
          { dx: 0, dy: 1 },
          { dx: 0, dy: -1 },
          { dx: 1, dy: 1 },
          { dx: -1, dy: 1 },
          { dx: 1, dy: -1 },
          { dx: -1, dy: -1 },
        ];
        const direccion =
          direcciones[Math.floor(Math.random() * direcciones.length)];

        const startX = Math.floor(Math.random() * tamano);
        const startY = Math.floor(Math.random() * tamano);
        const endX = startX + (palabra.length - 1) * direccion.dx;
        const endY = startY + (palabra.length - 1) * direccion.dy;

        if (endX >= 0 && endX < tamano && endY >= 0 && endY < tamano) {
          let puedePoner = true;
          const posiciones = [];
          for (let i = 0; i < palabra.length; i++) {
            const x = startX + i * direccion.dx;
            const y = startY + i * direccion.dy;
            if (grid[y][x].esPalabra && grid[y][x].letra !== palabra[i]) {
              puedePoner = false;
              break;
            }
            posiciones.push({ x, y });
          }

          if (puedePoner) {
            posiciones.forEach((pos, i) => {
              const celda = grid[pos.y][pos.x];
              celda.letra = palabra[i];
              celda.esPalabra = true;
              if (!celda.palabraIndices.includes(indiceOriginal)) {
                celda.palabraIndices.push(indiceOriginal);
              }
            });
            palabrasColocadasConIndice.push({ palabra, indiceOriginal });
            colocada = true;
          }
        }
      }
    });

    const palabrasFinales = palabrasColocadasConIndice.map((p) => p.palabra);
    const mapaIndices = {};
    palabrasColocadasConIndice.forEach((p, nuevoIndice) => {
      mapaIndices[p.indiceOriginal] = nuevoIndice;
    });

    for (let y = 0; y < tamano; y++) {
      for (let x = 0; x < tamano; x++) {
        const celda = grid[y][x];
        celda.palabraIndices = celda.palabraIndices
          .map((idx) => mapaIndices[idx])
          .filter((idx) => idx !== undefined);
        if (!celda.esPalabra) {
          celda.letra = String.fromCharCode(
            65 + Math.floor(Math.random() * 26),
          );
        }
        delete celda.esPalabra;
      }
    }
    return { nuevaGrid: grid, palabrasFinales };
  };

  // --- FUNCIÓN CORREGIDA ---
  // Inicia el juego de forma limpia, sin código duplicado ni errores lógicos.
  const iniciarJuego = () => {
    setIsCompleting(false);
    setRetryAvailable(false);
    try {
      const palabrasSeleccionadas = seleccionarPalabrasAleatorias(
        palabrasPosibles,
        TOTAL_WORDS,
      );
      const { nuevaGrid, palabrasFinales } = crearSopaDeLetras(
        palabrasSeleccionadas,
        GRID_SIZE,
      );

      setGrid(nuevaGrid);
      setPalabras(palabrasFinales);
      setEncontradas([]);
      setSeleccion({ inicio: null, fin: null, celdas: [] });
    } catch (error) {
      console.error("Error al iniciar juego:", error);
      setGrid([]);
      setPalabras([]);
    }
  };

  useEffect(() => {
    iniciarJuego();
  }, []);

  const handleMouseDown = (rowIndex, colIndex) => {
    setSeleccion({
      inicio: { row: rowIndex, col: colIndex },
      fin: { row: rowIndex, col: colIndex },
      celdas: [{ row: rowIndex, col: colIndex }],
    });
  };

  const handleMouseOver = (rowIndex, colIndex) => {
    if (
      !seleccion.inicio ||
      (seleccion.fin &&
        seleccion.fin.row === rowIndex &&
        seleccion.fin.col === colIndex)
    )
      return;

    const celdas = [];
    const inicio = seleccion.inicio;
    const diferenciaX = colIndex - inicio.col;
    const diferenciaY = rowIndex - inicio.row;

    let direccion = { dx: 0, dy: 0 };
    if (diferenciaX === 0 && diferenciaY === 0) {
      // No movement yet
    } else if (diferenciaX === 0) {
      // Vertical
      direccion = { dx: 0, dy: Math.sign(diferenciaY) };
    } else if (diferenciaY === 0) {
      // Horizontal
      direccion = { dx: Math.sign(diferenciaX), dy: 0 };
    } else if (Math.abs(diferenciaX) === Math.abs(diferenciaY)) {
      // Diagonal
      direccion = { dx: Math.sign(diferenciaX), dy: Math.sign(diferenciaY) };
    } else {
      return; // Movimiento no válido
    }

    const distancia = Math.max(Math.abs(diferenciaX), Math.abs(diferenciaY));
    for (let i = 0; i <= distancia; i++) {
      const newRow = inicio.row + i * direccion.dy;
      const newCol = inicio.col + i * direccion.dx;
      if (
        newRow >= 0 &&
        newRow < GRID_SIZE &&
        newCol >= 0 &&
        newCol < GRID_SIZE
      ) {
        celdas.push({ row: newRow, col: newCol });
      }
    }

    setSeleccion((prev) => ({
      ...prev,
      fin: { row: rowIndex, col: colIndex },
      celdas,
    }));
  };

  const handleMouseUp = () => {
    if (!seleccion.inicio || seleccion.celdas.length < 2) {
      setSeleccion({ inicio: null, fin: null, celdas: [] });
      return;
    }

    const palabraSeleccionada = seleccion.celdas
      .map((c) => grid[c.row][c.col].letra)
      .join("");
    const palabraInvertida = palabraSeleccionada.split("").reverse().join("");

    const index = palabras.findIndex(
      (p) => p === palabraSeleccionada || p === palabraInvertida,
    );

    if (index !== -1 && !encontradas.includes(index)) {
      setEncontradas((prev) => {
        const newEncontradas = [...prev, index];

        if (newEncontradas.length === palabras.length) {
          setIsCompleting(true);
          if (canEarnPointsFromGames) {
            // Hacemos que la función dentro del timeout sea async
            setTimeout(async () => {
              const scoreValue = 10 + (localClientData?.level || 0);
              setScore(scoreValue);
              if (isReliablyOnline) {
                try {
                  triggerGoal("gameCompleted");

                  // Usamos Promise.all para ejecutar todas las guardadas en paralelo
                  // y esperamos a que TODAS terminen.
                  await Promise.all([
                    saveDataToApi("savePoints", { points: scoreValue }),
                    saveDataToApi("saveGametoday", { gamestoday: 1 }),
                    saveDataToApi("saveGamedone", { gamesdone: 1 }),
                  ]);

                  // AHORA, y solo ahora, refrescamos los datos del cliente.
                  // Esto garantiza que el servidor ha procesado todo lo anterior.
                  refreshClientData();
                } catch (error) {
                  console.error("Error al guardar los datos del juego:", error);
                  // Aquí podrías mostrar un error al usuario si algo falla
                } finally {
                  setRetryAvailable(true);
                }
              } else {
                setRetryAvailable(true);
              }
            }, 1500);
          } else {
            setIsCompleting(false);
            setRetryAvailable(true);
          }
        }
        return newEncontradas;
      });
    }
    setSeleccion({ inicio: null, fin: null, celdas: [] });
  };
  // --- MANEJADOR TÁCTIL CORREGIDO ---
  // Un solo manejador en el contenedor de la cuadrícula, más eficiente y fiable.
  const handleGridTouchMove = (e) => {
    if (!seleccion.inicio) return;

    if (e.touches && e.touches[0]) {
      const touch = e.touches[0];
      const gridElement = gridContainerRef.current;
      if (!gridElement) return;

      const rect = gridElement.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      const cellWidth = gridElement.clientWidth / GRID_SIZE;
      const cellHeight = gridElement.clientHeight / GRID_SIZE;

      const colIndex = Math.floor(x / cellWidth);
      const rowIndex = Math.floor(y / cellHeight);

      if (
        rowIndex >= 0 &&
        rowIndex < GRID_SIZE &&
        colIndex >= 0 &&
        colIndex < GRID_SIZE
      ) {
        handleMouseOver(rowIndex, colIndex);
      }
    }
  };

  const estaSeleccionada = (row, col) =>
    seleccion.celdas.some((c) => c.row === row && c.col === col);

  const estaEncontrada = (row, col) => {
    if (!grid[row] || !grid[row][col]) return false;
    const celda = grid[row][col];
    return celda.palabraIndices.some((pIndex) => encontradas.includes(pIndex));
  };

  const breadcrumbSegments = [
    { name: "Home", path: "/" },
    { name: "Games", path: "/games" },
    { name: "Alphabet Soup", path: `/games/alphabetsoup` },
  ];
  const isAuthenticated = useAuthStatus();

  return (
    <div className="p-4 w-full">
      <Breadcrumb segments={breadcrumbSegments} />
      {!isReliablyOnline ? (
        getOfflineMessage()
      ) : (
        <div>
          {!isAuthenticated ? (
            <div className="bg-yellow-100 border border-yellow-400 p-2 mb-4 text-yellow-700 rounded-md">
              You can gain <b>feathers</b> only when you are logged in.
            </div>
          ) : (
            <div>
              {pointsForGamesError ? (
                <div className="hidden text-green-500">
                  Error: {pointsForGamesError}
                </div>
              ) : (
                <div>
                  {canEarnPointsFromGames === null ? (
                    <div className="hidden">Cargando...</div>
                  ) : canEarnPointsFromGames ? (
                    <div className="hidden text-green-500">
                      You can earn more feathers today.
                    </div>
                  ) : (
                    <div className="bg-[#fef9c3] border border-[#eab308] p-2 mb-2 italic text-[#705502]">
                      <p>
                        You can play more games, but you cannot earn more
                        feathers here today.
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
        </div>
      )}
      <div className="flex flex-col items-center justify-center mt-4">
        <h1>Alphabet Soup</h1>
        <Popup
          isOpen={modalState.isOpen}
          onClose={closeModal}
          score={score}
          goal={modalState.goals[0]}
        />

        <div
          ref={gameContainerRef}
          className="relative border-4 border-[#1e2a47] rounded-lg p-1 bg-white shadow-lg touch-none" // `touch-none` para mejor control
          // Eventos consolidados en el contenedor para mayor robustez
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          onMouseLeave={() =>
            setSeleccion({ inicio: null, fin: null, celdas: [] })
          }
        >
          <div
            ref={gridContainerRef}
            className="select-none"
            onTouchMove={handleGridTouchMove} // Manejador táctil eficiente
          >
            {grid.length > 0 &&
              grid.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {row.map((celda, colIndex) => (
                    <div
                      key={colIndex}
                      className={`w-8 h-8 flex items-center justify-center font-bold cursor-pointer text-lg
                      ${
                        estaEncontrada(rowIndex, colIndex)
                          ? "bg-green-300"
                          : estaSeleccionada(rowIndex, colIndex)
                            ? "bg-blue-200"
                            : "bg-white"
                      }`}
                      onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                      onTouchStart={() => handleMouseDown(rowIndex, colIndex)}
                      onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
                    >
                      {celda.letra}
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="mt-4 mb-4 flex flex-wrap justify-center max-w-full">
            {palabras.map((palabra, index) => (
              <span
                key={index}
                className={`${encontradas.includes(index) ? "bg-blue-50 text-black line-through" : "bg-blue-800 text-white"} p-2 mr-2 ml-2 border-2 border-[#1e2a47] rounded-lg shadow-lg inline-block m-2`}
              >
                {palabra}
              </span>
            ))}
          </div>

          <div className="flex flex-col items-center">
            <p className="text-gray-700 mb-2 mt-2">
              {encontradas.length} / {palabras.length}
            </p>
            <button
              onClick={iniciarJuego}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none
              ${!retryAvailable ? "hidden" : ""}`}
            >
              Restart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SopaDeLetras;
