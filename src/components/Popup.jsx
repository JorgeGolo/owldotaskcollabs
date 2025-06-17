import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { FaFeather } from 'react-icons/fa';

Modal.setAppElement('#__next'); // o el ID que tenga tu elemento raíz

// Estilos del modal
const modalStyles = {
  content: {
    position: 'fixed',
    top: 'auto',
    right: 0,
    transform: 'translateY(-50%)',
    left: 'auto',
    width: '300px',
    height: 'auto',
    margin: 0,
    padding: '20px',
    borderRadius: '10px 0 0 10px',
    boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
    animation:
      'slideInFromRight 0.5s ease-out, fadeOut 0.5s ease-in 1.5s forwards',
    backgroundColor: '#dcfce7',
  },
  overlay: {
    backgroundColor: 'transparent',
  },
};

const getMessage = (goal, score) => {
  switch (goal) {
    case 'completion':
      return (
        <>
          <div className="text-1xl mb-2">
            <span>You've won </span>
            <span className="font-bold font-bebas inline-flex items-center">
              {score} <FaFeather className="w-4 h-4 text-yellow-500 ml-1" />
            </span>
            <span> feathers</span>
          </div>
        </>
      );
    case 'perfectScore':
      return (
        <>
          <div className="text-1xl mb-2">
            <span>Perfect score, </span>
            <span className="font-bold font-bebas inline-flex items-center">
              + 5 <FaFeather className="w-4 h-4 text-yellow-500 ml-1" />
            </span>
            <span> feathers</span>
          </div>
        </>
      );
    case 'gameCompleted':
      return (
        <>
          <div className="text-1xl mb-2">
            <span>Game Completed, </span>
            <span className="font-bold font-bebas inline-flex items-center">
              +{score} <FaFeather className="w-4 h-4 text-yellow-500 ml-1" />
            </span>
            <span> feathers</span>
          </div>
        </>
      );
    case 'bonus':
      return (
        <>
          <div className="text-1xl mb-2">
            <span>You've won </span>
            <span className="font-bold font-bebas inline-flex items-center">
              {score} <FaFeather className="w-4 h-4 text-yellow-500 ml-1" />
            </span>
            <span> feathers</span>
          </div>
        </>
      );
    default:
      return (
        <>
          <div className="text-1xl mb-2">
            <span>You've won </span>
            <span className="font-bold font-bebas inline-flex items-center">
              {score} <FaFeather className="w-4 h-4 text-yellow-500 ml-1" />
            </span>
            <span> feathers</span>
          </div>
        </>
      );
  }
};

const Popup = ({ isOpen, onClose, score, goal }) => {
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
      style={modalStyles}
      contentLabel="Test results"
    >
      <div className="text-1xl mb-2">
        <span>{getMessage(goal, score)}</span>
      </div>
      <div className="progress-bar-container">
        <div className="progress-bar"></div>
        {/* Estilos de animación */}
        <style jsx global>{`
          @keyframes slideInFromRight {
            from {
              transform: translateX(100%) translateY(-50%); /* Mantener el centrado vertical */
              opacity: 0;
            }
            to {
              transform: translateX(0) translateY(-50%); /* Mantener el centrado vertical */
              opacity: 1;
            }
          }

          @keyframes fadeOut {
            from {
              transform: translateX(0) translateY(-50%); /* Mantener el centrado vertical */
              opacity: 1;
            }
            to {
              transform: translateX(0%) translateY(100%); /* Mantener el centrado vertical */
              opacity: 0;
            }
          }
          @keyframes fillProgress {
            0% {
              width: 0%;
            }
            100% {
              width: 100%;
            }
          }
          .progress-bar-container {
            width: 100%;
            height: 10px;
            background-color: #e0e0e0;
            border-radius: 5px;
            overflow: hidden;
            margin-top: 20px;
          }
          .progress-bar {
            height: 100%;
            background-color: #14b8a6;
            width: 0%;
            animation: fillProgress 2s ease-in-out forwards;
          }
        `}</style>
      </div>
    </Modal>
  );
};

export default Popup;
