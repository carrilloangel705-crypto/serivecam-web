'use client';

import { useFormState, useFormStatus } from 'react-dom';
import styled from 'styled-components';
import { authenticateAdmin } from '@/lib/actions'; 
import React, { useRef, useEffect } from 'react';

// ----------------------------------------------------------------------
// ESTILOS NEUMORPHISM OSCURO
const StyledWrapper = styled.div`
  .form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-left: 2em;
    padding-right: 2em;
    padding-bottom: 0.4em;
    background-color: #171717;
    border-radius: 25px;
    transition: 0.4s ease-in-out;
  }

  .card {
    background-image: linear-gradient(163deg, #00ff75 0%, #3700ff 100%);
    border-radius: 22px;
    transition: all 0.3s;
  }

  .card2 {
    border-radius: 0;
    transition: all 0.2s;
  }

  .card2:hover {
    transform: scale(0.98);
    border-radius: 20px;
  }

  .card:hover {
    box-shadow: 0px 0px 30px 1px rgba(0, 255, 117, 0.3);
  }

  #heading {
    text-align: center;
    margin: 2em;
    color: rgb(255, 255, 255);
    font-size: 1.2em;
  }

  .field {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    border-radius: 25px;
    padding: 0.6em;
    border: none;
    outline: none;
    color: white;
    background-color: #171717;
    box-shadow: inset 2px 5px 10px rgb(5, 5, 5);
  }

  .input-icon {
    height: 1.3em;
    width: 1.3em;
    fill: white;
  }

  .input-field {
    background: none;
    border: none;
    outline: none;
    width: 100%;
    color: #d3d3d3;
  }

  .form .btn {
    display: flex;
    justify-content: center;
    flex-direction: row;
    margin-top: 2.5em;
  }

  .button1 {
    padding: 0.5em;
    padding-left: 1.1em;
    padding-right: 1.1em;
    border-radius: 5px;
    margin-right: 0.5em;
    border: none;
    outline: none;
    transition: 0.4s ease-in-out;
    background-color: #252525;
    color: white;
  }

  .button1:hover {
    background-color: black;
    color: white;
  }
  
  /* Mantendremos solo el botón de Login (Admin) y eliminamos Sign Up/Forgot Password por seguridad */
  .button2, .button3 { display: none; } 
`;
// ----------------------------------------------------------------------

// Componente para manejar el estado del botón (cargando)
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="button1" disabled={pending}>
      {pending ? 'Accediendo...' : 'Login'}
    </button>
  );
}

// Componente Principal de Login
export function MaintenanceLoginForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(authenticateAdmin, {
    success: false,
    message: '',
  });

  useEffect(() => {
    if (!state.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <StyledWrapper>
      <div className="card">
        <div className="card2">
          {/* El formulario ejecuta la Server Action */}
          <form ref={formRef} className="form" action={formAction}>
            <p id="heading">Acceso Admin</p>
            
            {/* Campo Usuario */}
            <div className="field">
              <svg viewBox="0 0 16 16" fill="currentColor" height={16} width={16} xmlns="http://www.w3.org/2000/svg" className="input-icon">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.827-1.332C12.39 9.823 10.415 9 8 9c-2.414 0-4.39.823-5.172 1.664-.673.346-.825 1.086-.827 1.332V14h10z" />
              </svg>
              <input name="username" type="text" className="input-field" placeholder="Usuario" autoComplete="off" />
            </div>
            
            {/* Campo Contraseña */}
            <div className="field">
              <svg viewBox="0 0 16 16" fill="currentColor" height={16} width={16} xmlns="http://www.w3.org/2000/svg" className="input-icon">
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
              </svg>
              <input name="password" type="password" className="input-field" placeholder="Contraseña" />
            </div>
            
            <div className="btn">
              {/* Botón de Login (sustituye a button1) */}
              <SubmitButton />
              {/* Botones innecesarios eliminados por seguridad */}
            </div>

            {/* Mensajes de Error/Éxito */}
            {state.message && (
              <p className={`text-center font-bold text-sm mt-3 ${state.success ? 'text-green-500' : 'text-red-500'}`}>
                {state.message}
              </p>
            )}
            
          </form>
        </div>
      </div>
    </StyledWrapper>
  );
}