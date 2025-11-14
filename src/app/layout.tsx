'use client'; // Convertir a Client Component para poder usar estado

import './globals.css';
import { useState } from 'react';
import { usePathname } from 'next/navigation'; // Importar el hook
import Navbar from '../components/Navbar';
import ChatLauncher from '@/components/chat/ChatLauncher';
import CamBotClient from '@/components/chat/CamBotClient';

// Metadata ya no se puede exportar directamente desde un Client Component.
// export const metadata = { ... }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const pathname = usePathname(); // Obtener la ruta actual

  // Determinar si debemos mostrar el chat
  const showChat = !pathname.startsWith('/maintenance');

  return (
    <html lang="en">
      <body className="bg-gray-900">
        <Navbar />
        {children}

        {/* --- Integración del ChatBot (Ahora Condicional) --- */}
        
        {showChat && (
          <>
            {/* 1. El botón lanzador solo abre y se oculta cuando el chat está abierto */}
            {!isChatOpen && <ChatLauncher onOpen={() => setIsChatOpen(true)} />}

            {/* 2. El panel del chat se renderiza condicionalmente y recibe la función de cierre */}
            {isChatOpen && (
              <div className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm animate-fade-in">
                <CamBotClient onClose={() => setIsChatOpen(false)} />
              </div>
            )}
          </>
        )}
        {/* ---------------------------------------------------- */}
      </body>
    </html>
  )
}