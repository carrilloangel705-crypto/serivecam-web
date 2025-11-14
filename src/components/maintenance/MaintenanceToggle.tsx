'use client';

import { useState, useTransition } from 'react';
import styled from 'styled-components'; // Necesario para los estilos complejos
import { toggleMaintenanceMode } from '@/lib/actions';
import { LogoutButton } from '@/components/auth/LogoutButton';

// ----------------------------------------------------------------------
// ESTILOS 3D (Versión funcional con la rotación y profundidad deseada)
const StyledWrapper = styled.div`
  .custom-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    perspective-origin: calc(50% + 10rem) calc(50% - 10rem);
    perspective: 32em;
    transform: scale(0.4); 
    margin: -4rem; 
  }

  [type="checkbox"] {
    position: absolute;
    left: -1440px;
  }

  [type="checkbox"] + label {
    --s: 0;
    position: relative;
    border: solid 0.625rem #222;
    width: 176px;
    height: 100px;
    border-radius: 5rem;
    transform-style: preserve-3d;
    /* ROTACIÓN ORIGINAL QUE DA LA PROFUNDIDAD DESEADA (ORIGINAL) */
    transform: rotatex(90deg) rotate(22.5deg) rotatey(22.5deg); 
    box-shadow: 
      0.5rem 0.875rem 0 -0.25rem #00c768, 
      0.625rem 0.625rem 0 -0.25rem #5ad183,
      0.5rem 0.875rem 0.625rem -0.125rem rgba(0, 255, 100, 0.75), 
      inset 0.125rem -0.125rem 0.5rem rgba(255, 255, 255, 0.2), 
      inset 0.75rem 0.75rem #007034,
      inset 0.75rem 0.75rem 0.75rem rgba(0, 150, 70, 0.85),
      inset 0 1rem 0.75rem rgba(93, 201, 93, 0.65);
    color: transparent;
    font-size: 0;
    cursor: pointer;
  }
  
  [type="checkbox"] + label:before,
  [type="checkbox"] + label:after {
    position: absolute;
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    transition: 2s cubic-bezier(0.21, 0.61, 0.35, 1);
    content: "";
  }

  [type="checkbox"] + label:before {
    top: calc(50% + 0.875rem);
    transform-origin: 100% 0;
    transform: translate(calc(var(--s) * (100% + 1rem))) scale(0.8) skewx(-22.5deg);
    background: radial-gradient(at 50% 25%, rgba(160, 160, 160, 0.65), transparent 70%);
    filter: blur(3px);
  }

  [type="checkbox"] + label:after {
    /* Posición original (ligeramente descentrada) */
    top: 0.875rem;
    left: 0.75rem;
    /* ROTACIÓN QUE DA LA PROFUNDIDAD DESEADA (ORIGINAL) */
    transform: translate(calc(var(--s) * (100% + 1rem))) rotatey(-22.5deg) rotate(-22.5deg) rotatex(-90deg) translatey(-50%) rotate(45deg);
    box-shadow: -1px 1px 0.125rem rgba(206, 255, 206, 0.5);
    background:
      radial-gradient(at 0 50%, #52a066, transparent 2.5rem) 0 50% / 65% 50% no-repeat,
      radial-gradient(at 50% 0%, #dcdcdc 15%, #b9b9b9 35%, #9e9e9e, #808080 65%) 50% / 200%;
    filter: grayscale(calc(1 - var(--s)));
  }

  [type="checkbox"]:checked + label {
    --s: 1;
  }
`;
// ----------------------------------------------------------------------

export function MaintenanceToggle({ initialStatus }) {
  const [isPending, startTransition] = useTransition();
  const [isOn, setIsOn] = useState(initialStatus);
  const [message, setMessage] = useState('');

  const handleToggle = () => {
    const newStatus = !isOn;
    
    startTransition(async () => {
      setIsOn(newStatus); // Actualización optimista de la UI
      const result = await toggleMaintenanceMode(newStatus);
      
      if (result.success) {
        setMessage(result.message);
      } else {
        setIsOn(!newStatus); // Revertir en caso de fallo
        setMessage(result.message || 'Error al actualizar.');
      }
    });
  };

  return (
    <StyledWrapper>
        <div className="p-3 bg-gray-800 shadow-2xl rounded-xl border border-gray-700 text-white flex flex-col items-center">
            
            <div className="flex items-center justify-between w-full">
                <h3 className="text-sm font-bold text-gray-200 mr-4">Admin Mode</h3>
                
                <div className="custom-toggle">
                    <input 
                        type="checkbox" 
                        id="c3d" 
                        checked={isOn}
                        onChange={handleToggle}
                        disabled={isPending}
                    />
                    <label htmlFor="c3d" />
                </div>
            </div>

            <p className="mt-2 text-xs text-gray-400 w-full">
                Estado: <span className={`font-semibold ${isOn ? 'text-green-400' : 'text-red-400'}`}>
                    {isOn ? 'ACTIVO' : 'INACTIVO'}
                </span>
            </p>

            <LogoutButton /> 

            {/* Área de mensajes dinámica y simplificada */}
            {message && (
              <div className="mt-3 p-2 text-center w-full bg-gray-700 border border-gray-600 text-gray-300 rounded-lg">
                <p className="text-sm">{message}</p>
              </div>
            )}
        </div>
    </StyledWrapper>
  );
}