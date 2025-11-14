import React, { useState } from 'react';
import { useRouter } from 'next/router';

const CamBotClient = () => {
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // La función de envío corregida y lista para usar el API Proxy local
  async function handleMessage(e: React.FormEvent) {
    e.preventDefault();
    if (userMessage.trim() === '' || isLoading) return;

    const newMessage = { text: userMessage, sender: 'user', time: new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'}) };
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_input: userMessage }),
      });

      if (!response.ok) {
        // Esto captura errores HTTP de nuestro API Proxy (que ya tiene manejo de errores)
        const errorData = await response.json();
        console.error('Error al llamar al API Proxy:', errorData);
        // Agrega un mensaje de error al chat
        setMessages(prev => [...prev, { text: 'Hubo un error de conexión con el agente avanzado (n8n). El sistema de correos, cotizaciones y agenda no está disponible temporalmente.', sender: 'bot', time: new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'}) }]);
      } else {
        // Respuesta OK del API Proxy (y por ende, de n8n)
        const botResponseData = await response.json();
        // Asumiendo que n8n devuelve el texto en una clave llamada 'response'
        const botMessage = { text: botResponseData.response || JSON.stringify(botResponseData), sender: 'bot', time: new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'}) };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error FATAL en el cliente:', error); // Esto ocurre si hay un error de red en el navegador, no debe pasar ahora.
    } finally {
      setUserMessage('');
      setIsLoading(false);
    }
  }

  // Renderizado del componente (Solo muestro la parte del formulario para el ejemplo)
  return (
    <div>
      {messages.map((msg, index) => (<div key={index}>{msg.sender}: {msg.text}</div>))}
      <form onSubmit={handleMessage}>
        <input
          type='text'
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          disabled={isLoading}
          placeholder='Escribe tu mensaje...'
        />
        <button type='submit' disabled={isLoading}>{isLoading ? 'Enviando...' : 'Enviar'}</button>
      </form>
    </div>
  );
};

export default CamBotClient;
