'use client';
     2
     3 import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
     4
     5 // === [ TYPE DEFINITIONS ] ===
     6 type MessageType = 'bot' | 'user';
     7
     8 interface Message {
     9   id: number;
    10   type: MessageType;
    11   content: string;
    12   timestamp: number;
    13   sources?: { uri: string; title: string; }[];
    14 }
    15
    16 interface AgentResponse {
    17     result: {
    18         text: string;
    19         sources?: { uri: string; title: string }[];
    20         sessionId?: string;
    21     };
    22 }
    23
    24 interface CamBotClientProps {
    25   onClose: () => void;
    26 }
    27 // ============================================
    28
    29 const AGENT_WEBHOOK_URL =
       'https://carrisho300.app.n8n.cloud/webhook/8d1daab2-ef15-4d98-ab06-87adb2076633/chat';
    30
    31 const quickActions = [
    32     "¿Cómo reiniciar mi cuenta?",
    33     "¿Dónde está mi pedido?",
    34     "Problemas de pago",
    35     "Cambiar contraseña",
    36     { text: "Generar Guía Paso a Paso ✨", query: "Crea una guía para 'Cómo solucionar problemas de
       conexión de una cámara ServiceCam'" },
    37     "Consultar garantía de producto",
    38     "Verificar estado del servicio"
    39 ];
    40
    41 // --- API Communication ---
    42 const getAgentResponse = async (query: string, sessionId: string | null): Promise<AgentResponse['result']
       | null> => {
    43     const payload: { chatInput: string; sessionId?: string } = { chatInput: query };
    44     if (sessionId) {
    45         payload.sessionId = sessionId;
    46     }
    47
    48     try {
    49         const options: RequestInit = {
    50             method: 'POST',
    51             headers: { 'Content-Type': 'application/json' },
    52             body: JSON.stringify(payload),
    53         };
    54
    55         const response = await fetch(AGENT_WEBHOOK_URL, options);
    56         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    57
    58         const result = await response.json();
    59         const typedResult: AgentResponse[] = result as AgentResponse[];
    60         return typedResult[0]?.result || null;
    61
    62     } catch (error) {
    63         console.error("N8N Agent Fetch Error:", error);
    64         return null;
    65     }
    66 };
    67
    68 // --- The Component ---
    69 const CamBotClient: React.FC<CamBotClientProps> = ({ onClose }) => {
    70   const [messages, setMessages] = useState<Message[]>([
    71     {
    72       id: 1,
    73       type: 'bot',
    74       content: '¡Hola! Soy CamBot, tu asistente IA de ServiceCam. Mi cerebro está conectado a nuestro
       sistema de servicios (Email, Cotizaciones, Agenda). ¿En qué puedo ayudarte hoy? 🤖✨',
    75       timestamp: new Date().getTime()
    76     }
    77   ]);
    78   const [inputValue, setInputValue] = useState<string>('');
    79   const [isTyping, setIsTyping] = useState<boolean>(false);
    80   const [isOnline, setIsOnline] = useState<boolean>(true);
    81   const [isInputVisible, setIsInputVisible] = useState<boolean>(true);
    82   const [sessionId, setSessionId] = useState<string | null>(null);
    83
    84   // Refs
    85   const messagesContainerRef = useRef<HTMLDivElement>(null);
    86   const inputRef = useRef<HTMLInputElement>(null);
    87   const quickActionsRef = useRef<HTMLDivElement>(null);
    88   const sentinelRef = useRef<HTMLDivElement>(null);
    89   const inputAreaRef = useRef<HTMLDivElement>(null);
    90
    91   // --- Effects ---
    92
    93   // Auto-scroll to bottom when new messages appear
    94   useEffect(() => {
    95     const container = messagesContainerRef.current;
    96     if (container) {
    97         container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    98     }
    99   }, [messages]);
   100
   101   // Horizontal scroll on wheel for quick actions
   102   useEffect(() => {
   103     const element = quickActionsRef.current;
   104     if (!element) return;
   105     const onWheel = (e: WheelEvent) => {
   106       if (e.deltaY === 0) return;
   107       e.preventDefault();
   108       element.scrollTo({ left: element.scrollLeft + e.deltaY, behavior: 'auto' });
   109     };
   110     element.addEventListener('wheel', onWheel);
   111     return () => element.removeEventListener('wheel', onWheel);
   112   }, []);
   113
   114   // Intersection Observer for auto-hiding input
   115   useEffect(() => {
   116     const observer = new IntersectionObserver(
   117       ([entry]) => {
   118         const target = inputAreaRef.current;
   119         if (!target) return;
   120         if (entry.isIntersecting) {
   121           target.classList.remove('translate-y-full', 'opacity-0', 'pointer-events-none');
   122           setIsInputVisible(true);
   123         } else {
   124           target.classList.add('translate-y-full', 'opacity-0', 'pointer-events-none');
   125           setIsInputVisible(false);
   126         }
   127       },
   128       { root: messagesContainerRef.current, threshold: 1.0 }
   129     );
   130     const sentinel = sentinelRef.current;
   131     if (sentinel) observer.observe(sentinel);
   132     return () => { if (sentinel) observer.unobserve(sentinel) };
   133   }, [messages]);
   134
   135   // --- Logic ---
   136
   137   const handleSendMessage = async () => {
   138     const content = inputValue.trim();
   139     if (!content || isTyping || !isOnline) return;
   140
   141     const userMessage: Message = { id: Date.now(), type: 'user', content, timestamp: new Date().getTime()
       };
   142     setMessages(prev => [...prev, userMessage]);
   143     setInputValue('');
   144     setIsTyping(true);
   145
   146     const agentResult = await getAgentResponse(content, sessionId);
   147
   148     setIsTyping(false);
   149
   150     if (agentResult) {
   151         if (agentResult.sessionId && !sessionId) {
   152             setSessionId(agentResult.sessionId);
   153         }
   154         const botMessage: Message = {
   155             id: Date.now() + 1,
   156             type: 'bot',
   157             content: agentResult.text.trim(),
   158             timestamp: new Date().getTime(),
   159             sources: agentResult.sources || []
   160         };
   161         setMessages(prev => [...prev, botMessage]);
   162     } else {
   163         const errorBotMessage: Message = {
   164             id: Date.now() + 1,
   165             type: 'bot',
   166             content: "Hubo un error de conexión con el agente avanzado (n8n). El sistema de correos,
       cotizaciones y agenda no está disponible temporalmente.",
   167             timestamp: new Date().getTime(),
   168         };
   169         setMessages(prev => [...prev, errorBotMessage]);
   170     }
   171   };
   172
   173   const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
   174     if (e.key === 'Enter' && !e.shiftKey) {
   175       e.preventDefault();
   176       handleSendMessage();
   177     }
   178   };
   179
   180   const handleQuickAction = (action: string | { text: string, query: string }) => {
   181     const query = typeof action === 'string' ? action : action.query;
   182     setInputValue(query);
   183     inputRef.current?.focus();
   184   };
   185
   186   // --- Render ---
   187
   188   const renderMessages = () => messages.map((message) => (
   189     <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`
       }>
   190         <div className={`max-w-[80%] lg:max-w-[70%] flex flex-col ${message.type === 'user' ? 'items-end'
       : 'items-start'}`}>
   191             <div className={`flex items-center mb-1 ${message.type === 'user' ? 'flex-row-reverse' : ''}`
       }>
   192                 <div className={`avatar-circle small ${message.type === 'user' ? 'bg-gradient-to-r
       from-green-400 to-teal-500' : 'bg-gradient-to-r from-purple-500 to-blue-500'} ${message.type === 'user' ?
       'ml-2' : 'mr-2'}`}>
   193                     <span className="text-white text-sm">{message.type === 'user' ? '👤' : '🤖'}</span>
   194                 </div>
   195                 <span className="text-xs text-gray-400">{new Date(message.timestamp).toLocaleTimeString(
       'es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
   196             </div>
   197             <div className={`px-4 py-3 rounded-2xl shadow-sm ${message.type === 'user' ?
       'bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-br-none' : 'bg-gray-800 text-white
       rounded-bl-none border border-purple-500/20'}`}>
   198                 <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: message.content
       .replace(/\n/g, '<br>') }}></p>
   199                 {message.sources && message.sources.length > 0 && (
   200                     <div className="mt-2 pt-2 border-t border-gray-700">
   201                         <strong className="text-xs text-gray-400">Fuentes:</strong>
   202                         {message.sources.slice(0, 3).map((s, index) => (
   203                             <a key={index} href={s.uri} target="_blank" rel="noopener noreferrer"
       className="text-purple-400 hover:text-purple-300 block text-xs" title={s.title}>[{index + 1}] {s.title
       }</a>
   204                         ))}
   205                     </div>
   206                 )}
   207             </div>
   208         </div>
   209     </div>
   210   ));
   211
   212   const renderTypingIndicator = () => isTyping && (
   213     <div className="flex justify-start">
   214         <div className="flex flex-col items-start">
   215             <div className="flex items-center mb-1">
   216                 <div className="avatar-circle small bg-gradient-to-r from-purple-500 to-blue-500"><span
       className="text-white text-sm">🤖</span></div>
   217                 <span className="text-xs text-gray-400 ml-2">{new Date(Date.now()).toLocaleTimeString(
       'es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
   218             </div>
   219             <div className="bg-gray-800 text-white px-4 py-3 rounded-2xl border border-purple-500/20
       rounded-bl-none shadow-sm">
   220                 <div className="flex space-x-1">
   221                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-custom" />
   222                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-custom" style={{
       animationDelay: '0.1s' }} />
   223                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-custom" style={{
       animationDelay: '0.2s' }} />
   224                 </div>
   225             </div>
   226         </div>
   227     </div>
   228   );
   229
   230   return (
   231     <div id="chatbot-container" className="fixed bottom-5 right-5 w-[400px] h-[600px] max-w-[95vw]
       z-[1000] cursor-default bg-gradient-to-br from-gray-900 to-black rounded-xl shadow-2xl flex flex-col
       overflow-hidden" style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 100px rgba(168, 85, 247, 0.4)'
       }}>
   232         <div id="chatbot-header-drag" className="bg-gray-800 border-b border-purple-500/20 px-6 py-4
       shadow-lg flex-shrink-0">
   233             <div className="flex items-center justify-between">
   234                 <div className="flex items-center space-x-3">
   235                     <div className="avatar-circle bg-gradient-to-r from-purple-500 to-blue-500"><span
       className="text-xl">🤖</span></div>
   236                     <div>
   237                         <h1 className="text-lg font-bold text-white">CamBot | ServiceCam</h1>
   238                         <div className="flex items-center space-x-1">
   239                             <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' :
       'bg-gray-400'}`}></div>
   240                             <span className="text-sm text-gray-300">{isOnline ? 'En línea' : 'Fuera de
       línea'}</span>
   241                         </div>
   242                     </div>
   243                 </div>
   244                 <div className="flex items-center">
   245                     <button onClick={onClose} className="p-2 rounded-full bg-gradient-to-r
       from-purple-600 to-blue-600 text-white transform transition-transform hover:scale-110 focus:outline-none
       focus:ring-2 focus:ring-purple-400/50" aria-label="Cerrar chat">
   246                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
       xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d=
       "M19 9l-7 7-7-7"></path></svg>
   247                     </button>
   248                 </div>
   249             </div>
   250         </div>
   251         <div ref={messagesContainerRef} id="messages-container" className={`flex-1 overflow-y-auto px-6
       py-6 space-y-4 flex flex-col transition-all duration-300 ${isInputVisible ? 'pb-40' : 'pb-4'}`}>
   252             {renderMessages()}
   253             {renderTypingIndicator()}
   254             <div ref={sentinelRef} style={{ height: '1px' }} />
   255         </div>
   256         <div ref={inputAreaRef} id="input-area-footer" className="transition-transform duration-300
       ease-in-out absolute bottom-0 left-0 right-0 z-10 border-t border-purple-500/20 bg-gray-800 p-4 pt-4
       pb-2">
   257             <div className="flex items-center space-x-3">
   258                 <div className="flex-1 relative">
   259                     <input ref={inputRef} type="text" value={inputValue} onChange={(e: ChangeEvent<
       HTMLInputElement>) => setInputValue(e.target.value)} onKeyPress={handleKeyPress} placeholder="Escribe tu
       mensaje..." className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-full
       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition-all
       duration-200 text-sm text-white placeholder-gray-400" disabled={!isOnline || isTyping} />
   260                     {!isOnline && (
   261                         <div id="offline-indicator" className="absolute inset-y-0 right-3 flex
       items-center text-red-400 text-xs">
   262                             <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0
       24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth=
       "2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
   263                             Fuera de línea
   264                         </div>
   265                     )}
   266                 </div>
   267                 <button onClick={() => handleSendMessage()} disabled={!inputValue.trim() || !isOnline ||
       isTyping} className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg
       transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
       disabled:transform-none">
   268                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns=
       "http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12
       19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
   269                 </button>
   270             </div>
   271             <div ref={quickActionsRef} id="quick-actions-scroll" className="mt-3 overflow-x-auto">
   272                 <div id="quick-actions-container" className="flex flex-row flex-nowrap gap-2 pb-2">
   273                     {quickActions.map((action, index) => {
   274                         const text = typeof action === 'string' ? action : action.text;
   275                         return (<button key={index} onClick={() => handleQuickAction(action)}
       className="flex-shrink-0 px-3 py-1 text-xs bg-gray-700 text-white rounded-full hover:bg-gray-600
       transition-colors duration-200 border border-purple-500/30">{text}</button>);
   276                     })}
   277                 </div>
   278             </div>
   279             <div className="text-center text-xs text-gray-400 py-2 border-t border-purple-500/20
       flex-shrink-0 mt-2">
   280                 <p>CamBot 2025 | IA Avanzada con Comprensión Contextual | Protección de Privacidad Total
       </p>
   281             </div>
   282         </div>
   283     </div>
   284   );
   285 };
   286
   287 export default CamBotClient;