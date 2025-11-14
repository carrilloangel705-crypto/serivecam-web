import Link from 'next/link';
import React from 'react';

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-center text-white p-4">
      <h1 className="text-5xl md:text-7xl font-bold mb-4">Serivecam en Mantenimiento</h1>
      <p className="text-xl md:text-2xl mb-8">Estamos mejorando tu seguridad. Vuelve pronto.</p>

      {/* Botón de Acceso Administrativo - APUNTA A LA NUEVA RUTA */}
      <Link href="/maintenance/login" legacyBehavior passHref>
        <a className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 mt-4">
          Acceso Administrativo
        </a>
      </Link>
    </div>
  );
};

export default Maintenance;