// src/app/page.tsx - Versión Dinámica

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar'; 
import { MaintenanceToggle } from '@/components/maintenance/MaintenanceToggle';
import { getMaintenanceStatus } from '@/lib/actions'; // <-- IMPORTANTE: Nueva importación

// Variables constantes
const MAINTENANCE_ROUTE = '/maintenance';
const ADMIN_COOKIE_NAME = 'admin-session';

export default async function HomePage() { // <-- IMPORTANTE: La función ahora es async
  // 1. LECTURA DE ESTADO Y COOKIE
  const isMaintenanceMode = await getMaintenanceStatus(); // <-- IMPORTANTE: Lectura dinámica
  const isAdminAuthenticated = cookies().get(ADMIN_COOKIE_NAME)?.value === 'authenticated';

  // 2. LÓGICA DE REDIRECCIÓN (BLOQUEO)
  // Si el modo mantenimiento está activo Y NO es administrador, redirigir.
  if (isMaintenanceMode && !isAdminAuthenticated) {
    redirect(MAINTENANCE_ROUTE);
  }

  // 3. RENDERIZADO NORMAL
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      
      {/* 💥 TOGGLE DE MANTENIMIENTO: Visible solo si el administrador está logueado */}
      {isAdminAuthenticated && (
        <div className="fixed bottom-4 left-4 z-[99]">
          <MaintenanceToggle initialStatus={isMaintenanceMode} />
        </div>
      )}
      
      <Navbar /> 
      <div className="flex flex-col items-center justify-center min-h-[90vh] text-center">
        <h1 className="text-6xl font-extrabold mb-4">Protege tu futuro con Serivecam</h1>
        <p className="text-xl text-gray-400 mb-8">Tecnología 4K y Monitoreo 24/7 para tu tranquilidad.</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-200">
          Solicitar Presupuesto
        </button>
      </div>
    </main>
  );
}