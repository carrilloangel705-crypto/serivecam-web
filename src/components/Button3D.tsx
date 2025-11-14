'use client';

import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

/**
 * Componente de Botón con Micro-Interacción 3D utilizando Framer Motion.
 */
export function Button3D({ children, className = '', ...props }) {
  const baseClasses = "relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-indigo-500 to-pink-500 group-hover:from-indigo-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-indigo-200 dark:focus:ring-indigo-800";
  
  const spanClasses = "relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      // Simula un sutil levantamiento 3D al hacer hover
      initial={{ y: 0, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
      animate={{ 
        boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
        transition: { duration: 0.3 }
      }}
      className={twMerge(baseClasses, className)}
      {...props}
    >
      <motion.span 
        className={spanClasses}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
}