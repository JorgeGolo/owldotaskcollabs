// pages/games.jsx
import React from "react";
import Link from "next/link";

import Breadcrumb from "../../components/BreadCrumb";

const games = () => {
  const breadcrumbSegments = [
    { name: 'Home', path: '/' },
    { name: 'Games', path: '/games' },
  ];

  // No necesitamos handleGameClick aquí si llamamos a gtag directamente.
  // También podemos eliminar el useEffect en _app.js para este CustomEvent específico.

  const handleGameClickAndTrack = (gameName) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      // Empuja el evento directamente al dataLayer
      window.dataLayer.push({
        event: 'game_selected', // El nombre del evento que tu activador en GTM está esperando
        game_name: gameName, // El parámetro que tu etiqueta de GA4 Evento está esperando
      });
      console.log(
        `Evento 'game_selected' empujado a dataLayer con game_name: ${gameName}`,
      );
    } else {
      console.warn(
        'dataLayer no está disponible. GTM podría no estar cargado.',
      );
    }
  };

  return (
    <div className="p-4 w-full">
      <Breadcrumb segments={breadcrumbSegments} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href="/games/alphabetsoup"
          className="flex items-center justify-center rounded-lg shadow-md bg-blue-100 aspect-square hover:shadow-lg transition
                    dark:bg-dark-4 "
          onClick={() =>
            handleGameClickAndTrack('Alphabet Soup', '/games/alphabetsoup')
          } // Llama a la nueva función
        >
          Alphabet Soup
        </Link>
        {/* Repite este patrón para los otros enlaces si quieres rastrearlos también */}
        <Link
          href="/games/alphabetsoup"
          className="flex items-center justify-center rounded-lg shadow-md bg-blue-100 aspect-square hover:shadow-lg transition
                    dark:bg-dark-4 "
          onClick={() =>
            handleGameClickAndTrack('Alphabet Soup', '/games/alphabetsoup')
          } // Llama a la nueva función
        >
          Alphabet Soup
        </Link>
        <Link
          href="/games/alphabetsoup"
          className="flex items-center justify-center rounded-lg shadow-md bg-blue-100 aspect-square hover:shadow-lg transition
                    dark:bg-dark-4 "
          onClick={() =>
            handleGameClickAndTrack('Alphabet Soup', '/games/alphabetsoup')
          } // Llama a la nueva función
        >
          Alphabet Soup
        </Link>
        <Link
          href="/games/alphabetsoup"
          className="flex items-center justify-center rounded-lg shadow-md bg-blue-100 aspect-square hover:shadow-lg transition
                    dark:bg-dark-4 "
          onClick={() =>
            handleGameClickAndTrack('Alphabet Soup', '/games/alphabetsoup')
          } // Llama a la nueva función
        >
          Alphabet Soup
        </Link>
      </div>
    </div>
  );
};

export default games;
