import React, { useContext } from 'react';
import { AppClientContext } from '../context/ClientDataProvider'; // Asegúrate de usar el contexto correcto
import { motion } from 'framer-motion';

const PointsDisplay = () => {
  const { clientData } = useContext(AppClientContext);
  const points = clientData?.points ?? 0;

  return (
    <motion.p
      key={points} // Al cambiar la key, se dispara la animación de entrada
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mt-1 text-[#adbadb] font-bebas text-2xl mr-1"
    >
      {points}
    </motion.p>
  );
};

export default PointsDisplay;
