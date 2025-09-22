/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Check, Star, Award, Truck, Shield, Send, Globe, Calendar, Leaf, Droplets, Thermometer, Users, Quote, Target, Eye } from 'lucide-react';
import { ChatBot } from '@/components/ChatBot';
import { Idioma, FormularioContato, EstadoFormulario } from '@/types';
import traducoes from '@/config/translations';

export default function Home() {
  const [idioma, setIdioma] = useState<Idioma>('pt');
  const [slideAtual, setSlideAtual] = useState(0);

  const [formulario, setFormulario] = useState<FormularioContato>({
    nome: '',
    empresa: '',
    email: '',
    telefone: '',
    produto: '',
    mensagem: ''
  });
  const [estadoForm, setEstadoForm] = useState<EstadoFormulario>({
    enviando: false,
    sucesso: false,
    erro: false
  });

  const t = traducoes[idioma];

  // Array das frutas para o carrossel
  const frutasCarrossel = [
    { src: '/images/uva.jpg', nome: 'Uva Premium' },
    { src: '/images/manga.jpg', nome: 'Manga Tropical' },
    { src: '/images/melao.jpg', nome: 'Melão Doce' },
    { src: '/images/coco.jpg', nome: 'Coco Fresco' }
  ];

  // Efeito para trocar slides automaticamente
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideAtual((prev) => (prev + 1) % frutasCarrossel.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [frutasCarrossel.length]);

  // Mock data para enriquecer o conteúdo
  const dadosNutricionais = {
    uva: { calorias: '69 kcal', vitamina: 'Vitamina C, K', minerais: 'Potássio, Manganês' },
    manga: { calorias: '60 kcal', vitamina: 'Vitamina A, C', minerais: 'Potássio, Magnésio' },
    melao: { calorias: '34 kcal', vitamina: 'Vitamina A, C', minerais: 'Potássio, Folato' },
    coco: { calorias: '354 kcal', vitamina: 'Vitamina C, E', minerais: 'Manganês, Cobre' }
  };

  const calendarioSafras = [
    { produto: 'Uva', meses: 'Jul-Dez', cor: 'bg-purple-500' },
    { produto: 'Manga', meses: 'Ago-Jan', cor: 'bg-orange-500' },
    { produto: 'Melão', meses: 'Abr-Out', cor: 'bg-green-500' },
    { produto: 'Coco', meses: 'Jan-Dez', cor: 'bg-amber-500' }
  ];

  const paisesDestino = [
    { regiao: 'Europa', paises: ['Alemanha', 'França', 'Reino Unido', 'Espanha'], flag: '🇪🇺' },
    { regiao: 'América do Norte', paises: ['EUA', 'Canadá'], flag: '🇺🇸' },
    { regiao: 'Oriente Médio', paises: ['Emirados Árabes', 'Arábia Saudita'], flag: '🇦🇪' },
    { regiao: 'Ásia', paises: ['Japão', 'Singapura', 'Hong Kong'], flag: '🇯🇵' }
  ];

  const depoimentos = [
    {
      nome: "Heinrich Schmidt",
      empresa: "FreshMarket GmbH - Alemanha",
      texto: "A qualidade das frutas TerraCriar é excepcional. Nossa parceria de 5 anos tem sido fundamental para nosso sucesso no mercado europeu.",
      foto: "/images/cliente1.jpg"
    },
    {
      nome: "Sarah Johnson",
      empresa: "Premium Fruits Ltd - Reino Unido",
      texto: "Rastreabilidade total e qualidade consistente. A TerraCriar define os padrões para frutas tropicais premium.",
      foto: "/images/cliente2.jpg"
    },
    {
      nome: "Ahmed Al-Rashid",
      empresa: "Middle East Imports - UAE",
      texto: "Parceiro confiável há anos. A logística impecável garante que nossos clientes recebam frutas perfeitas.",
      foto: "/images/cliente3.jpg"
    }
  ];

  const produtos = [
    {
      id: 'uva',
      nome: t.produtos.uva.nome,
      dados: t.produtos.uva,
      imagem: '/images/uva.jpg',
      cor: 'from-emerald-600 to-teal-700',
      nutricional: dadosNutricionais.uva
    },
    {
      id: 'manga',
      nome: t.produtos.manga.nome,
      dados: t.produtos.manga,
      imagem: '/images/manga.jpg',
      cor: 'from-emerald-500 to-green-600',
      nutricional: dadosNutricionais.manga
    },
    {
      id: 'melao',
      nome: t.produtos.melao.nome,
      dados: t.produtos.melao,
      imagem: '/images/melao.jpg',
      cor: 'from-teal-500 to-emerald-600',
      nutricional: dadosNutricionais.melao
    },
    {
      id: 'coco',
      nome: t.produtos.coco.nome,
      dados: t.produtos.coco,
      imagem: '/images/coco.jpg',
      cor: 'from-teal-600 to-emerald-700',
      nutricional: dadosNutricionais.coco
    }
  ];

  const diferenciais = [
    {
      icone: <Award className="h-8 w-8" />,
      titulo: t.diferenciais.qualidade,
      descricao: t.diferenciais.qualidadeTexto
    },
    {
      icone: <Truck className="h-8 w-8" />,
      titulo: t.diferenciais.logistica,
      descricao: t.diferenciais.logisticaTexto
    },
    {
      icone: <Shield className="h-8 w-8" />,
      titulo: t.diferenciais.rastreabilidade,
      descricao: t.diferenciais.rastreabilidadeTexto
    },
    {
      icone: <Star className="h-8 w-8" />,
      titulo: t.diferenciais.parcerias,
      descricao: t.diferenciais.parceriasTexto
    }
  ];

  const handleDoubleClickLogo = () => {
    window.location.href = '/admin/login';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstadoForm({ enviando: true, sucesso: false, erro: false });

    setTimeout(() => {
      setEstadoForm({ enviando: false, sucesso: true, erro: false });
      setFormulario({
        nome: '', empresa: '', email: '', telefone: '', produto: '', mensagem: ''
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50">

      {/* Header Tropical Limpo e Sofisticado */}
      <header className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5"></div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            {/* Logo Ampliada - Com duplo clique para admin */}
            <div className="flex items-center">
              <div className="relative cursor-pointer" onDoubleClick={handleDoubleClickLogo}>
                <img
                  src="/images/terracriarLogo.png"
                  alt="TerraCriar"
                  className="h-24 sm:h-28 w-auto filter drop-shadow-2xl transition-transform hover:scale-105"
                />
                <div className="absolute -inset-2 bg-white/10 rounded-2xl blur-xl"></div>
              </div>
              <div className="ml-4 sm:ml-6">
                <p className="text-emerald-50 text-base sm:text-lg font-medium">Premium Tropical Fruits</p>
              </div>
            </div>

            {/* Navegação + Seletor Idiomas */}
            <div className="flex items-center space-x-6">
              <nav className="hidden lg:flex items-center space-x-8">
                {['inicio', 'sobre', 'produtos', 'qualidade', 'contato'].map((item) => (
                  <a
                    key={item}
                    href={`#${item}`}
                    className="text-white/90 hover:text-white font-semibold text-lg transition-all duration-300 hover:scale-105 relative group"
                  >
                    {t.navegacao[item as keyof typeof t.navegacao]}
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></div>
                  </a>
                ))}
              </nav>

              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
                {(['pt', 'en', 'es'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setIdioma(lang)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                      idioma === lang
                        ? 'bg-white text-emerald-600 shadow-lg'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section com Carrossel */}
      <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {frutasCarrossel.map((fruta, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
                index === slideAtual ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${fruta.src})`,
              }}
            />
          ))}
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-transparent to-teal-900/30"></div>
        </div>

        <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-600/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-16 h-16 bg-teal-600/20 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-20 w-12 h-12 bg-green-600/20 rounded-full animate-ping"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8 animate-fadeInDown">
            <span className="inline-block bg-emerald-100/90 text-emerald-800 px-6 py-3 rounded-full text-lg font-semibold border border-emerald-200 backdrop-blur-sm">
              Exportação Premium desde 2014
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight animate-slideInUp drop-shadow-2xl">
            <span className="inline-block transform hover:scale-105 transition-transform duration-300">
              {t.inicio.titulo}
            </span>
          </h1>

          <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed animate-slideInUp animation-delay-200 drop-shadow-lg">
            {t.inicio.subtitulo}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slideInUp animation-delay-400">
            <button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-emerald-500/50">
              {t.inicio.botaoCotacao}
            </button>
            <button className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 font-bold py-4 px-8 rounded-xl transform hover:scale-105 transition-all duration-300 hover:bg-white/20 shadow-2xl">
              {t.inicio.botaoProdutos}
            </button>
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {frutasCarrossel.map((_, index) => (
              <button
                key={index}
                onClick={() => setSlideAtual(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === slideAtual
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInDown { animation: fadeInDown 1s ease-out; }
        .animate-slideInUp { animation: slideInUp 1s ease-out; }
        .animation-delay-200 { animation-delay: 0.2s; animation-fill-mode: both; }
        .animation-delay-400 { animation-delay: 0.4s; animation-fill-mode: both; }
      `}</style>

      {/* Sobre Section - Com Mapa Visual */}
      <section id="sobre" className="py-32 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 relative overflow-hidden">
        {/* Pattern Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-full text-lg font-semibold mb-6 shadow-xl">
              🌱 Nossa História
            </span>
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 to-emerald-800 bg-clip-text text-transparent mb-8">
              Sobre a TerraCriar
            </h2>
            <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Médicos naturais unidos pela expertise em nutrição e produção agroindustrial
            </p>
          </div>

          {/* Mapa do Vale do São Francisco */}
          <div className="mb-20 bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100">
            <div className="grid lg:grid-cols-2">
              <div className="p-12 bg-gradient-to-br from-emerald-50 to-teal-50">
                <div className="flex items-center mb-6">
                  <MapPin className="h-8 w-8 text-emerald-600 mr-4" />
                  <h3 className="text-3xl font-bold text-slate-800">Vale do São Francisco</h3>
                </div>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed font-bold">
                  Localizada no coração do maior polo de fruticultura irrigada do Brasil, nossa operação se beneficia do clima semiárido tropical e das águas do Rio São Francisco. Clique no vídeo ao lado e veja como a TerrarCriar melhor produz frutas.
                </p>
                
                <div className="space-y-4">
        <div className="flex items-center p-4 bg-white rounded-xl shadow-md">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mr-4">
            <Thermometer className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Clima Ideal</h4>
            <p className="text-slate-600 font-bold">Temperatura média 26°C</p>
          </div>
        </div>
        
        <div className="flex items-center p-4 bg-white rounded-xl shadow-md">
          <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center mr-4">
            <Droplets className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Irrigação</h4>
            <p className="text-slate-600 font-bold">Rio São Francisco</p>
          </div>
        </div>
      </div>
    </div>

    {/* Vídeo de Produção Responsivo */}
    <div className="relative h-96 lg:h-auto">
      <video 
        className="w-full h-full object-cover"
        controls
        poster="/images/pedemanga.jpeg" // opcional: adicione um poster se tiver
        preload="metadata"
      >
        <source src="/images/fabricaproducao.mp4" type="video/mp4" />
        <p className="flex items-center justify-center h-full bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 text-white text-center font-bold">
          Seu navegador não suporta o elemento de vídeo. 
          <a href="/images/fabricaproducao.mp4" className="underline ml-2">
            Clique aqui para baixar o vídeo
          </a>
        </p>
        </video>
      </div>
    </div>
  </div>

          {/* Conteúdo Principal Reformulado */}
          <div className="grid lg:grid-cols-3 gap-12 mb-20">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-10 rounded-3xl shadow-xl border-l-4 border-emerald-500">
                <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                  <Leaf className="h-7 w-7 text-emerald-600 mr-3" />
                  Nossa Origem
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  A Terra Criar é uma empresa composta por um grupo de médicos naturais da região do Vale do São Francisco, que uniram saberes para aliar a vocação em saúde através da expertise na nutrição, produção e beneficiamento agroindustrial de frutas tropicais destinadas à exportação.
                </p>
              </div>

              <div className="bg-white p-10 rounded-3xl shadow-xl border-l-4 border-teal-500">
                <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                  <Globe className="h-7 w-7 text-teal-600 mr-3" />
                  Nossa Operação
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Com fazenda na Maniçoba, Juazeiro, e escritório em Petrolina, produzimos manga, melão e uva voltadas aos mercados da Europa, Oriente Médio, América do Norte e Ásia, de janeiro a janeiro, sempre apoiados por tecnologia de ponta e pela mais rigorosa gestão de segurança alimentar.
                </p>
              </div>
            </div>

            {/* Fotos da Equipe/Fazenda */}
            <div className="space-y-6">
              <div className="relative group overflow-hidden rounded-3xl shadow-xl">
                <img
                  src="/images/producaomanga.jpeg"
                  alt="Frutas Naturais"
                  className="w-full h-48 object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h4 className="font-bold text-lg">Qualidade</h4>
                    <p className="text-sm opacity-90">Especialidade Agroindustrial</p>
                  </div>
                </div>
              </div>

              <div className="relative group overflow-hidden rounded-3xl shadow-xl">
                <img
                  src="/images/pedemanga.jpeg"
                  alt="Vista Aérea da Fazenda"
                  className="w-full h-48 object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h4 className="font-bold text-lg">Fazenda Maniçoba</h4>
                    <p className="text-sm opacity-90">500+ hectares irrigados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Missão, Visão e Proposta - Design Hexagonal */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform"></div>
              <div className="relative bg-white p-10 rounded-3xl shadow-xl transform group-hover:-translate-y-2 transition-transform">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-6">Missão</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Oferecer ao mundo frutas tropicais in natura com a qualidade nutricional proveniente da região que contempla o melhor clima do mundo para tal cultivo, banhada por um dos maiores Rios do mundo, o Rio São Francisco.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-green-600 rounded-3xl transform -rotate-3 group-hover:-rotate-6 transition-transform"></div>
              <div className="relative bg-white p-10 rounded-3xl shadow-xl transform group-hover:-translate-y-2 transition-transform">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Eye className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-6">Visão</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Unir ciência, inovação, ética, respeito e responsabilidade humana para ampliar o impacto positivo e sustentável da agricultura do Vale do São Francisco no cenário global.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl transform rotate-2 group-hover:rotate-4 transition-transform"></div>
              <div className="relative bg-white p-10 rounded-3xl shadow-xl transform group-hover:-translate-y-2 transition-transform">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-6">Proposta de Valor</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Aplicar tecnologia com ética e respeito ao meio ambiente em todas as etapas do processo desde a colheita até a distribuição com temperatura controlada e rastreabilidade total.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Produtos Section - Aprimorada com Informações Nutricionais */}
      <section id="produtos" className="py-32 bg-gradient-to-br from-white via-emerald-50/20 to-slate-50 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold mb-6 shadow-xl">
              🍇 Nossos Produtos
            </span>
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 to-green-800 bg-clip-text text-transparent mb-8">
              Frutas Premium
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Frutas tropicais de qualidade internacional com rastreabilidade completa
            </p>
          </div>

          {/* Calendário de Safras */}
          <div className="mb-16 bg-white rounded-3xl shadow-xl p-8 border border-emerald-100">
            <div className="text-center mb-8">
              <Calendar className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-800">Calendário de Safras</h3>
              <p className="text-slate-600">Produção contínua durante todo o ano</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {calendarioSafras.map((item, index) => (
                <div key={index} className="text-center p-6 bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-lg border border-slate-100">
                  <div className={`w-16 h-16 ${item.cor} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl`}>
                    {item.produto.charAt(0)}
                  </div>
                  <h4 className="font-bold text-slate-800 mb-2">{item.produto}</h4>
                  <p className="text-emerald-600 font-semibold">{item.meses}</p>
                </div>
              ))}
            </div>
          </div>


      {/* Produtos com Informações Nutricionais */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {produtos.map((produto, index) => {
    // Mapeamento das imagens por produto com tipagem correta
      const imagensProdutos: { [key: string]: string } = {
      'Manga': '/images/manga.jpg',
      'Melão': '/images/melao.jpg', 
      'Coco': '/images/coco.jpg',
      'Uva': '/images/uva.jpg'
    };
    
      const imagemProduto = imagensProdutos[produto.nome] || '/images/fruta-default.jpg';
    
       return (
        <div key={produto.id} className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all"></div>
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden transform group-hover:scale-105 group-hover:-translate-y-4 transition-all duration-500 border border-slate-100">
          
          {/* Header do Produto com Imagem */}
          <div className={`h-64 bg-gradient-to-br ${produto.cor} relative overflow-hidden`}>
            {/* Imagem da Fruta */}
            <img 
              src={imagemProduto}
              alt={produto.nome}
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40"></div>
            <div className="absolute bottom-6 left-6 text-white z-10">
              <h3 className="text-4xl font-bold drop-shadow-lg mb-2">{produto.nome}</h3>
              <p className="text-xl opacity-90 font-bold">{produto.dados.variedades}</p>
            </div>
            <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 z-10">
              <span className="text-white font-semibold">{produto.dados.safra}</span>
            </div>
          </div>
          
          {/* Conteúdo do Produto */}
          <div className="p-8 space-y-6">
            <p className="text-slate-600 text-lg leading-relaxed font-bold">
              {produto.dados.descricao}
            </p>
            
            {/* Informações Nutricionais */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center">
                <Leaf className="h-5 w-5 text-emerald-600 mr-2" />
                Informações Nutricionais (100g)
              </h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-emerald-600">{produto.nutricional.calorias}</div>
                  <div className="text-sm text-slate-600 font-bold">Calorias</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{produto.nutricional.vitamina}</div>
                  <div className="text-xs text-slate-600 font-bold">Vitaminas</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{produto.nutricional.minerais}</div>
                  <div className="text-xs text-slate-600 font-bold">Minerais</div>
                </div>
              </div>
            </div>
            
            {/* Qualidade */}
            <div className="flex items-center p-4 bg-slate-50 rounded-2xl">
              <Check className="h-6 w-6 text-emerald-600 mr-3 flex-shrink-0" />
              <span className="font-semibold text-slate-800">{produto.dados.qualidade}</span>
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>

         
          {/* Países de Destino */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-3xl shadow-2xl p-10 text-white">
            <div className="text-center mb-10">
              <Globe className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-4">Mercados Globais</h3>
              <p className="text-slate-300 text-xl">Exportamos para os principais mercados mundiais</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {paisesDestino.map((destino, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all">
                  <div className="text-4xl mb-4">{destino.flag}</div>
                  <h4 className="font-bold text-xl mb-3">{destino.regiao}</h4>
                  <div className="space-y-1">
                    {destino.paises.map((pais, idx) => (
                      <div key={idx} className="text-slate-300 text-sm">{pais}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nova Seção - Tecnologia e Produção */}
      <section className="py-32 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 relative overflow-hidden">
        {/* Elementos Decorativos */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-teal-500 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold mb-6 shadow-xl">
              🔬 Tecnologia & Produção
            </span>
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 to-teal-800 bg-clip-text text-transparent mb-8">
              Inovação no Campo
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto">
              Tecnologia de ponta aplicada em todas as etapas produtivas
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Lado Esquerdo - Tecnologias */}
            <div className="space-y-8">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-emerald-100 group-hover:shadow-2xl transition-all">
                  <div className="flex items-start space-x-6">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 rounded-2xl">
                      <Droplets className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-3">Sistema de Irrigação</h3>
                      <p className="text-slate-600 leading-relaxed">
                        Irrigação por gotejamento com sensores IoT para otimização do uso da água do Rio São Francisco, garantindo eficiência hídrica máxima.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 to-green-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-teal-100 group-hover:shadow-2xl transition-all">
                  <div className="flex items-start space-x-6">
                    <div className="bg-gradient-to-r from-teal-600 to-green-600 p-4 rounded-2xl">
                      <Thermometer className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-3">Controle Climático</h3>
                      <p className="text-slate-600 leading-relaxed">
                        Monitoramento 24/7 de temperatura, umidade e condições atmosféricas com estações meteorológicas automatizadas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-green-100 group-hover:shadow-2xl transition-all">
                  <div className="flex items-start space-x-6">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-2xl">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-3">Laboratório Próprio</h3>
                      <p className="text-slate-600 leading-relaxed">
                        Análises completas de solo, água e frutos em laboratório próprio, garantindo qualidade nutricional superior e segurança alimentar.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lado Direito - Imagem + Stats */}
            <div className="relative">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-all"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
                  <img 
                    src="/images/tecnologia-producao.jpg" 
                    alt="Tecnologia na Produção"
                    className="w-full h-80 object-cover"
                  />
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-slate-800 mb-6">Dados da Produção</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center p-4 bg-emerald-50 rounded-2xl">
                        <div className="text-3xl font-bold text-emerald-600">500+</div>
                        <div className="text-slate-600">Hectares</div>
                      </div>
                      <div className="text-center p-4 bg-teal-50 rounded-2xl">
                        <div className="text-3xl font-bold text-teal-600">365</div>
                        <div className="text-slate-600">Dias/Ano</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-2xl">
                        <div className="text-3xl font-bold text-green-600">15+</div>
                        <div className="text-slate-600">Países</div>
                      </div>
                      <div className="text-center p-4 bg-slate-100 rounded-2xl">
                        <div className="text-3xl font-bold text-slate-600">100%</div>
                        <div className="text-slate-600">Rastreável</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Depoimentos - Design Cards Flutuantes */}
      <section className="py-32 bg-gradient-to-br from-slate-800 via-slate-700 to-emerald-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-400 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-800 px-8 py-4 rounded-full text-lg font-semibold mb-6 shadow-xl">
              💬 Nossos Parceiros
            </span>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              O Que Dizem Sobre Nós
            </h2>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto">
              Depoimentos de clientes e parceiros internacionais
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {depoimentos.map((depoimento, index) => (
              <div key={index} className="group relative">
                {/* Background Card Flutuante */}
                <div className={`absolute inset-0 bg-gradient-to-r ${index === 0 ? 'from-emerald-600 to-teal-600' : index === 1 ? 'from-teal-600 to-green-600' : 'from-green-600 to-emerald-600'} rounded-3xl transform ${index === 1 ? 'rotate-2' : index === 2 ? '-rotate-1' : 'rotate-1'} group-hover:rotate-3 group-hover:scale-105 transition-all duration-300 opacity-20`}></div>
                
                {/* Card Principal */}
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform group-hover:-translate-y-4 transition-all duration-300">
                  {/* Quote Icon */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full flex items-center justify-center shadow-xl">
                    <Quote className="h-6 w-6 text-white" />
                  </div>

                  {/* Foto do Cliente */}
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-slate-300 to-slate-400 rounded-full flex items-center justify-center mr-4 shadow-lg">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{depoimento.nome}</h4>
                      <p className="text-slate-600 text-sm">{depoimento.empresa}</p>
                    </div>
                  </div>

                  {/* Depoimento */}
                  <blockquote className="text-slate-600 text-lg leading-relaxed italic mb-6">
                    &quot;{depoimento.texto}&quot;
                  </blockquote>

                  {/* Rating Stars */}
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats dos Parceiros */}
          <div className="mt-20 grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="text-4xl font-bold text-emerald-400 mb-2">50+</div>
              <div className="text-white text-lg">Parceiros Ativos</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="text-4xl font-bold text-teal-400 mb-2">15</div>
              <div className="text-white text-lg">Países</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="text-4xl font-bold text-green-400 mb-2">10+</div>
              <div className="text-white text-lg">Anos de Parceria</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="text-4xl font-bold text-emerald-300 mb-2">99%</div>
              <div className="text-white text-lg">Satisfação</div>
            </div>
          </div>
        </div>
      </section>

        {/* Diferenciais Section - Design Moderno */}
         <section id="qualidade" className="py-32 bg-gradient-to-br from-white via-emerald-50/30 to-slate-50 relative">
          <div className="absolute inset-0 opacity-5">
           <div className="absolute top-20 right-20 w-80 h-80 bg-emerald-500 rounded-full blur-3xl"></div>
           <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-500 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block bg-gradient-to-r from-slate-800 to-emerald-800 text-white px-8 py-4 rounded-full text-lg font-semibold mb-6 shadow-xl">
              🏆 Nossos Diferenciais
            </span>
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 to-emerald-800 bg-clip-text text-transparent mb-8">
              Excelência Garantida
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto">
              O que nos torna únicos no mercado de frutas tropicais premium
            </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
             {diferenciais.map((item, index) => (
               <div key={index} className="group relative">
            {/* Background Gradient Animado */}
                <div className={`absolute inset-0 bg-gradient-to-br ${index % 2 === 0 ? 'from-emerald-600/20 to-teal-600/20' : 'from-teal-600/20 to-green-600/20'} rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500`}></div>
                
            {/* Card Principal */}
                <div className="relative bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transform group-hover:-translate-y-6 group-hover:scale-105 transition-all duration-500 border border-slate-100">
            {/* Ícone Animado */}
                  <div className={`w-20 h-20 bg-gradient-to-br ${index % 2 === 0 ? 'from-emerald-600 to-teal-600' : 'from-teal-600 to-green-600'} rounded-2xl flex items-center justify-center mx-auto mb-8 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                    {item.icone}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center group-hover:text-emerald-600 transition-colors">
                    {item.titulo}
                  </h3>
                  
                  <p className="text-slate-600 leading-relaxed text-lg text-center">
                    {item.descricao}
                  </p>

                {/* Decoração */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-emerald-100 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 bg-teal-100 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  </div>
                 </div>
                ))}
              </div>

            {/* Certificações */}
            <div className="bg-gradient-to-r from-slate-800 to-emerald-800 rounded-3xl shadow-2xl p-12 text-white">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold mb-6 flex items-center justify-center">
                <Shield className="h-10 w-10 text-emerald-400 mr-4" />
                Certificações e Padrões
              </h3>
              <p className="text-slate-300 text-xl">
                Ancorados nas diretrizes dos laboratórios transnacionais de referência
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                { nome: 'BPP', desc: 'Boas Práticas de Produção', cor: 'bg-emerald-600' },
                { nome: 'HACCP', desc: 'Análise de Perigos e Pontos Críticos', cor: 'bg-teal-600' },
                { nome: 'GMP', desc: 'Boas Práticas de Fabricação', cor: 'bg-green-600' },
                { nome: 'ISO 9001', desc: 'Gestão da Qualidade', cor: 'bg-emerald-700' },
                { nome: 'GlobalGAP', desc: 'Boas Práticas Agrícolas', cor: 'bg-teal-700' }
              ].map((cert, index) => (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                  <div className="relative text-center bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-all">
                    <div className={`w-16 h-16 ${cert.cor} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:scale-110 transition-transform`}>
                      <Check className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="font-bold text-white text-lg mb-2">{cert.nome}</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{cert.desc}</p>
                   </div>
                 </div>
                ))}
              </div>
            </div>
          </div>
        </section>

    {/* Contato Section - Design Aprimorado */}
         <section id="contato" className="py-32 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 relative overflow-hidden">
    {/* Background Elements */}
         <div className="absolute inset-0 opacity-5">
         <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500 rounded-full blur-3xl animate-pulse"></div>
         <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500 rounded-full blur-3xl animate-pulse"></div>
         </div>

         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="text-center mb-20">
        <span className="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold mb-6 shadow-xl">
        📞 Entre em Contato
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-800 to-emerald-800 bg-clip-text text-transparent mb-6 sm:mb-8">
        Fale Conosco
        </h2>
        <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto font-bold">
        Pronto para exportar frutas tropicais premium? Nossa equipe está aqui para ajudar
        </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Informações de Contato - Design Moderno */}
        <div className="space-y-6 sm:space-y-8">
        {/* Card Principal de Contatos */}
          <div className="bg-gradient-to-br from-white to-emerald-50/50 p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl border border-emerald-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-emerald-600/10 rounded-full blur-2xl"></div>
          <div className="relative">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 mb-6 sm:mb-8 flex items-center">
              <Phone className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 mr-3 sm:mr-4" />
              Informações de Contato
            </h3>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 bg-white rounded-2xl shadow-lg border border-emerald-50 group hover:shadow-xl hover:bg-emerald-50 transition-all">
                <div className="bg-emerald-600 text-white p-3 sm:p-4 rounded-xl mb-4 sm:mb-0 sm:mr-6 group-hover:scale-110 transition-transform">
                  <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base sm:text-lg">Telefone Comercial</h4>
                  <p className="text-emerald-600 text-lg sm:text-xl font-semibold">+55 87 981205891</p>
                  <p className="text-slate-600 text-sm font-bold">Seg-Sex: 8h às 18h</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 bg-white rounded-2xl shadow-lg border border-teal-50 group hover:shadow-xl hover:bg-teal-50 transition-all">
                <div className="bg-teal-600 text-white p-3 sm:p-4 rounded-xl mb-4 sm:mb-0 sm:mr-6 group-hover:scale-110 transition-transform">
                  <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base sm:text-lg">E-mail Corporativo</h4>
                  <p className="text-teal-600 text-lg sm:text-xl font-semibold">terracriardovale@gmail.com</p>
                  <p className="text-slate-600 text-sm font-bold">Resposta em até 24h</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 bg-white rounded-2xl shadow-lg border border-green-50 group hover:shadow-xl hover:bg-green-50 transition-all">
                <div className="bg-green-600 text-white p-3 sm:p-4 rounded-xl mb-4 sm:mb-0 sm:mr-6 group-hover:scale-110 transition-transform">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base sm:text-lg">Localização</h4>
                  <p className="text-green-600 text-base sm:text-lg font-semibold">Vale do São Francisco</p>
                  <p className="text-slate-600 text-sm font-bold">Petrolina-PE / Juazeiro-BA</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card WhatsApp */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 sm:p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden">
           <div className="absolute -top-4 -right-4 w-20 sm:w-24 h-20 sm:h-24 bg-white/10 rounded-full blur-xl"></div>
           <div className="relative">
             <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6">
              <div className="bg-white/20 p-3 sm:p-4 rounded-2xl mb-4 sm:mb-0 sm:mr-4">
                <Phone className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <div>
                <h4 className="text-xl sm:text-2xl font-bold">WhatsApp Business</h4>
                <p className="text-green-100 font-bold">Atendimento direto e rápido</p>
              </div>
            </div>
            <a 
              href="https://wa.me/5587981205891?text=Olá! Gostaria de saber mais sobre os produtos da TerraCriar e solicitar uma cotação."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-green-600 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl hover:bg-green-50 transition-all transform hover:scale-105 shadow-lg w-full sm:w-auto text-center"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Formulário Aprimorado */}
         <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-3xl blur-2xl"></div>
          <div className="relative bg-white p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl border border-slate-100">
           <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">Solicite uma Cotação</h3>
            <p className="text-slate-600 font-bold">Preencha o formulário e nossa equipe entrará em contato</p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="group">
                <label className="block text-base sm:text-lg font-semibold text-slate-800 mb-2 sm:mb-3 group-focus-within:text-emerald-600 transition-colors">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={formulario.nome}
                  onChange={(e) => setFormulario({...formulario, nome: e.target.value})}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all duration-300 text-base sm:text-lg group-hover:border-slate-300 text-slate-900 placeholder-slate-400"
                  placeholder="Seu nome"
                  required
                />
              </div>
              <div className="group">
                <label className="block text-base sm:text-lg font-semibold text-slate-800 mb-2 sm:mb-3 group-focus-within:text-emerald-600 transition-colors">
                  Empresa
                </label>
                <input
                  type="text"
                  value={formulario.empresa}
                  onChange={(e) => setFormulario({...formulario, empresa: e.target.value})}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all duration-300 text-base sm:text-lg group-hover:border-slate-300 text-slate-900 placeholder-slate-400"
                  placeholder="Nome da empresa"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="group">
                <label className="block text-base sm:text-lg font-semibold text-slate-800 mb-2 sm:mb-3 group-focus-within:text-emerald-600 transition-colors">
                  E-mail
                </label>
                <input
                  type="email"
                  value={formulario.email}
                  onChange={(e) => setFormulario({...formulario, email: e.target.value})}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all duration-300 text-base sm:text-lg group-hover:border-slate-300 text-slate-900 placeholder-slate-400"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <div className="group">
                <label className="block text-base sm:text-lg font-semibold text-slate-800 mb-2 sm:mb-3 group-focus-within:text-emerald-600 transition-colors">
                  Produto de Interesse
                </label>
                <select
                  value={formulario.produto}
                  onChange={(e) => setFormulario({...formulario, produto: e.target.value})}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all duration-300 text-base sm:text-lg group-hover:border-slate-300 text-slate-900 placeholder-slate-400"
                  required
                >
                  <option value="">Selecione um produto</option>
                  <option value="uva">🍇 Uva Premium</option>
                  <option value="manga">🥭 Manga Tropical</option>
                  <option value="melao">🍈 Melão Doce</option>
                  <option value="coco">🥥 Coco Fresco</option>
                  <option value="mix">🍓 Mix de Produtos</option>
                </select>
              </div>
            </div>

            <div className="group">
              <label className="block text-base sm:text-lg font-semibold text-slate-800 mb-2 sm:mb-3 group-focus-within:text-emerald-600 transition-colors">
                Mensagem
              </label>
              <textarea
                value={formulario.mensagem}
                onChange={(e) => setFormulario({...formulario, mensagem: e.target.value})}
                rows={5}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all duration-300 text-base sm:text-lg group-hover:border-slate-300 text-slate-900 placeholder-slate-400"
                placeholder="Conte-nos sobre seus requisitos: quantidade, destino, especificações..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={estadoForm.enviando}
              onClick={(e) => {
                e.preventDefault();
                const subject = `Cotação - ${formulario.produto || 'Produtos TerraCriar'}`;
                const body = `Nome: ${formulario.nome}%0D%0AEmpresa: ${formulario.empresa}%0D%0AE-mail: ${formulario.email}%0D%0AProduto: ${formulario.produto}%0D%0A%0D%0AMensagem:%0D%0A${formulario.mensagem}`;
                window.open(`mailto:terracriardovale@gmail.com?subject=${subject}&body=${body}`, '_blank');
              }}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 sm:py-5 px-6 sm:px-8 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-base sm:text-lg group"
            >
              {estadoForm.enviando ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white mr-3"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 sm:h-6 sm:w-6 mr-3 group-hover:translate-x-1 transition-transform" />
                  Solicitar Cotação
                </>
              )}
            </button>

            {estadoForm.sucesso && (
              <div className="bg-emerald-100 border border-emerald-400 text-emerald-700 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl text-base sm:text-lg flex items-center">
                <Check className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 mr-3" />
                Mensagem enviada com sucesso! Entraremos em contato em breve.
              </div>
              )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* Footer Aprimorado */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-slate-300 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-80 h-80 bg-emerald-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Seção Principal do Footer */}
          <div className="grid lg:grid-cols-4 gap-12 mb-16">
            {/* Logo e Descrição */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-8">
                <img
                  src="/images/terracriarLogo.png"
                  alt="TerraCriar"
                  className="h-16 w-auto filter brightness-0 invert opacity-90"
                />
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-white">TerraCriar</h3>
                  <p className="text-emerald-400">Premium Tropical Fruits</p>
                </div>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Exportando frutas tropicais premium do Vale do São Francisco para o mundo, 
                com tecnologia de ponta e compromisso com a qualidade nutricional superior.
              </p>
              
              {/* Social Icons Placeholders */}
              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-500 transition-colors cursor-pointer">
                  <span className="text-white font-bold">f</span>
                </div>
                <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center hover:bg-teal-500 transition-colors cursor-pointer">
                  <span className="text-white font-bold">in</span>
                </div>
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center hover:bg-green-500 transition-colors cursor-pointer">
                  <span className="text-white font-bold">@</span>
                </div>
              </div>
            </div>

            {/* Links Rápidos */}
            <div>
              <h4 className="text-xl font-bold text-white mb-6">Links Rápidos</h4>
              <ul className="space-y-4">
                {['Sobre Nós', 'Nossos Produtos', 'Qualidade', 'Certificações', 'Contato'].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors text-lg hover:translate-x-2 transform inline-block">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Produtos */}
            <div>
              <h4 className="text-xl font-bold text-white mb-6">Nossos Produtos</h4>
              <ul className="space-y-4">
                {['🍇 Uva Premium', '🥭 Manga Tropical', '🍈 Melão Doce', '🥥 Coco Fresco'].map((produto, index) => (
                  <li key={index}>
                    <a href="#" className="text-slate-400 hover:text-teal-400 transition-colors text-lg hover:translate-x-2 transform inline-block">
                      {produto}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contatos em Destaque */}
          <div className="grid md:grid-cols-3 gap-8 mb-12 py-12 border-t border-slate-700">
            <div className="text-center group">
              <div className="bg-emerald-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-xl">
                <Phone className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Telefone Comercial</h4>
              <p className="text-emerald-400 text-lg font-bold">+55 87 981205891</p>
              <p className="text-slate-500">Seg-Sex: 8h às 18h</p>
            </div>

            <div className="text-center group">
              <div className="bg-teal-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-xl">
                <Mail className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">E-mail Corporativo</h4>
              <p className="text-teal-400 text-lg font-bold">terracriardovale@gmail.com</p>
              <p className="text-slate-500">Resposta em até 24h</p>
            </div>

            <div className="text-center group">
              <div className="bg-green-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-xl">
                <MapPin className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Localização</h4>
              <p className="text-green-400 text-lg font-bold">Vale do São Francisco</p>
              <p className="text-slate-500">Petrolina-PE / Juazeiro-BA</p>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center border-t border-slate-700 pt-10">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-slate-500 text-lg mb-4 md:mb-0">
                © 2025 TerraCriar - Premium Tropical Fruits. Todos os direitos reservados.
              </p>
              <div className="flex items-center space-x-8 text-slate-500">
                <a href="#" className="hover:text-emerald-400 transition-colors">Política de Privacidade</a>
                <a href="#" className="hover:text-emerald-400 transition-colors">Termos de Uso</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ChatBot Component */}
      <ChatBot />
    </div>
  );
}