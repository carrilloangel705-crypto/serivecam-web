'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Link from 'next/link';
import SplitText from '@/components/ui/SplitText';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Inicio', href: '/' },
    { name: 'Servicios', href: '/servicios' },
    { name: 'Precios', href: '/precios' },
    { name: 'Contacto', href: '/contacto' },
  ];

  const menuVariants: Variants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: 'tween', duration: 0.3, ease: 'easeOut' } 
    },
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-gray-900 border-b border-gray-700">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link href="/" passHref legacyBehavior>
                <SplitText
                  text="ServiceCam" /* NOMBRE CORREGIDO */
                  tag="span"
                  splitType="chars"
                  delay={40}
                  duration={0.6}
                  from={{ opacity: 0, y: 15 }} /* Comienza 15px abajo */
                  to={{ opacity: 1, y: 0 }} /* Termina en posición normal */
                  threshold={0} /* Fuerza la animación inmediata (sin scroll) */
                  rootMargin="0px"
                  className="text-white text-3xl font-extrabold tracking-normal cursor-pointer"
                />
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {links.map((link) => (
                  <Link key={link.name} href={link.href} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    {link.name}
                  </Link>
                ))}
                {/* Avatar del Agente IA en la Navbar */}
                <div className="avatar-circle small bg-gradient-to-r from-purple-500 to-blue-500 ml-4">
                    <span className="text-white text-sm">🤖</span>
                </div>
              </div>
            </div>

            <div className="-mr-2 flex md:hidden">
              <button
                onClick={toggleMenu}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden fixed top-0 right-0 w-full max-w-xs h-screen bg-gray-900 z-40"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
          >
            <div className="pt-20 px-2 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={toggleMenu} // Close menu on link click
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;