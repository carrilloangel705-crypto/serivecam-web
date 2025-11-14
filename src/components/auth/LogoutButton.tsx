// src/components/auth/LogoutButton.tsx
'use client';

export function LogoutButton() {
  const handleLogout = async () => {
    const response = await fetch('/api/logout', { method: 'POST' });
    if (response.ok) {
      window.location.reload(); // Recargar la página para aplicar el cambio de sesión
    }
  };

  return (
    <div className="mt-2">
      <button 
        onClick={handleLogout}
        className="text-sm font-medium text-red-400 hover:text-red-500 transition-colors"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}