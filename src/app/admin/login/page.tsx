/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { Shield, User, Lock, Eye, EyeOff, ArrowLeft, LogIn, CheckCircle, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    
    // Simular chamada de API
    setTimeout(() => {
      if (loginData.email === 'admin@terracriar.com' && loginData.password === 'admin123') {
        setLoginSuccess(true);
        setTimeout(() => {
          window.location.href = '/admin/dashboard';
        }, 1500);
      } else {
        setLoginError('Email ou senha inválidos. Verifique suas credenciais e tente novamente.');
      }
      setIsLoading(false);
    }, 2000);
  };

  const handleBackToSite = () => {
    // Navega para a página principal
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/50 to-slate-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 bg-emerald-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-teal-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Header com Logo */}
      <header className="relative z-10 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="/images/terracriarLogo.png"
                alt="TerraCriar"
                className="h-16 w-auto filter drop-shadow-lg"
              />
              <div className="ml-4">
                <h1 className="text-white text-xl font-bold">TerraCriar</h1>
                <p className="text-emerald-100 text-sm">Sistema Administrativo</p>
              </div>
            </div>

            {/* Botão Voltar */}
            <button
              onClick={handleBackToSite}
              className="flex items-center text-white hover:text-emerald-100 transition-colors bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar ao Site
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] p-4">
        <div className="w-full max-w-md">
          
          {/* Card de Login */}
          <div className="relative group">
            {/* Background com Blur */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
            
            {/* Card Principal */}
            <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
              
              {/* Header do Card */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-center text-white relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="relative">
                  <div className="bg-white/20 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-12 w-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Acesso Administrativo</h2>
                  <p className="text-emerald-100 text-lg">Sistema de Gestão TerraCriar</p>
                </div>
              </div>

              {/* Formulário */}
              <div className="p-8">
                {loginSuccess ? (
                  /* Tela de Sucesso */
                  <div className="text-center py-8">
                    <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-12 w-12 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">Login Realizado!</h3>
                    <p className="text-slate-600 mb-6">Redirecionando para o painel administrativo...</p>
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                    </div>
                  </div>
                ) : (
                  /* Formulário de Login */
                  <div className="space-y-6">
                    
                    {/* Instruções */}
                    <div className="text-center mb-8">
                      <h3 className="text-xl font-semibold text-slate-800 mb-2">Entre com suas credenciais</h3>
                      <p className="text-slate-600">Acesso restrito a administradores autorizados</p>
                    </div>

                    {/* Campo Email */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">
                        E-mail Corporativo
                      </label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                        <input
                          type="email"
                          value={loginData.email}
                          onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                          className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all duration-300 text-lg hover:border-slate-300 text-slate-800 placeholder:text-slate-400"
                          placeholder="admin@terracriar.com"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    {/* Campo Senha */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">
                        Senha de Acesso
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={loginData.password}
                          onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                          className="w-full pl-12 pr-14 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all duration-300 text-lg hover:border-slate-300 text-slate-800 placeholder:text-slate-400"
                          placeholder="••••••••••"
                          required
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Mensagem de Erro */}
                    {loginError && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-red-800 font-semibold text-sm">Erro no Login</h4>
                          <p className="text-red-700 text-sm mt-1">{loginError}</p>
                        </div>
                      </div>
                    )}

                    {/* Lembrar Login */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 focus:ring-offset-0"
                          disabled={isLoading}
                        />
                        <span className="ml-2 text-sm text-slate-600">Lembrar por 30 dias</span>
                      </label>
                      <a href="#" className="text-sm text-emerald-600 hover:text-emerald-500 font-medium">
                        Esqueceu a senha?
                      </a>
                    </div>

                    {/* Botão de Login */}
                    <button
                      type="button"
                      onClick={handleLogin}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-6 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center text-lg group"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                          Verificando...
                        </>
                      ) : (
                        <>
                          <LogIn className="h-6 w-6 mr-3 group-hover:translate-x-1 transition-transform" />
                          Entrar no Sistema
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Informações de Teste */}
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-center">
              <div className="space-y-2 text-sm">
                <span>Acesso Restrito</span>
                <p className="text-slate-600">
                  <span>E-mail:</span> xxx@xxx.com
                </p>
                <p className="text-slate-600">
                  <span>Senha:</span> xxx
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Simples */}
      <footer className="relative z-10 text-center py-6 border-t border-slate-200 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-slate-600">
            © 2025 TerraCriar - Premium Tropical Fruits. Sistema Administrativo.
          </p>
        </div>
      </footer>
    </div>
  );
}