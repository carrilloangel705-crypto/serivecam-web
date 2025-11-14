'use client';
import { motion } from 'framer-motion'; 

// Este componente envuelve el contenido que necesita interactividad del cliente (ej. Framer Motion)
export function ClientWrapper({ children }) {
  return (
    <motion.div>
      {children}
    </motion.div>
  );
}