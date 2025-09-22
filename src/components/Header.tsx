'use client';

import { useState } from 'react';
import { ChevronDown, Menu, X, Globe } from 'lucide-react';
import { Idioma } from '@/types';
import traducoes from '@/config/translations';

interface HeaderProps {
  idioma: Idioma;
  aoMudarIdioma: (novoIdioma: Idioma) => void;
  caminhoLogo?: string;
}

export default function Header({ 
  idioma, 
  aoMudarIdioma, 
  caminhoLogo = '/images/terracriarLogo.png' 
}: HeaderProps) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [seletorIdiomaAberto, setSeletorIdiomaAberto] = useState(false);
  const [clicksAdmin, setClicksAdmin] = useState(0);

  const t = traducoes[idioma];

  const idiomas = [
    { codigo: 'pt' as Idioma, nome: 'Português', bandeira: '🇧🇷' },
    { codigo: 'en' as Idioma, nome: 'English', bandeira: '🇺🇸' },
    { codigo: 'es' as Idioma, nome: 'Español', bandeira: '🇪🇸' }
  ];

  const navegacao = [
    { nome: t.navegacao.inicio, href: '#inicio' },
    { nome: t.navegacao.sobre, href: '#sobre' },
    { nome: t.navegacao.produtos, href: '#produtos' },
    { nome: t.navegacao.qualidade, href: '#qualidade' },
    { nome: t.navegacao.contato, href: '#contato' }
  ];

  const handleLogoClick = () => {
    setClicksAdmin(prev => prev + 1);
    if (clicksAdmin >= 6) {
      // Área admin oculta - 7 cliques na logo
      alert('Área Admin Desbloqueada!');
      setClicksAdmin(0);
    }
    // Reset após 3 segundos
    setTimeout(() => setClicksAdmin(0), 3000);
  };

  const selecionarIdioma = (novoIdioma: Idioma) => {
    aoMudarIdioma(novoIdioma);
    setSeletorIdiomaAberto(false);
  };

  return (
    <header className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 shadow-2xl sticky top-0 z-50 border-b border-amber-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={handleLogoClick}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-300"
            >
              {caminhoLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={caminhoLogo} 
                  alt={t.empresa.nome}
                  className="h-12 w-auto object-contain filter drop-shadow-lg"
                />
              ) : (
                <div className="bg-gradient-to-br from-purple-600 to-green-600 text-white font-bold text-2xl h-12 w-12 rounded-lg flex items-center justify-center shadow-lg">
                  TC
                </div>
              )}
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-amber-50 tracking-wide">
                  {t.empresa.nome}
                </h1>
                <p className="text-sm text-amber-200 font-medium">
                  {t.empresa.slogan}
                </p>
              </div>
            </button>
          </div>

          {/* Navegação Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navegacao.map((item) => (
              <a
                key={item.nome}
                href={item.href}
                className="text-amber-100 hover:text-white font-medium transition-all duration-300 hover:scale-105 px-3 py-2 rounded-md hover:bg-amber-800/30"
              >
                {item.nome}
              </a>
            ))}
          </nav>

          {/* Seletor de Idioma e Menu Mobile */}
          <div className="flex items-center space-x-4">
            
            {/* Seletor de Idioma */}
            <div className="relative">
              <button
                onClick={() => setSeletorIdiomaAberto(!seletorIdiomaAberto)}
                className="flex items-center space-x-2 bg-amber-800/50 hover:bg-amber-700/50 text-amber-100 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 border border-amber-600"
              >
                <Globe size={18} />
                <span className="hidden sm:inline font-medium">
                  {idiomas.find(i => i.codigo === idioma)?.bandeira}
                </span>
                <ChevronDown size={16} className={`transition-transform duration-300 ${seletorIdiomaAberto ? 'rotate-180' : ''}`} />
              </button>

              {seletorIdiomaAberto && (
                <div className="absolute right-0 mt-2 w-48 bg-amber-900 border border-amber-700 rounded-lg shadow-2xl overflow-hidden z-50">
                  {idiomas.map((item) => (
                    <button
                      key={item.codigo}
                      onClick={() => selecionarIdioma(item.codigo)}
                      className={`w-full text-left px-4 py-3 hover:bg-amber-800 transition-colors duration-200 flex items-center space-x-3 ${
                        idioma === item.codigo ? 'bg-amber-800 text-white' : 'text-amber-100'
                      }`}
                    >
                      <span className="text-lg">{item.bandeira}</span>
                      <span className="font-medium">{item.nome}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Botão Menu Mobile */}
            <button
              onClick={() => setMenuAberto(!menuAberto)}
              className="lg:hidden bg-amber-800/50 hover:bg-amber-700/50 text-amber-100 p-2 rounded-lg transition-all duration-300 hover:scale-105 border border-amber-600"
            >
              {menuAberto ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {menuAberto && (
          <div className="lg:hidden bg-amber-800/95 backdrop-blur-sm rounded-b-lg shadow-2xl border-t border-amber-700">
            <nav className="px-4 py-6 space-y-4">
              {navegacao.map((item) => (
                <a
                  key={item.nome}
                  href={item.href}
                  onClick={() => setMenuAberto(false)}
                  className="block text-amber-100 hover:text-white font-medium transition-all duration-300 py-3 px-4 rounded-lg hover:bg-amber-700/50 hover:scale-105"
                >
                  {item.nome}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Overlay para fechar seletor de idioma */}
      {seletorIdiomaAberto && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setSeletorIdiomaAberto(false)}
        />
      )}
    </header>
  );
}