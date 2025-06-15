/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
    darkMode: 'class', // Esto es importante para que funcione el toggle

  theme: {
    extend: {
     colors: {
        primary: '#1E2A47',  
        secondary: '#FF8C00',  
        accent: '#F4A261',  
        neutral: '#D3D3D3',  
        dark: '#2C3E50',  
        light: '#F0F0F0',  
        muted: '#B0BEC5',  
        graycustom: '#444444', 
        // light colourss
        'light-1': '#f4f4f4',
        'light-blue': '#b3d0ff', 
        // dark colours
        'dark-1': '#0f172a', 
        'dark-2': '#1f2937', 
        'dark-3': '#6e6e6e', 
        'dark-4': '#4b5563', 
        'dark-5': '#4b5563', 
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
