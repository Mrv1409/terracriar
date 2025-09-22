interface Traducoes {
  navegacao: {
    inicio: string;
    sobre: string;
    produtos: string;
    qualidade: string;
    contato: string;
    idioma: string;
  };
  
  empresa: {
    nome: string;
    slogan: string;
    descricao: string;
  };
  
  inicio: {
    titulo: string;
    subtitulo: string;
    botaoCotacao: string;
    botaoProdutos: string;
  };
  
  sobre: {
    titulo: string;
    texto: string;
    experiencia: string;
    certificacoes: string;
  };
  
  produtos: {
    titulo: string;
    uva: {
      nome: string;
      descricao: string;
      variedades: string;
      safra: string;
      qualidade: string;
    };
    manga: {
      nome: string;
      descricao: string;
      variedades: string;
      safra: string;
      qualidade: string;
    };
    melao: {
      nome: string;
      descricao: string;
      variedades: string;
      safra: string;
      qualidade: string;
    };
    coco: {
      nome: string;
      descricao: string;
      variedades: string;
      safra: string;
      qualidade: string;
    };
  };
  
  diferenciais: {
    titulo: string;
    qualidade: string;
    qualidadeTexto: string;
    logistica: string;
    logisticaTexto: string;
    rastreabilidade: string;
    rastreabilidadeTexto: string;
    parcerias: string;
    parceriasTexto: string;
  };
  
  contato: {
    titulo: string;
    subtitulo: string;
    telefone: string;
    email: string;
    endereco: string;
    formulario: {
      nome: string;
      empresa: string;
      email: string;
      telefone: string;
      produto: string;
      mensagem: string;
      enviar: string;
      enviando: string;
      sucesso: string;
      erro: string;
    };
  };
  
  chatbot: {
    titulo: string;
    placeholder: string;
    saudacao: string;
    respostas: {
      produtos: string;
      qualidade: string;
      exportacao: string;
      contato: string;
      padrao: string;
    };
  };
  
  rodape: {
    descricao: string;
    linksRapidos: string;
    informacoes: string;
    direitos: string;
  };
  
  sistema: {
    carregando: string;
    erro: string;
    sucesso: string;
    tenteNovamente: string;
  };
}

const traducoes: Record<string, Traducoes> = {
  pt: {
    navegacao: {
      inicio: "Início",
      sobre: "Sobre",
      produtos: "Produtos",
      qualidade: "Qualidade",
      contato: "Contato",
      idioma: "Idioma"
    },
    
    empresa: {
      nome: "TerraCriar",
      slogan: "Exportação Premium de Frutas Tropicais",
      descricao: "Do Vale do São Francisco para a Europa com qualidade certificada"
    },
    
    inicio: {
      titulo: "Frutas Premium do Brasil para o Mundo",
      subtitulo: "Exportamos uvas, mangas, melões e cocos de qualidade superior do Vale do São Francisco para os mercados mais exigentes da Europa.",
      botaoCotacao: "Solicitar Cotação",
      botaoProdutos: "Nossos Produtos"
    },
    
    sobre: {
      titulo: "Sobre a TerraCriar",
      texto: "Com mais de 10 anos de experiência, somos especialistas na exportação de frutas tropicais premium. Conectamos produtores do Vale do São Francisco aos mercados europeus mais exigentes, garantindo qualidade, certificação internacional e logística especializada.",
      experiencia: "Mais de 10 anos exportando frutas premium para a Europa",
      certificacoes: "Certificações GlobalGAP, BRC, HACCP e orgânicas"
    },
    
    produtos: {
      titulo: "Nossos Produtos",
      uva: {
        nome: "Uva",
        descricao: "Uvas de mesa premium com sabor excepcional e apresentação impecável",
        variedades: "Red Globe, Crimson, Thompson, Itália",
        safra: "Junho a Dezembro",
        qualidade: "Brix acima de 16°, baixa acidez, frutos uniformes"
      },
      manga: {
        nome: "Manga",
        descricao: "Mangas tropicais de polpa suculenta reconhecidas mundialmente",
        variedades: "Tommy Atkins, Haden, Kent, Keitt",
        safra: "Setembro a Janeiro", 
        qualidade: "Polpa firme, coloração intensa, rica em vitaminas"
      },
      melao: {
        nome: "Melão",
        descricao: "Melões doces e refrescantes com durabilidade excepcional",
        variedades: "Amarelo, Cantaloupe, Galia, Pele de Sapo",
        safra: "Todo o ano",
        qualidade: "Alto teor de açúcar, textura perfeita, resistente"
      },
      coco: {
        nome: "Coco",
        descricao: "Cocos frescos e água natural de qualidade premium",
        variedades: "Coco Verde, Coco Seco, Água de Coco",
        safra: "Todo o ano",
        qualidade: "Água cristalina, polpa fresca, alto valor nutricional"
      }
    },
    
    diferenciais: {
      titulo: "Nossos Diferenciais",
      qualidade: "Qualidade Certificada",
      qualidadeTexto: "Certificações internacionais GlobalGAP, BRC e HACCP garantem máxima qualidade e segurança",
      logistica: "Logística Especializada", 
      logisticaTexto: "Cadeia de frio controlada que preserva qualidade da colheita ao destino final",
      rastreabilidade: "Rastreabilidade Total",
      rastreabilidadeTexto: "Sistema completo de rastreamento do produtor ao consumidor final",
      parcerias: "Parcerias Sólidas",
      parceriasTexto: "Relacionamento direto com produtores e distribuidores europeus consolidados"
    },
    
    contato: {
      titulo: "Entre em Contato",
      subtitulo: "Conecte-se conosco para oportunidades de negócio",
      telefone: "Telefone",
      email: "E-mail", 
      endereco: "Vale do São Francisco, Pernambuco - Brasil",
      formulario: {
        nome: "Nome Completo",
        empresa: "Empresa",
        email: "E-mail",
        telefone: "Telefone",
        produto: "Produto de Interesse",
        mensagem: "Mensagem",
        enviar: "Enviar Mensagem",
        enviando: "Enviando...",
        sucesso: "Mensagem enviada com sucesso!",
        erro: "Erro ao enviar. Tente novamente."
      }
    },
    
    chatbot: {
      titulo: "Assistente TerraCriar",
      placeholder: "Digite sua pergunta...",
      saudacao: "Olá! Como posso ajudar com informações sobre nossos produtos?",
      respostas: {
        produtos: "Exportamos uvas, mangas, melões e cocos premium com certificação internacional.",
        qualidade: "Trabalhamos com certificações GlobalGAP, BRC e HACCP, garantindo máxima qualidade.",
        exportacao: "Exportamos para toda Europa com logística especializada e mais de 10 anos de experiência.",
        contato: "Entre em contato pelo formulário. Teremos prazer em apresentar nossos produtos!",
        padrao: "Nossa equipe entrará em contato para fornecer informações detalhadas."
      }
    },
    
    rodape: {
      descricao: "TerraCriar - Conectando o melhor do Brasil com a Europa através de frutas premium.",
      linksRapidos: "Links Rápidos",
      informacoes: "Informações de Contato",
      direitos: "© 2024 TerraCriar. Todos os direitos reservados."
    },
    
    sistema: {
      carregando: "Carregando...",
      erro: "Erro inesperado",
      sucesso: "Operação realizada com sucesso",
      tenteNovamente: "Tentar novamente"
    }
  },
  
  en: {
    navegacao: {
      inicio: "Home",
      sobre: "About", 
      produtos: "Products",
      qualidade: "Quality",
      contato: "Contact",
      idioma: "Language"
    },
    
    empresa: {
      nome: "TerraCriar",
      slogan: "Premium Tropical Fruit Export",
      descricao: "From São Francisco Valley to Europe with certified quality"
    },
    
    inicio: {
      titulo: "Premium Brazilian Fruits to the World",
      subtitulo: "We export superior quality grapes, mangoes, melons and coconuts from São Francisco Valley to Europe's most demanding markets.",
      botaoCotacao: "Request Quote",
      botaoProdutos: "Our Products"
    },
    
    sobre: {
      titulo: "About TerraCriar",
      texto: "With over 10 years of experience, we specialize in premium tropical fruit export. We connect São Francisco Valley producers to Europe's most demanding markets, ensuring quality, international certification and specialized logistics.",
      experiencia: "Over 10 years exporting premium fruits to Europe",
      certificacoes: "GlobalGAP, BRC, HACCP and organic certifications"
    },
    
    produtos: {
      titulo: "Our Products",
      uva: {
        nome: "Grape",
        descricao: "Premium table grapes with exceptional flavor and impeccable presentation",
        variedades: "Red Globe, Crimson, Thompson, Italia",
        safra: "June to December",
        qualidade: "Brix above 16°, low acidity, uniform fruits"
      },
      manga: {
        nome: "Mango",
        descricao: "Tropical mangoes with succulent pulp recognized worldwide",
        variedades: "Tommy Atkins, Haden, Kent, Keitt",
        safra: "September to January",
        qualidade: "Firm pulp, intense coloration, rich in vitamins"
      },
      melao: {
        nome: "Melon",
        descricao: "Sweet and refreshing melons with exceptional durability",
        variedades: "Yellow, Cantaloupe, Galia, Piel de Sapo",
        safra: "Year-round",
        qualidade: "High sugar content, perfect texture, resistant"
      },
      coco: {
        nome: "Coconut",
        descricao: "Fresh coconuts and premium quality natural water",
        variedades: "Green Coconut, Dry Coconut, Coconut Water",
        safra: "Year-round", 
        qualidade: "Crystal clear water, fresh pulp, high nutritional value"
      }
    },
    
    diferenciais: {
      titulo: "Our Differentials",
      qualidade: "Certified Quality",
      qualidadeTexto: "International certifications GlobalGAP, BRC and HACCP ensure maximum quality and safety",
      logistica: "Specialized Logistics",
      logisticaTexto: "Controlled cold chain that preserves quality from harvest to final destination",
      rastreabilidade: "Full Traceability",
      rastreabilidadeTexto: "Complete tracking system from producer to final consumer",
      parcerias: "Solid Partnerships",
      parceriasTexto: "Direct relationship with producers and established European distributors"
    },
    
    contato: {
      titulo: "Contact Us",
      subtitulo: "Connect with us for business opportunities",
      telefone: "Phone",
      email: "Email",
      endereco: "São Francisco Valley, Pernambuco - Brazil",
      formulario: {
        nome: "Full Name",
        empresa: "Company",
        email: "Email",
        telefone: "Phone",
        produto: "Product of Interest",
        mensagem: "Message",
        enviar: "Send Message",
        enviando: "Sending...",
        sucesso: "Message sent successfully!",
        erro: "Error sending. Please try again."
      }
    },
    
    chatbot: {
      titulo: "TerraCriar Assistant",
      placeholder: "Type your question...",
      saudacao: "Hello! How can I help with information about our products?",
      respostas: {
        produtos: "We export premium grapes, mangoes, melons and coconuts with international certification.",
        qualidade: "We work with GlobalGAP, BRC and HACCP certifications, ensuring maximum quality.",
        exportacao: "We export to all Europe with specialized logistics and over 10 years of experience.",
        contato: "Contact us through the form. We'll be pleased to present our products!",
        padrao: "Our team will contact you to provide detailed information."
      }
    },
    
    rodape: {
      descricao: "TerraCriar - Connecting the best of Brazil with Europe through premium fruits.",
      linksRapidos: "Quick Links",
      informacoes: "Contact Information",
      direitos: "© 2024 TerraCriar. All rights reserved."
    },
    
    sistema: {
      carregando: "Loading...",
      erro: "Unexpected error",
      sucesso: "Operation completed successfully",
      tenteNovamente: "Try again"
    }
  },
  
  es: {
    navegacao: {
      inicio: "Inicio",
      sobre: "Nosotros",
      produtos: "Productos", 
      qualidade: "Calidad",
      contato: "Contacto",
      idioma: "Idioma"
    },
    
    empresa: {
      nome: "TerraCriar",
      slogan: "Exportación Premium de Frutas Tropicales",
      descricao: "Del Valle de São Francisco hacia Europa con calidad certificada"
    },
    
    inicio: {
      titulo: "Frutas Premium de Brasil para el Mundo",
      subtitulo: "Exportamos uvas, mangos, melones y cocos de calidad superior del Valle de São Francisco hacia los mercados más exigentes de Europa.",
      botaoCotacao: "Solicitar Cotización",
      botaoProdutos: "Nuestros Productos"
    },
    
    sobre: {
      titulo: "Acerca de TerraCriar",
      texto: "Con más de 10 años de experiencia, somos especialistas en exportación de frutas tropicales premium. Conectamos productores del Valle de São Francisco con los mercados europeos más exigentes, garantizando calidad, certificación internacional y logística especializada.",
      experiencia: "Más de 10 años exportando frutas premium hacia Europa",
      certificacoes: "Certificaciones GlobalGAP, BRC, HACCP y orgánicas"
    },
    
    produtos: {
      titulo: "Nuestros Productos",
      uva: {
        nome: "Uva",
        descricao: "Uvas de mesa premium con sabor excepcional y presentación impecable",
        variedades: "Red Globe, Crimson, Thompson, Italia",
        safra: "Junio a Diciembre",
        qualidade: "Brix superior a 16°, baja acidez, frutos uniformes"
      },
      manga: {
        nome: "Mango",
        descricao: "Mangos tropicales de pulpa suculenta reconocidos mundialmente",
        variedades: "Tommy Atkins, Haden, Kent, Keitt",
        safra: "Septiembre a Enero",
        qualidade: "Pulpa firme, coloración intensa, rico en vitaminas"
      },
      melao: {
        nome: "Melón",
        descricao: "Melones dulces y refrescantes con durabilidad excepcional",
        variedades: "Amarillo, Cantaloupe, Galia, Piel de Sapo",
        safra: "Todo el año",
        qualidade: "Alto contenido de azúcar, textura perfecta, resistente"
      },
      coco: {
        nome: "Coco",
        descricao: "Cocos frescos y agua natural de calidad premium",
        variedades: "Coco Verde, Coco Seco, Agua de Coco", 
        safra: "Todo el año",
        qualidade: "Agua cristalina, pulpa fresca, alto valor nutricional"
      }
    },
    
    diferenciais: {
      titulo: "Nuestros Diferenciales",
      qualidade: "Calidad Certificada",
      qualidadeTexto: "Certificaciones internacionales GlobalGAP, BRC y HACCP garantizan máxima calidad y seguridad",
      logistica: "Logística Especializada",
      logisticaTexto: "Cadena de frío controlada que preserva calidad desde cosecha hasta destino final",
      rastreabilidade: "Trazabilidad Total", 
      rastreabilidadeTexto: "Sistema completo de rastreo desde productor hasta consumidor final",
      parcerias: "Alianzas Sólidas",
      parceriasTexto: "Relación directa con productores y distribuidores europeos establecidos"
    },
    
    contato: {
      titulo: "Contáctanos",
      subtitulo: "Conéctate con nosotros para oportunidades de negocio",
      telefone: "Teléfono",
      email: "Email",
      endereco: "Valle de São Francisco, Pernambuco - Brasil",
      formulario: {
        nome: "Nombre Completo",
        empresa: "Empresa", 
        email: "Email",
        telefone: "Teléfono",
        produto: "Producto de Interés",
        mensagem: "Mensaje",
        enviar: "Enviar Mensaje",
        enviando: "Enviando...",
        sucesso: "¡Mensaje enviado con éxito!",
        erro: "Error al enviar. Inténtalo de nuevo."
      }
    },
    
    chatbot: {
      titulo: "Asistente TerraCriar",
      placeholder: "Escribe tu pregunta...",
      saudacao: "¡Hola! ¿Cómo puedo ayudar con información sobre nuestros productos?",
      respostas: {
        produtos: "Exportamos uvas, mangos, melones y cocos premium con certificación internacional.",
        qualidade: "Trabajamos con certificaciones GlobalGAP, BRC y HACCP, garantizando máxima calidad.",
        exportacao: "Exportamos a toda Europa con logística especializada y más de 10 años de experiencia.",
        contato: "Contáctanos a través del formulario. ¡Tendremos el gusto de presentar nuestros productos!",
        padrao: "Nuestro equipo se contactará para proporcionar información detallada."
      }
    },
    
    rodape: {
      descricao: "TerraCriar - Conectando lo mejor de Brasil con Europa a través de frutas premium.",
      linksRapidos: "Enlaces Rápidos",
      informacoes: "Información de Contacto",
      direitos: "© 2024 TerraCriar. Todos los derechos reservados."
    },
    
    sistema: {
      carregando: "Cargando...",
      erro: "Error inesperado",
      sucesso: "Operación completada con éxito",
      tenteNovamente: "Intentar de nuevo"
    }
  }
};

export default traducoes;
export type { Traducoes };