<<<<<<< HEAD
import React, { useEffect } from "react";
import Modal from "react-modal";
import { FaFeather } from "react-icons/fa";

Modal.setAppElement("#__next"); // o el ID que tenga tu elemento raíz
=======
import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { FaFeather } from 'react-icons/fa';

Modal.setAppElement('#__next'); // o el ID que tenga tu elemento raíz
>>>>>>> main

// Estilos del modal para LevelUpPopup
// Estilos del modal para LevelUpPopup
const levelUpModalStyles = {
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '300px',
    height: 'auto',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    animation: 'fadeIn 0.5s ease-out, fadeOut 0.5s ease-in 1.5s forwards',
    backgroundColor: '#e0f2fe', // Un azul claro suave
    textAlign: 'center', // Keep for text alignment
    zIndex: 1001,

    // --- Add these lines for vertical and horizontal centering of content ---
<<<<<<< HEAD
    display: "flex",
    flexDirection: "column",
    justifyContent: "center", // Centers content vertically
    alignItems: "center", // Centers content horizontally
=======
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // Centers content vertically
    alignItems: 'center', // Centers content horizontally
>>>>>>> main
    // -------------------------------------------------------------------
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo oscuro semitransparente
    zIndex: 1000,
  },
};

const getLevelUpMessage = (newLevel) => (
  <>
    <div className="text-2xl font-bold mb-2">Level Up!</div>
    <div className="text-1xl mb-2">
      <span>You've reached level</span>
      <br /> <span className="font-bold text-5xl md:text-6xl">{newLevel}</span>
    </div>
  </>
);

const LevelUpPopup = ({ isOpen, onClose, newLevel }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={levelUpModalStyles}
      contentLabel="Level Up Popup"
    >
      {getLevelUpMessage(newLevel)}
      <div className="">
        <style jsx global>
          {`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }

            @keyframes fadeOut {
              from {
                opacity: 1;
              }
              to {
                opacity: 0;
              }
            }
          `}
        </style>
      </div>
    </Modal>
  );
};

export default LevelUpPopup;
