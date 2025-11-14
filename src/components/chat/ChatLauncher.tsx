'use client';

import React from 'react';

interface ChatLauncherProps {
  onOpen: () => void;
}

const ChatLauncher: React.FC<ChatLauncherProps> = ({ onOpen }) => {
  return (
    <button
      onClick={onOpen}
      className="fixed bottom-5 right-5 w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center z-[999] transform transition-transform duration-300 hover:scale-110 hover:shadow-purple-400/30 focus:outline-none focus:ring-4 focus:ring-purple-400/50"
      aria-label="Abrir chat de asistente IA"
    >
      {/* Icono de Chat (SVG en línea) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    </button>
  );
};

export default ChatLauncher;
