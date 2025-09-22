import { NextRequest, NextResponse } from 'next/server';//eslint-disable-next-line
import { collection, doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// eslint-disable-next-line
const informacoesEmpresa = {
  nome: "TerraCriar",
  slogan: "Exportação Premium de Frutas Tropicais",
  experiencia: "Mais de 10 anos",
  localizacao: "Vale do São Francisco, Pernambuco - Brasil",
  mercados: "Europa (Espanha, França, Alemanha, Holanda, Itália)",
  certificacoes: ["GlobalGAP", "BRC", "HACCP", "Orgânico", "Comércio Justo", "ISO 22000"],
  porto_origem: "Porto de Fortaleza - CE",
  porto_destino: "Vigo - Espanha",
  transit_time: "8 dias",
  contato: {
    telefone: "+55 87 9999-9999",
    email: "contato@terracriar.com.br",
    whatsapp: "+55 87 99999-9999"
  }
};
//eslint-disable-next-line
const produtos = {
  manga: {
    nome: "Manga",
    variedades: ["Tommy Atkins", "Haden", "Kent", "Keitt"],
    safra: "Setembro a Janeiro",
    container_40: {
      paletes: 22,
      caixas_por_palete: 252,
      peso_caixa: "4,2kg",
      calibres: "6 ao 14",
      total_caixas: 5544
    }
  },
  melao: {
    nome: "Melão Amarelo",
    variedades: ["Amarelo", "Cantaloupe", "Galia"],
    safra: "Todo o ano",
    container_40: {
      paletes: 21,
      caixas_por_palete: 91,
      peso_caixa: "10kg (média)",
      calibres: "6 ao 10",
      total_caixas: 1911
    }
  },
  coco: {
    nome: "Coco Verde",
    variedades: ["Coco Verde", "Água de Coco Natural"],
    safra: "Todo o ano",
    container_40: {
      paletes: 21,
      caixas_por_palete: 91,
      peso_caixa: "12kg (média)",
      calibres: "6",
      total_caixas: 1911
    }
  },
  uva: {
    nome: "Uva",
    variedades: ["Red Globe", "Crimson", "Thompson", "Itália"],
    safra: "Junho a Dezembro",
    container_40: {
      observacao: "Consultar especificações técnicas"
    }
  }
};

// Gerar ID único para sessão
const gerarSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Gerar ID único para mensagem
const gerarMessageId = () => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Sistema simples - apenas detecta se pergunta sobre preços
const perguntouPreco = (mensagem: string): boolean => {
  const mensagemLower = mensagem.toLowerCase();
  const palavrasPreco = ['preço', 'price', 'precio', 'orçamento', 'cotação', 'custo', 'valor'];
  return palavrasPreco.some(palavra => mensagemLower.includes(palavra));
};

// Sistema de respostas inteligentes
const gerarResposta = (mensagem: string, idioma: string): string => {
  const mensagemLower = mensagem.toLowerCase();
  
  // Respostas por idioma
  const respostas = {
    pt: {
      saudacao: "Olá! 🍎 Sou o assistente da TerraCriar. Como posso ajudar com informações sobre nossos produtos?",
      produtos: "Exportamos: 🥭 Manga, 🍈 Melão Amarelo, 🥥 Coco Verde e 🍇 Uva premium do Vale do São Francisco para Europa.",
      manga: `🥭 **Manga Premium**
• Variedades: Tommy Atkins, Haden, Kent, Keitt
• Safra: Setembro a Janeiro
• Container 40': 22 paletes, 252 caixas/palete (4,2kg)
• Calibres: 6 ao 14
• Transit time: 8 dias (Fortaleza → Vigo)`,
      melao: `🍈 **Melão Amarelo**
• Variedades: Amarelo, Cantaloupe, Galia
• Safra: Todo o ano
• Container 40': 21 paletes, 91 caixas/palete (10kg)
• Calibres: 6 ao 10
• Transit time: 8 dias (Fortaleza → Vigo)`,
      coco: `🥥 **Coco Verde**
• Produto: Coco Verde e Água Natural
• Safra: Todo o ano
• Container 40': 21 paletes, 91 caixas/palete (12kg)
• Calibre: 6
• Transit time: 8 dias (Fortaleza → Vigo)`,
      uva: `🍇 **Uva Premium**
• Variedades: Red Globe, Crimson, Thompson, Itália
• Safra: Junho a Dezembro
• Container 40': Consultar especificações
• Transit time: 8 dias (Fortaleza → Vigo)`,
      certificacoes: "🏆 Certificações: GlobalGAP, BRC, HACCP, Orgânico, Comércio Justo, ISO 22000. Garantia total de qualidade!",
      preco: `💰 Para cotações e preços, entre em contato:
📞 +55 87 9999-9999
📧 contato@terracriar.com.br
💬 WhatsApp: +55 87 99999-9999`,
      logistica: "🚢 Logística: Porto Fortaleza-CE → Vigo-ES, 8 dias. Cadeia de frio controlada, embalagens técnicas.",
      experiencia: "✅ Mais de 10 anos exportando frutas premium para Europa. Parcerias sólidas e qualidade comprovada!",
      contato: `📞 **Fale Conosco:**
• Tel: +55 87 9999-9999
• Email: contato@terracriar.com.br
• WhatsApp: +55 87 99999-9999
• Local: Vale do São Francisco, PE`,
      default: "Obrigado pelo interesse! Para informações específicas, nossa equipe comercial entrará em contato. Precisa de mais alguma coisa?"
    },
    en: {
      saudacao: "Hello! 🍎 I'm TerraCriar's assistant. How can I help with information about our products?",
      produtos: "We export: 🥭 Mango, 🍈 Yellow Melon, 🥥 Green Coconut and 🍇 Premium Grapes from São Francisco Valley to Europe.",
      manga: `🥭 **Premium Mango**
• Varieties: Tommy Atkins, Haden, Kent, Keitt
• Harvest: September to January
• 40' Container: 22 pallets, 252 boxes/pallet (4.2kg)
• Calibers: 6 to 14
• Transit time: 8 days (Fortaleza → Vigo)`,
      melao: `🍈 **Yellow Melon**
• Varieties: Yellow, Cantaloupe, Galia
• Harvest: Year-round
• 40' Container: 21 pallets, 91 boxes/pallet (10kg)
• Calibers: 6 to 10
• Transit time: 8 days (Fortaleza → Vigo)`,
      coco: `🥥 **Green Coconut**
• Product: Green Coconut and Natural Water
• Harvest: Year-round
• 40' Container: 21 pallets, 91 boxes/pallet (12kg)
• Caliber: 6
• Transit time: 8 days (Fortaleza → Vigo)`,
      uva: `🍇 **Premium Grapes**
• Varieties: Red Globe, Crimson, Thompson, Italia
• Harvest: June to December
• 40' Container: Consult specifications
• Transit time: 8 days (Fortaleza → Vigo)`,
      certificacoes: "🏆 Certifications: GlobalGAP, BRC, HACCP, Organic, Fair Trade, ISO 22000. Total quality guarantee!",
      preco: `💰 For quotes and prices, contact us:
📞 +55 87 9999-9999
📧 contato@terracriar.com.br
💬 WhatsApp: +55 87 99999-9999`,
      logistica: "🚢 Logistics: Fortaleza-CE → Vigo-ES Port, 8 days. Controlled cold chain, technical packaging.",
      experiencia: "✅ Over 10 years exporting premium fruits to Europe. Solid partnerships and proven quality!",
      contato: `📞 **Contact Us:**
• Tel: +55 87 9999-9999
• Email: contato@terracriar.com.br
• WhatsApp: +55 87 99999-9999
• Location: São Francisco Valley, PE`,
      default: "Thank you for your interest! For specific information, our commercial team will contact you. Need anything else?"
    },
    es: {
      saudacao: "¡Hola! 🍎 Soy el asistente de TerraCriar. ¿Cómo puedo ayudar con información sobre nuestros productos?",
      produtos: "Exportamos: 🥭 Mango, 🍈 Melón Amarillo, 🥥 Coco Verde y 🍇 Uvas premium del Valle de São Francisco a Europa.",
      manga: `🥭 **Mango Premium**
• Variedades: Tommy Atkins, Haden, Kent, Keitt
• Cosecha: Septiembre a Enero
• Contenedor 40': 22 pallets, 252 cajas/pallet (4,2kg)
• Calibres: 6 al 14
• Tiempo tránsito: 8 días (Fortaleza → Vigo)`,
      melao: `🍈 **Melón Amarillo**
• Variedades: Amarillo, Cantaloupe, Galia
• Cosecha: Todo el año
• Contenedor 40': 21 pallets, 91 cajas/pallet (10kg)
• Calibres: 6 al 10
• Tiempo tránsito: 8 días (Fortaleza → Vigo)`,
      coco: `🥥 **Coco Verde**
• Producto: Coco Verde y Agua Natural
• Cosecha: Todo el año
• Contenedor 40': 21 pallets, 91 cajas/pallet (12kg)
• Calibre: 6
• Tiempo tránsito: 8 días (Fortaleza → Vigo)`,
      uva: `🍇 **Uvas Premium**
• Variedades: Red Globe, Crimson, Thompson, Italia
• Cosecha: Junio a Diciembre
• Contenedor 40': Consultar especificaciones
• Tiempo tránsito: 8 días (Fortaleza → Vigo)`,
      certificacoes: "🏆 Certificaciones: GlobalGAP, BRC, HACCP, Orgánico, Comercio Justo, ISO 22000. ¡Garantía total de calidad!",
      preco: `💰 Para cotizaciones y precios, contáctanos:
📞 +55 87 9999-9999
📧 contato@terracriar.com.br
💬 WhatsApp: +55 87 99999-9999`,
      logistica: "🚢 Logística: Puerto Fortaleza-CE → Vigo-ES, 8 días. Cadena de frío controlada, embalajes técnicos.",
      experiencia: "✅ Más de 10 años exportando frutas premium a Europa. ¡Alianzas sólidas y calidad comprobada!",
      contato: `📞 **Contáctanos:**
• Tel: +55 87 9999-9999
• Email: contato@terracriar.com.br
• WhatsApp: +55 87 99999-9999
• Ubicación: Valle São Francisco, PE`,
      default: "¡Gracias por tu interés! Para información específica, nuestro equipo comercial se contactará. ¿Necesitas algo más?"
    }
  };

  const resp = respostas[idioma as keyof typeof respostas] || respostas.pt;

  // Análise de intenção
  if (mensagemLower.includes('olá') || mensagemLower.includes('hello') || mensagemLower.includes('hola')) {
    return resp.saudacao;
  }
  if (mensagemLower.includes('manga')) return resp.manga;
  if (mensagemLower.includes('melão') || mensagemLower.includes('melon') || mensagemLower.includes('melón')) return resp.melao;
  if (mensagemLower.includes('coco') || mensagemLower.includes('coconut')) return resp.coco;
  if (mensagemLower.includes('uva') || mensagemLower.includes('grape')) return resp.uva;
  if (mensagemLower.includes('produto') || mensagemLower.includes('product')) return resp.produtos;
  if (mensagemLower.includes('certificaç') || mensagemLower.includes('certific')) return resp.certificacoes;
  if (mensagemLower.includes('preço') || mensagemLower.includes('price') || mensagemLower.includes('precio')) return resp.preco;
  if (mensagemLower.includes('logística') || mensagemLower.includes('logistic')) return resp.logistica;
  if (mensagemLower.includes('experiência') || mensagemLower.includes('experience')) return resp.experiencia;
  if (mensagemLower.includes('contato') || mensagemLower.includes('contact')) return resp.contato;
  
  return resp.default;
};

export async function POST(request: NextRequest) {
  try {
    const {
      mensagem,
      idioma = 'pt',//eslint-disable-next-line
      historico = [],
      sessionId: clientSessionId
    } = await request.json();

    // Metadados da requisição
    const userAgent = request.headers.get('user-agent') || 'Desconhecido';
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'Desconhecido';
    
    // Gera ou usa o sessionId existente
    const sessionId = clientSessionId || gerarSessionId();
    const messageId = gerarMessageId();

    // Gerar resposta inteligente
    const respostaDaIA = gerarResposta(mensagem, idioma);
    const perguntaPreco = perguntouPreco(mensagem);

    // Prepara mensagens para salvar (estrutura pronta para Firebase futuro)
    const mensagemUsuario = {
      id: messageId,
      conteudo: mensagem,
      tipo: 'usuario',
      timestamp: new Date().toISOString(),
      metadados: {
        ip,
        userAgent: userAgent.substring(0, 200)
      }
    };

    const mensagemBot = {
      id: gerarMessageId(),
      conteudo: respostaDaIA,
      tipo: 'bot',
      timestamp: new Date().toISOString(),
      metadados: {
        perguntouPreco: perguntaPreco,
        modelo: 'terracriar-simples'
      }
    };

    // 🔥 SALVAR CONVERSA NO FIREBASE
    try {
      const conversationRef = doc(db, 'conversas', sessionId);
      const conversationDoc = await getDoc(conversationRef);

      if (!conversationDoc.exists()) {
        // 📝 Criar nova conversa
        await setDoc(conversationRef, {
          sessionId,
          userId: `anon_${sessionId.split('_')[1]}`,
          estado: 'ativa',
          idioma,
          perguntouPreco: perguntaPreco,
          criadoEm: serverTimestamp(),
          atualizadoEm: serverTimestamp(),
          totalMensagens: 2,
          metadados: {
            ip,
            userAgent: userAgent.substring(0, 200),
            pagina: request.headers.get('referer') || 'direto',
            dispositivo: userAgent.includes('Mobile') ? 'mobile' : 'desktop'
          },
          mensagens: [mensagemUsuario, mensagemBot],
          ultimaMensagem: mensagem.substring(0, 100),
          ultimaAtividade: serverTimestamp()
        });

      } else {
        // 🔄 Atualizar conversa existente
        const conversationData = conversationDoc.data();

        await updateDoc(conversationRef, {
          atualizadoEm: serverTimestamp(),
          ultimaAtividade: serverTimestamp(),
          ultimaMensagem: mensagem.substring(0, 100),
          totalMensagens: (conversationData.totalMensagens || 0) + 2,
          perguntouPreco: perguntaPreco || conversationData.perguntouPreco,
          mensagens: arrayUnion(mensagemUsuario, mensagemBot)
        });
      }

      console.log(`✅ Conversa ${sessionId} salva no Firebase`);

    } catch (firebaseError) {
      console.error('❌ Erro ao salvar no Firebase:', firebaseError);
      // Não falha a API se o Firebase der erro
    }

    // Log simples para desenvolvimento
    console.log(`💬 Nova mensagem: ${mensagem} | Preço: ${perguntaPreco}`);

    // Resposta simplificada
    return NextResponse.json({
      resposta: respostaDaIA,
      sessionId,
      timestamp: new Date().toISOString()
    });

  } catch (erro) {
    console.error('❌ Erro no chatbot:', erro);
    return NextResponse.json(
      {
        erro: 'Erro interno do servidor',
        codigo: 'CHATBOT_ERROR',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}