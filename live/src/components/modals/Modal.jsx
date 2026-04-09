import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { createPortal } from 'react-dom';

const Modal = ({
  isOpen,
  onClose,
  children,
  closeOnOverlayClick = true,
  showCloseButton = true,
  maxWidth = 'max-w-md', 
  overlayClass = 'bg-black/50',
  modalClass = '',
  titleClass = '',
  closeButtonClass = '',
}) => {
  const modalRef = useRef(null);

  // Close modal on ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Handle outside click
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === modalRef.current) {
      onClose();
    }
  };

return createPortal(
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 ${overlayClass}`}
        onClick={handleOverlayClick}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative w-full ${maxWidth} rounded-xl bg-white shadow-xl ${modalClass}`}
        >
          {/* Content */}
          <div className="lg:p-10 p-5 my-8 overflow-y-auto lg:max-h-[600px] max-h-[calc(100vh-200px)]">
            {children}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>,
  document.body // Mount outside of RootLayout
);

};

export default Modal;