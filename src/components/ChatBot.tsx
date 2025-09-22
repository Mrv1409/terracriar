'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mensagem, RespostaAPI, RequestAPI, EstadoChat } from '@/types/chatbot';

export const ChatBot = () => {
  const [estado, setEstado] = useState<EstadoChat>({
    aberto: false,
    carregando: false,
    mensagens: [],
    sessionId: null
  });
  const [mensagemAtual, setMensagemAtual] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Detectar idioma do navegador (simples)
  const [idioma, setIdioma] = useState<'pt' | 'en' | 'es'>('pt');

  useEffect(() => {
    const lang = navigator.language.toLowerCase();
    if (lang.includes('en')) setIdioma('en');
    else if (lang.includes('es')) setIdioma('es');
    else setIdioma('pt');
  }, []);

  // Auto scroll para última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [estado.mensagens]);

  // Mensagem de boas-vindas
  useEffect(() => {
    if (estado.aberto && estado.mensagens.length === 0) {
      const boasVindas: Mensagem = {
        id: 'boas-vindas',
        conteudo: idioma === 'pt'
          ? 'Olá! 🌴 Sou assistente da TerraCriar. Como posso ajudar com nossas frutas tropicais premium? 🥭🥥🍈🍇'
          : idioma === 'en'
          ? 'Hello! 🌴 I am TerraCriar assistant. How can I help with our premium tropical fruits? 🥭🥥🍈🍇'
          : '¡Hola! 🌴 Soy asistente de TerraCriar. ¿Cómo puedo ayudar con nuestras frutas tropicales premium? 🥭🥥🍈🍇',
        tipo: 'bot',
        timestamp: new Date()
      };
      setEstado(prev => ({ ...prev, mensagens: [boasVindas] }));
    }
  }, [estado.aberto, idioma, estado.mensagens.length]);

  const enviarMensagem = async () => {
    if (!mensagemAtual.trim() || estado.carregando) return;

    const novaMensagem: Mensagem = {
      id: Date.now().toString(),
      conteudo: mensagemAtual,
      tipo: 'usuario',
      timestamp: new Date()
    };

    setEstado(prev => ({ 
      ...prev, 
      mensagens: [...prev.mensagens, novaMensagem],
      carregando: true 
    }));
    setMensagemAtual('');

    try {
      const request: RequestAPI = {
        mensagem: mensagemAtual,
        idioma,
        historico: estado.mensagens,
        sessionId: estado.sessionId || undefined
      };

      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) throw new Error('Erro na resposta');

      const data: RespostaAPI = await response.json();

      const respostaBot: Mensagem = {
        id: (Date.now() + 1).toString(),
        conteudo: data.resposta,
        tipo: 'bot',
        timestamp: new Date()
      };

      setEstado(prev => ({
        ...prev,
        mensagens: [...prev.mensagens, respostaBot],
        sessionId: data.sessionId,
        carregando: false
      }));
//eslint-disable-next-line
    } catch (error) {
      const erroMsg: Mensagem = {
        id: (Date.now() + 1).toString(),
        conteudo: idioma === 'pt'
          ? 'Desculpe, ocorreu um erro. Tente novamente!'
          : idioma === 'en'
          ? 'Sorry, an error occurred. Please try again!'
          : 'Disculpe, ocurrió un error. ¡Inténtalo de nuevo!',
        tipo: 'bot',
        timestamp: new Date()
      };
      setEstado(prev => ({
        ...prev,
        mensagens: [...prev.mensagens, erroMsg],
        carregando: false
      }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  };

  const toggleChat = () => {
    setEstado(prev => ({ ...prev, aberto: !prev.aberto }));
  };

    return ( 
    <>  
    {/* Botão Flutuante TROPICAL 🌴 */}
    <div className="fixed bottom-6 right-6 z-50">
    <button
     onClick={toggleChat}
     className={`
      relative w-16 h-16 rounded-full shadow-2xl transition-all duration-300 ease-out
      ${estado.aberto 
        ? 'bg-gradient-to-br from-red-500 to-red-600 rotate-45 scale-105' 
        : 'bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 hover:scale-110 hover:shadow-emerald-500/30'
     }
      shadow-lg hover:shadow-2xl
     `}
    >
    {/* Efeito brilho tropical */}
    <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
    
    {estado.aberto ? (
      <svg className="w-8 h-8 text-gray-200 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
           fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ) : (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <span className="text-2xl">🌴</span>
      </div>
    )}
    
    {/* Pulse de notificação tropical */}
     <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse shadow-lg">
      !
     </div>
    </button>
  </div>

  {/* Interface do Chat Tropical */}
  {estado.aberto && (
    <div className="fixed bottom-20 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-emerald-200/50 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
    
      {/* Header Tropical */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 p-4 text-white">
        <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl backdrop-blur-sm">
          🥭
        </div>
        <div>
          <h3 className="font-semibold text-lg">TerraCriar Assistant</h3>
          <p className="text-sm opacity-90">
            {idioma === 'pt' ? 'Frutas Tropicais Online' : 
             idioma === 'en' ? 'Tropical Fruits Online' : 
             'Frutas Tropicales Online'}
          </p>
        </div>
      </div>
    </div>

     {/* Área de Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-slate-50 to-emerald-50/30 space-y-4">
        {estado.mensagens.map((mensagem) => (
         <div
          key={mensagem.id}
          className={`flex ${mensagem.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
         >
          <div
            className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              mensagem.tipo === 'usuario'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-sm shadow-lg shadow-emerald-500/25'
                : 'bg-white text-slate-900 rounded-bl-sm shadow-md border border-slate-100'
            }`}
          >
            {mensagem.conteudo}
          </div>
        </div>
      ))}

      {/* Loading tropical */}
      {estado.carregando && (
         <div className="flex justify-start">
           <div className="bg-white p-3 rounded-2xl rounded-bl-sm shadow-md border border-slate-100">
             <div className="flex space-x-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
             </div>
            </div>
          </div>
        )}
       <div ref={messagesEndRef} />
     </div>

    {/* Input Area */}
    <div className="p-4 border-t border-emerald-100 bg-white">
      <div className="flex gap-2">
        <textarea
          value={mensagemAtual}
          onChange={(e) => setMensagemAtual(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            idioma === 'pt' ? 'Digite sua mensagem...' :
            idioma === 'en' ? 'Type your message...' :
            'Escribe tu mensaje...'
          }
          className="flex-1 resize-none border-2 border-slate-200 rounded-xl p-3 text-sm outline-none max-h-20 font-inherit transition-all duration-200 bg-slate-50 focus:border-emerald-500 focus:shadow-lg focus:shadow-emerald-500/10 focus:bg-white text-slate-800 placeholder-slate-400"
          rows={1}
          disabled={estado.carregando}
         />
          <button
          onClick={enviarMensagem}
          disabled={!mensagemAtual.trim() || estado.carregando}
          className={`p-3 rounded-xl border-none cursor-pointer transition-all duration-200 flex items-center justify-center ${
            !mensagemAtual.trim() || estado.carregando
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/30'
          }`}
          >
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
           </svg>
          </button>
        </div>
      </div>
    </div>
)}
</>
); 
};
