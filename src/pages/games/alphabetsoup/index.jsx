import React, { useState, useEffect, useContext, useRef } from 'react';

import Popup from "../../../components/Popup";
import Breadcrumb from "../../../components/BreadCrumb";
import { AppClientContext } from "../../../context/ClientDataProvider";

import useAuthStatus from "../../../components/useAuthStatus";
import useOnlineStatus from "../../../components/useOnlineStatus"; // Importa el hook de estado de conexión


const SopaDeLetras = () => {

        const { isReliablyOnline } = useOnlineStatus(); // Obtén el estado de conexión

        /* Necesario para popup */
        const { refreshClientData, saveDataToApi, clientData,
          canEarnPointsFromGames,
          pointsForGamesError,
          checkCanEarnPointsFromGames,
          getOfflineMessage,
        } = useContext(AppClientContext);

        // añado datos de cliente niveles 2
        const [localClientData, setLocalClientData] = useState(clientData || {});
        
        const [retryAvailable, setRetryAvailable] = useState(false);

        // añado datos de cliente niveles 3
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
        /* Necesario para popup */

        const gameContainerRef = useRef(null);
   
        // añadido para los intentos que pueden ganar puntos
        useEffect(() => {
          if (localClientData && localClientData.uid) {
            checkCanEarnPointsFromGames(localClientData.uid);
            //console.log("checkCanEarnPointsFromGames");
          } else {
            //console.log("NO UID available yet");
          }
        }, [localClientData, checkCanEarnPointsFromGames]);

        // Efecto para prevenir pull-to-refresh en móviles
        useEffect(() => {
          const preventDefault = (e) => {
            // Verificar si el toque ocurre dentro del contenedor del juego
            if (gameContainerRef.current && 
                (e.target === gameContainerRef.current || gameContainerRef.current.contains(e.target))) {
              if (window.scrollY <= 0) {
                e.preventDefault();
              }
            }
          };
      
          document.addEventListener('touchmove', preventDefault, { passive: false });
          return () => {
            document.removeEventListener('touchmove', preventDefault);
          };
        }, []);

        // Lista de palabras posibles
        const palabrasPosibles = [
                'HOUSE', 'MOTOR', 'BOOK', 'TRAIN', 'SUN', 'LIGHT',
                'WATER', 'FIRE', 'EARTH', 'AIR', 'CAR', 'BOAT',
                'PAPER', 'PEN', 'FLOWER', 'TREE', 'TABLE', 'CHAIR',
                'LAPTOP', 'KEYBOARD', 'MOUSE', 'SCREEN', 'FRAME', 'CLOCK',
                'PLANT', 'KITCHEN', 'DOOR', 'GARDEN', 'ROAD', 'BEACH',
              
                // Extra words
                'SKY', 'GROUND', 'FOREST', 'RIVER', 'SEA', 'WALL',
                'WINDOW', 'DRAWER', 'DRINK', 'INKPOT', 'TICKET', 'PANTS',
                'SHOES', 'HAT', 'SCARF', 'BOTTLE', 'GLASS', 'KNIFE',
                'OVEN', 'CARD', 'MONEY', 'MUSEUM', 'THEATER', 'CINEMA',
                'COFFEE', 'MILK', 'CHEESE', 'BREAD', 'GUITAR', 'DRUM',
                'BALCONY', 'PILLOW', 'SHIRT', 'SKIRT', 'JACKET', 'COAT',
                'STONE', 'TRUCK', 'MARCH', 'TRAVEL', 'PLANE', 'BIKE',
                'DREAM', 'CLOUD', 'STAR', 'PLANET', 'SWORD', 'HELMET',
                'SHIELD', 'RING', 'NECKLACE', 'EARRING', 'GAME', 'TOWER',
                'CASTLE', 'BRIDGE', 'PAINT', 'BRUSH',
              
                // Palabras nuevas para reemplazar las repetidas
                'BRICK', 'CANDLE', 'CANOPY', 'CARPET', 'CART', 'CHALK',
                'CLOAK', 'CUPBOARD', 'CUSHION', 'DESK', 'DOCK', 'DOLLAR',
                'DRESS', 'DRIVER', 'ENGINE', 'FENCE', 'FLOOR', 'FORK',
                'FRIDGE', 'FRUIT', 'GLOBE', 'GOLD', 'HAMMER', 'HANDLE',
                'HANGER', 'HEATER', 'HILL', 'ISLAND', 'JEANS', 'JUG',
                'KETTLE', 'LADDER', 'LAMP', 'LEMON', 'LOCKER', 'MARKER',
                'MIRROR', 'MUG', 'NAPKIN', 'NEEDLE', 'NIGHT', 'OCEAN',
                'OFFICE', 'ORANGE', 'PALACE', 'PENCIL', 'PLATES', 'PORTAL',
                'POSTER', 'POTATO', 'POUCH', 'QUARTZ', 'QUILL', 'RACKET',
                'RAILWAY', 'REMOTE', 'ROCKET', 'ROOF', 'ROOM', 'SADDLE',
                'SALAD', 'SANDAL', 'SCHOOL', 'SEAT', 'SHELF', 'SHELL',
                'SINK', 'SOCKET', 'SPOON', 'STAPLE', 'STATUE', 'STICKER',
                'STOVE', 'SUITCASE', 'SWITCH', 'TENT', 'FOSSIL', 'GOWN',
                'LADLE', 'PEBBLE', 'SPEAR', 'VASE', 'BLADE', 'PIGEON',
                'POTION', 'TUNNEL', 'HARBOR', 'ANCHOR', 'TUNICS'
        ];

        // Tamaño de la cuadrícula
        const GRID_SIZE = 8;
        
        const TOTAL_WORDS = 7;
        // Estado del juego
        const [grid, setGrid] = useState(Array(GRID_SIZE).fill().map(() => 
          Array(GRID_SIZE).fill().map(() => ({
            letra: 'A',
            palabraIndice: -1,
            indice: -1,
            usada: false
          }))
        ));
        const [palabras, setPalabras] = useState([]);
        const [encontradas, setEncontradas] = useState([]);
        const [seleccion, setSeleccion] = useState({ inicio: null, fin: null, celdas: [] });
      
        // Inicialización del juego
        useEffect(() => {
          iniciarJuego();
        }, []);
      
        // Función para iniciar/reiniciar el juego
        const iniciarJuego = () => {
          setRetryAvailable(false);
          try {
            // Seleccionar TOTAL_WORDS palabras aleatorias
            const palabrasSeleccionadas = seleccionarPalabrasAleatorias(palabrasPosibles, TOTAL_WORDS);
            setPalabras(palabrasSeleccionadas);
            setEncontradas([]);
            setSeleccion({ inicio: null, fin: null, celdas: [] });
            
            // Crear la cuadrícula de la sopa de letras
            const nuevaGrid = crearSopaDeLetras(palabrasSeleccionadas, GRID_SIZE);
            setGrid(nuevaGrid);
          } catch (error) {
            console.error("Error al iniciar juego:", error);
            // Inicializar un grid vacío en caso de error
            setGrid(Array(GRID_SIZE).fill().map(() => 
              Array(GRID_SIZE).fill().map(() => ({
                letra: 'A',
                palabraIndice: -1,
                indice: -1,
                usada: false
              }))
            ));
          }
        };
      
        // Seleccionar palabras aleatorias
        const seleccionarPalabrasAleatorias = (listaPalabras, cantidad) => {
          const palabrasFiltradas = listaPalabras.filter(palabra => 
            palabra.length >= 4 && palabra.length <= 7
          );
          
          const seleccionadas = [];
          const copiaPalabras = [...palabrasFiltradas];
          
          for (let i = 0; i < cantidad && copiaPalabras.length > 0; i++) {
            const indiceAleatorio = Math.floor(Math.random() * copiaPalabras.length);
            seleccionadas.push(copiaPalabras[indiceAleatorio]);
            copiaPalabras.splice(indiceAleatorio, 1);
          }
          
          return seleccionadas;
        };
      
        // Crear la sopa de letras
        const crearSopaDeLetras = (palabras, tamano) => {
          // Inicializar cuadrícula
          const grid = Array(tamano).fill().map(() => 
            Array(tamano).fill().map(() => ({
              letra: '',
              palabraIndice: -1,
              indice: -1,
              usada: false
            }))
          );
          
          // Colocar cada palabra en la cuadrícula
          palabras.forEach((palabra, palabraIndice) => {
            let colocada = false;
            let intentos = 0;
            const maxIntentos = 100;
            
            while (!colocada && intentos < maxIntentos) {
              intentos++;
              
              // Elegir dirección aleatoria
              const direcciones = [
                { dx: 1, dy: 0 },  // Horizontal
                { dx: 0, dy: 1 },  // Vertical
                { dx: 1, dy: 1 },  // Diagonal hacia abajo
                { dx: 1, dy: -1 }  // Diagonal hacia arriba
              ];
              const direccion = direcciones[Math.floor(Math.random() * direcciones.length)];
              
              // Calcular punto de inicio válido
              const palabraLongitud = palabra.length;
              const maxX = tamano - (direccion.dx * (palabraLongitud - 1));
              const maxY = tamano - (direccion.dy * (palabraLongitud - 1));
              const startX = Math.floor(Math.random() * Math.max(1, maxX));
              const startY = Math.floor(Math.random() * Math.max(1, maxY));
              
              // Verificar si la palabra cabe
              let puedePoner = true;
              const posiciones = [];
              
              for (let i = 0; i < palabraLongitud; i++) {
                const x = startX + i * direccion.dx;
                const y = startY + i * direccion.dy;
                
                // Verificar límites
                if (x < 0 || x >= tamano || y < 0 || y >= tamano) {
                  puedePoner = false;
                  break;
                }
                
                // Verificar colisiones
                if (grid[y][x].usada && grid[y][x].letra !== palabra[i]) {
                  puedePoner = false;
                  break;
                }
                
                posiciones.push({ x, y });
              }
              
              // Colocar la palabra
              if (puedePoner) {
                posiciones.forEach((pos, indice) => {
                  if (pos.y >= 0 && pos.y < grid.length && pos.x >= 0 && pos.x < grid[pos.y].length) {
                    grid[pos.y][pos.x] = {
                      letra: palabra[indice],
                      palabraIndice,
                      indice,
                      usada: true
                    };
                  }
                });
                colocada = true;
              }
            }
          });
          
          // Rellenar los espacios vacíos con letras aleatorias
          for (let y = 0; y < tamano; y++) {
            for (let x = 0; x < tamano; x++) {
              if (!grid[y][x].usada) {
                grid[y][x] = {
                  letra: String.fromCharCode(65 + Math.floor(Math.random() * 26)),
                  palabraIndice: -1,
                  indice: -1, 
                  usada: false
                };
              }
            }
          }
          
          return grid;
        };
      
        // Manejar el inicio de la selección
        const handleMouseDown = (rowIndex, colIndex) => {
          setSeleccion({
            inicio: { row: rowIndex, col: colIndex },
            fin: null,
            celdas: [{ row: rowIndex, col: colIndex }]
          });
        };
      
        // Manejar el movimiento durante la selección
        const handleMouseOver = (rowIndex, colIndex) => {
          if (!seleccion.inicio) return;
      
          try {
            const celdas = [];
            const inicio = seleccion.inicio;
            
            // Determinar la dirección de la selección
            const diferenciaX = colIndex - inicio.col;
            const diferenciaY = rowIndex - inicio.row;
            
            let direccion;
            if (diferenciaX === 0) direccion = { dx: 0, dy: Math.sign(diferenciaY) || 1 };
            else if (diferenciaY === 0) direccion = { dx: Math.sign(diferenciaX) || 1, dy: 0 };
            else if (Math.abs(diferenciaX) === Math.abs(diferenciaY)) {
              direccion = { 
                dx: Math.sign(diferenciaX) || 1, 
                dy: Math.sign(diferenciaY) || 1 
              };
            } else {
              return; // Solo permitimos movimientos horizontales, verticales o diagonales de 45 grados
            }
            
            // Calcular celdas entre inicio y fin
            const distancia = Math.max(Math.abs(diferenciaX), Math.abs(diferenciaY));
            for (let i = 0; i <= distancia; i++) {
              const newRow = inicio.row + i * direccion.dy;
              const newCol = inicio.col + i * direccion.dx;
              
              if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
                celdas.push({ row: newRow, col: newCol });
              }
            }
            
            setSeleccion({
              ...seleccion,
              fin: { row: rowIndex, col: colIndex },
              celdas
            });
          } catch (error) {
            console.error("Error en handleMouseOver:", error);
          }
        };

        // Agrega esta función para manejar el touchmove
        const handleTouchMove = (e) => {
          // Solo prevenir el comportamiento por defecto si hay una selección activa
          if (seleccion.inicio) {
            e.preventDefault();
          }
        };
      
        // Manejar el fin de la selección
        const handleMouseUp = () => {
          if (!seleccion.inicio || !seleccion.fin || seleccion.celdas.length === 0) return;
                
          try {
            // Obtener palabra seleccionada
            const palabraSeleccionada = seleccion.celdas.map(celda => {
              if (celda.row >= 0 && celda.row < grid.length && 
                  celda.col >= 0 && celda.col < grid[celda.row].length) {
                return grid[celda.row][celda.col].letra;
              }
              return '';
            }).join('');
            
            // Verificar si es una de las palabras a encontrar
            const index = palabras.findIndex(palabra => 
              palabra === palabraSeleccionada || palabra === palabraSeleccionada.split('').reverse().join('')
            );
            
            if (index !== -1 && !encontradas.includes(index)) {
              setEncontradas(prev => {
                const newEncontradas = [...prev, index];
                

                // Check if all words have been found
                if (newEncontradas.length === palabras.length) {

                  // check if canearnpointsfromgames is true
                  if (canEarnPointsFromGames === true) {

                    // Add a delay before showing the perfect score popup
                    setTimeout(() => {                    
                      const scoreValue = 10 + (localClientData?.level || 0);
                      setScore(scoreValue);
                      
                      //triggerGoal("perfectScore");

                      if (isReliablyOnline) {

                        triggerGoal("gameCompleted");
                        
                        saveDataToApi("savePoints", { points: scoreValue });

                        saveDataToApi("saveGametoday", { gamestoday: 1 });

                        saveDataToApi("saveGamedone", { gamesdone: 1 });

                        refreshClientData();
                        
                      }

                      setRetryAvailable(true);

                    }, 2500); // This delay should be longer than the popup display time

                  } else {
                    setRetryAvailable(true);
                  }
                }

                return newEncontradas;

              });
            }
          } catch (error) {
            console.error("Error in handleMouseUp:", error);
          }
          
          setSeleccion({ inicio: null, fin: null, celdas: [] });
        };
      
        // Verificar si una celda está seleccionada
        const estaSeleccionada = (rowIndex, colIndex) => {
          return seleccion.celdas.some(celda => 
            celda.row === rowIndex && celda.col === colIndex
          );
        };
      
        // Verificar si una celda pertenece a una palabra encontrada
        const estaEncontrada = (rowIndex, colIndex) => {
          if (rowIndex < 0 || rowIndex >= grid.length || 
              colIndex < 0 || colIndex >= grid[rowIndex].length) {
            return false;
          }
          
          const celda = grid[rowIndex][colIndex];
          return celda.palabraIndice !== -1 && encontradas.includes(celda.palabraIndice);
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

            {!isReliablyOnline ? ( getOfflineMessage() ) : (

              <div>

              {!isAuthenticated ? (
                <div className="bg-yellow-100 border border-yellow-400 p-2 mb-4 text-yellow-700 rounded-md">
                  You can gain <b>feathers</b> only when you are logged in.
                </div>
              ) : (

                <div>

                  {pointsForGamesError ? (
                    <div className="hidden text-green-500">Error: {pointsForGamesError}</div>
                  ) : (
                    <div>
                      { canEarnPointsFromGames === null ? (
                        <div className="hidden">Cargando...</div>
                      ) : canEarnPointsFromGames ? (
                        <div className="hidden text-green-500">
                          You can earn more feathers today.
                        </div>
                      ) : (
                        <div className="bg-[#fef9c3] border border-[#eab308] p-2 mb-2 italic text-[#705502]">
                          <p>You can play more games, but you cannot earn more feathers here today.</p>
                          <p><a href="/feathers" className="text-blue-500 underline">Check your level and look for more tasks</a></p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              </div>
            )}
            <div className="flex flex-col items-center justify-center mt-4">
              <h1 className="text-3xl font-bold mb-4 text-[#1e2a47]">Alphabet Soup</h1>

              {/* Aviso de que no se pueden ganar más puntos */}

              <Popup
                isOpen={modalState.isOpen}
                onClose={closeModal}
                score={score}
                goal={modalState.goals[0]}
              />
            
              <div 
                ref={gameContainerRef}
                className="border-4 border-[#1e2a47] rounded-lg p-1 bg-white shadow-lg" 
                onMouseLeave={() => setSeleccion({ inicio: null, fin: null, celdas: [] })}
                onTouchEnd={handleMouseUp}
                style={{ overscrollBehaviorY: 'contain' }}
                onTouchMove={handleTouchMove}
              >
                <div className="select-none">
                  {grid.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex">
                      {row.map((celda, colIndex) => (
                        <div
                          key={colIndex}
                          className={`w-8 h-8 flex items-center justify-center font-bold cursor-pointer text-lg
                            ${estaEncontrada(rowIndex, colIndex) ? 'bg-green-300' : 
                              estaSeleccionada(rowIndex, colIndex) ? 'bg-blue-200' : 'bg-white'}`}
                          onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                          onTouchStart={() => handleMouseDown(rowIndex, colIndex)}
                          onMouseOver={() => handleMouseOver(rowIndex, colIndex)}
                          onTouchMove={(e) => {
                            e.preventDefault();
                            if (e.touches && e.touches[0]) {
                              const touch = e.touches[0];
                              const element = document.elementFromPoint(touch.clientX, touch.clientY);
                              if (element) {
                                const row = parseInt(element.getAttribute('data-row'), 10);
                                const col = parseInt(element.getAttribute('data-col'), 10);
                                if (!isNaN(row) && !isNaN(col)) {
                                  handleMouseOver(row, col);
                                }
                              }
                            }
                          }}
                          onMouseUp={handleMouseUp}
                          data-row={rowIndex}
                          data-col={colIndex}
                        >
                          {celda.letra}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className='mt-4 mb-4 flex flex-wrap justify-center max-w-full'>
                  {palabras.map((palabra, index) => (
                    <span 
                      key={index} 
                      className={`${encontradas.includes(index) ? 'bg-blue-50 text-black line-through' : 'bg-blue-800 text-white'} p-2 mr-2 ml-2 border-2 border-[#1e2a47] rounded-lg shadow-lg inline-block m-2`}
                    >
                      {palabra}
                    </span>
                  ))}
                </div>
              
                <div className="flex flex-col items-center">
                  <p className="text-gray-700 mb-2 mt-2">
                    {encontradas.length} / {palabras.length}
                  </p>

                  {/* Botón debe estar desactivado hasta que se acaba el juego */}

                  <button 
                    onClick={iniciarJuego}
                    className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none
                    ${!retryAvailable ? 'hidden' : ''}`}
                  >
                    Restart
                  </button>

                </div>

              </div>
            </div>
          </div>
        );
      }
      
export default SopaDeLetras;