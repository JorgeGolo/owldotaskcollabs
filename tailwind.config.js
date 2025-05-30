/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E2A47',  // Fondo principal (cabecera, logo)
        secondary: '#FF8C00',  // Color complementario (detalles secundarios, acentos)
        accent: '#F4A261',  // Un tono más suave para complementar (puede ser usado para hover, botones, etc.)
        neutral: '#D3D3D3',  // Color neutro para textos o fondos secundarios
        dark: '#2C3E50',  // Un tono más oscuro para contornos o sombreado
        light: '#F0F0F0',  // Color claro para fondos secundarios o texto de contraste
        muted: '#B0BEC5',  // Color de menor énfasis para textos menos importantes
        graycustom: '#444444', // Nuevo color personalizado
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],  // Fuente moderna y legible
        serif: ['Merriweather', 'serif'],  // Fuente secundaria para encabezados
        bebas: ['"Bebas Neue"', 'sans-serif'], // Fuente gruesa para puntos y logo
      },
      spacing: {
        '32px': '32px', // Permite usar w-32px y h-32px en Tailwind
        'pb-0' : '0',
        'pl-2' : '2rem',
        'bottom-2': '2rem', // Nuevo valor para bottom-2
        'ml-2': '2rem', // Nuevo valor para bottom-2
        'sp2': '0.5rem', // Nuevo valor para bottom-2
      },
      width: {
        '1/2': '50%', // Esto garantiza que w-1/2 ocupe el 50% del ancho
        'sidewidth' : '150px',
        'smallwidth' : '80px',
        '5x1': '80%',
        '16': '16px',
      },
      height: {
        'h-50': '50px',
        '16': '16px',
      },
      fontSize: {
        'more' : '1.15rem',
        'ssm': '0.785rem', // Tamaño de fuente más pequeño
      }
    },
  },
  plugins: [],
}
