import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase'; // Asegúrate de que la ruta sea correcta

function useAuthStatus() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null indica que aún no se ha verificado

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe(); // Limpiar el listener
  }, []);

  return isLoggedIn;
}

export default useAuthStatus;