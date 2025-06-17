// src/components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const ScrollToTop = () => {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [router.asPath]); // se ejecuta al cambiar de ruta

  return null;
};

export default ScrollToTop;
