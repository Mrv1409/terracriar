// types/chatbot.ts - Tipos simplificados para ChatBot TerraCriar

export interface Mensagem {
    id: string;
    conteudo: string;
    tipo: 'usuario' | 'bot';
    timestamp: Date;
  }
  
  export interface RespostaAPI {
    resposta: string;
    sessionId: string;
    timestamp: string;
  }
  
  export interface RequestAPI {
    mensagem: string;
    idioma: 'pt' | 'en' | 'es';
    historico?: Mensagem[];
    sessionId?: string;
  }
  
  export interface EstadoChat {
    aberto: boolean;
    carregando: boolean;
    mensagens: Mensagem[];
    sessionId: string | null;
  }