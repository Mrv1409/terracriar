// Idiomas disponíveis
export type Idioma = 'pt' | 'en' | 'es';

// Props para componentes com idioma
export interface PropsComIdioma {
  idioma: Idioma;
}

// Dados do formulário de contato
export interface FormularioContato {
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  produto: string;
  mensagem: string;
}

// Estados do formulário
export interface EstadoFormulario {
  enviando: boolean;
  sucesso: boolean;
  erro: boolean;
}

// Produtos disponíveis
export type Produto = 'uva' | 'manga' | 'melao' | 'coco';

// Props para seletor de idioma
export interface SeletorIdiomaProps {
  idioma: Idioma;
  aoMudar: (novoIdioma: Idioma) => void;
}

// Props para o chatbot
export interface ChatbotProps {
  aberto: boolean;
  aoFechar: () => void;
  idioma: Idioma;
}

// Mensagem do chat
export interface MensagemChat {
  id: string;
  texto: string;
  usuario: boolean;
  timestamp: Date;
}

// Props para cards de produtos
export interface CardProdutoProps {
  produto: Produto;
  idioma: Idioma;
}

// Dados de certificação
export interface Certificacao {
  nome: string;
  descricao: string;
  icone?: string;
}

// Props para seção de diferenciais
export interface DiferencialProps {
  titulo: string;
  descricao: string;
  icone?: string;
}