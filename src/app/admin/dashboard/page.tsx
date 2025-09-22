/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, ForwardRefExoticComponent, RefAttributes } from 'react';
import { 
  BarChart3, 
  Users, 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Clock,
  Bell,
  Settings,
  LogOut,
  Home,
  UserPlus,//eslint-disable-next-line
  CreditCard,
  ChevronRight,
  Eye,
  MessageSquare,
  Calendar,
  Award,
  Loader,
  AlertCircle,//eslint-disable-next-line
  Truck,
  LucideProps
} from 'lucide-react';

// Importar funções do Firebase
import { 
  buscarClientes,
  buscarHistoricoCalculos,
  buscarReceitas,
  buscarDespesas,
  Cliente,
  CalculationHistory,
  Receita,
  Despesa
} from '@/lib/firestore';

export default function DashboardFirebase() {
  const [activeNotifications] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados do Firebase
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [calculos, setCalculos] = useState<CalculationHistory[]>([]);
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [despesas, setDespesas] = useState<Despesa[]>([]);

  // Carregar dados do Firebase
  const carregarDadosDashboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [clientesData, calculosData, receitasData, despesasData] = await Promise.all([
        buscarClientes(),
        buscarHistoricoCalculos(),
        buscarReceitas(),
        buscarDespesas()
      ]);
      
      setClientes(clientesData);
      setCalculos(calculosData);
      setReceitas(receitasData);
      setDespesas(despesasData);
      
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
      setError('Erro ao carregar dados do Firebase');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarDadosDashboard();
  }, []);

  // Cálculos baseados nos dados reais
  const getTotalReceitas = () => {
    return receitas.reduce((total, receita) => total + receita.valor, 0);
  };

  const getTotalDespesas = () => {
    return despesas.reduce((total, despesa) => total + despesa.valor, 0);
  };

  const getLucroLiquido = () => {
    return getTotalReceitas() - getTotalDespesas();
  };

  const getClientesAtivos = () => {
    return clientes.filter(cliente => cliente.status === 'ativo').length;
  };

  // Produtos mais calculados
  const getProdutosTop = () => {
    const produtos: { [key: string]: number } = {};
    
    calculos.forEach(calculo => {
      if (calculo.produto && calculo.produto !== 'Conversão de Moeda' && !calculo.produto.includes('Frete')) {
        produtos[calculo.produto] = (produtos[calculo.produto] || 0) + 1;
      }
    });
    
    return Object.entries(produtos)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([produto, count]) => ({ produto, count }));
  };

  // Atividades recentes baseadas em dados reais
  const getAtividadesRecentes = () => {
    const atividades: { titulo: string; descricao: string; time: string; icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>; color: string; }[] = [];
    
    // Últimos clientes
    const ultimosClientes = clientes.slice(0, 2);
    ultimosClientes.forEach(cliente => {
      atividades.push({
        titulo: 'Novo cliente cadastrado',
        descricao: `${cliente.nome} - ${cliente.empresa}`,
        time: calcularTempoRelativo(cliente.dataCadastro),
        icon: UserPlus,
        color: 'text-emerald-600'
      });
    });
    
    // Últimos cálculos
    const ultimosCalculos = calculos.slice(0, 2);
    ultimosCalculos.forEach(calculo => {
      atividades.push({
        titulo: `Cálculo de ${calculo.tipo}`,
        descricao: `${calculo.produto} - R$ ${calculo.valorFinal.toLocaleString('pt-BR')}`,
        time: calcularTempoRelativo(calculo.data),
        icon: Calculator,
        color: 'text-violet-600'
      });
    });
    
    // Últimas receitas
    const ultimasReceitas = receitas.slice(0, 1);
    ultimasReceitas.forEach(receita => {
      atividades.push({
        titulo: 'Nova receita registrada',
        descricao: `${receita.cliente} - R$ ${receita.valor.toLocaleString('pt-BR')}`,
        time: calcularTempoRelativo(receita.data),
        icon: DollarSign,
        color: 'text-emerald-600'
      });
    });
    
    return atividades.slice(0, 4);
  };

  const calcularTempoRelativo = (data: string) => {
    const hoje = new Date();
    const dataItem = new Date(data);
    const diffTime = Math.abs(hoje.getTime() - dataItem.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hoje';
    if (diffDays === 2) return 'Ontem';
    if (diffDays <= 7) return `${diffDays} dias atrás`;
    return `${Math.floor(diffDays / 7)} semana${diffDays > 14 ? 's' : ''} atrás`;
  };

  const stats = [
    {
      title: 'Clientes Ativos',
      value: getClientesAtivos().toString(),
      change: `${clientes.length} total`,
      icon: Users,
      color: 'from-emerald-600 to-emerald-700',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Receitas Totais',
      value: `R$ ${(getTotalReceitas() / 1000).toFixed(0)}k`,
      change: `${receitas.length} registros`,
      icon: TrendingUp,
      color: 'from-violet-600 to-violet-700',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-600'
    },
    {
      title: 'Cálculos Realizados',
      value: calculos.length.toString(),
      change: 'Histórico salvo',
      icon: Calculator,
      color: 'from-slate-600 to-slate-700',
      bgColor: 'bg-slate-50',
      textColor: 'text-slate-600'
    },
    {
      title: 'Lucro Líquido',
      value: `R$ ${(getLucroLiquido() / 1000).toFixed(0)}k`,
      change: getLucroLiquido() >= 0 ? 'Positivo' : 'Negativo',
      icon: DollarSign,
      color: 'from-emerald-600 to-violet-600',
      bgColor: 'bg-gradient-to-r from-emerald-50 to-violet-50',
      textColor: getLucroLiquido() >= 0 ? 'text-emerald-600' : 'text-red-600'
    }
  ];

  const quickActions = [
    {
      title: 'Cadastrar Cliente',
      description: 'Adicionar novo cliente',
      icon: UserPlus,
      color: 'from-emerald-600 to-emerald-700',
      link: '/admin/clientes'
    },
    {
      title: 'Calculadora',
      description: 'Calcular preços/frete',
      icon: Calculator,
      color: 'from-violet-600 to-violet-700',
      link: '/admin/calculadora'
    },
    {
      title: 'Gestão Financeira',
      description: 'Relatórios financeiros',
      icon: BarChart3,
      color: 'from-slate-600 to-slate-700',
      link: '/admin/financeiro'
    }
  ];

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair do sistema?')) {
      window.location.href = '/';
    }
  };

  const handleNavigation = (link: string) => {
    window.location.href = link;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Erro ao carregar dados</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={carregarDadosDashboard}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 shadow-xl border-b border-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            
            {/* Logo e Título */}
            <div className="flex items-center">
              <img
                src="/images/terracriarLogo.png"
                alt="TerraCriar"
                className="h-12 w-auto filter brightness-0 invert opacity-90"
              />
              <div className="ml-4">
                <h1 className="text-white text-xl font-bold">Dashboard Admin</h1>
                <p className="text-slate-300 text-sm">Sistema integrado com Firebase</p>
              </div>
            </div>

            {/* Ações do Header */}
            <div className="flex items-center space-x-4">
              
              {/* Notificações */}
              <div className="relative">
                <button className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-xl transition-colors relative">
                  <Bell className="h-5 w-5" />
                  {activeNotifications > 0 && (
                    <span className="absolute -top-2 -right-2 bg-violet-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                      {activeNotifications}
                    </span>
                  )}
                </button>
              </div>

              {/* Configurações */}
              <button className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-xl transition-colors">
                <Settings className="h-5 w-5" />
              </button>

              {/* Logout */}
              <button 
                onClick={handleLogout}
                className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl transition-colors flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="font-semibold">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navegação */}
      <nav className="bg-white shadow-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-4">
            
            <button 
              onClick={() => window.location.href = '/'}
              className="flex items-center text-slate-600 hover:text-emerald-600 font-semibold transition-colors text-base"
            >
              <Home className="h-5 w-5 mr-2" />
              Site Principal
            </button>

            <button 
              onClick={() => handleNavigation('/admin/clientes')}
              className="flex items-center text-slate-600 hover:text-emerald-600 font-semibold transition-colors text-base"
            >
              <Users className="h-5 w-5 mr-2" />
              Cadastro Clientes
            </button>

            <button 
              onClick={() => handleNavigation('/admin/calculadora')}
              className="flex items-center text-slate-600 hover:text-violet-600 font-semibold transition-colors text-base"
            >
              <Calculator className="h-5 w-5 mr-2" />
              Calculadora
            </button>

            <button 
              onClick={() => handleNavigation('/admin/financeiro')}
              className="flex items-center text-slate-600 hover:text-slate-700 font-semibold transition-colors text-base"
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              Gestão Financeira
            </button>
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Loading */}
        {isLoading && (
          <div className="text-center py-16">
            <Loader className="h-12 w-12 text-emerald-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-bold text-slate-600 mb-2">Carregando dados do Firebase...</h3>
            <p className="text-slate-500">Conectando com todas as bases de dados</p>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Boas-vindas */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">
                Bem-vindo ao Sistema TerraCriar! 👋
              </h2>
              <p className="text-slate-600 text-lg">
                Dados em tempo real do Firebase - {clientes.length} clientes, {calculos.length} cálculos, {receitas.length + despesas.length} registros financeiros
              </p>
            </div>

            {/* Cards de Estatísticas */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-slate-600 text-sm font-semibold mb-2">{stat.title}</p>
                        <h3 className="text-3xl font-bold text-slate-800 mb-2">{stat.value}</h3>
                        <div className="text-slate-500 text-sm font-medium">
                          {stat.change}
                        </div>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-6 w-6 ${stat.textColor}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Ações Rápidas */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Ações Rápidas</h3>
                    <div className="text-slate-400">
                      <Clock className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {quickActions.map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => handleNavigation(action.link)}
                          className="group relative bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300 text-left hover:-translate-y-1"
                        >
                          <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${action.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <h4 className="font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors text-base">
                            {action.title}
                          </h4>
                          <p className="text-slate-600 text-sm mb-3 font-medium">
                            {action.description}
                          </p>
                          <div className="flex items-center text-emerald-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                            Acessar <ChevronRight className="h-4 w-4 ml-1" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Métricas Rápidas */}
                <div className="mt-6 grid md:grid-cols-2 gap-6">
                  
                  {/* Produtos Mais Calculados */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-slate-800">Produtos Mais Calculados</h3>
                      <Award className="h-5 w-5 text-violet-600" />
                    </div>
                    
                    <div className="space-y-4">
                      {getProdutosTop().length > 0 ? getProdutosTop().map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-slate-600 font-semibold">{item.produto}</span>
                          <div className="flex items-center space-x-3">
                            <div className="w-16 bg-slate-200 rounded-full h-2">
                              <div className="bg-violet-500 h-2 rounded-full" style={{width: `${(item.count / Math.max(...getProdutosTop().map(p => p.count))) * 100}%`}}></div>
                            </div>
                            <span className="text-slate-800 font-bold text-sm w-8">{item.count}</span>
                          </div>
                        </div>
                      )) : (
                        <p className="text-slate-500 text-center py-4">Nenhum cálculo de produto ainda</p>
                      )}
                    </div>
                  </div>

                  {/* Status do Sistema */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-slate-800">Status Firebase</h3>
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                        <span className="text-emerald-800 font-semibold">Clientes</span>
                        <span className="text-emerald-600 text-sm font-bold">{clientes.length} registros</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-violet-50 rounded-xl">
                        <span className="text-violet-800 font-semibold">Calculadora</span>
                        <span className="text-violet-600 text-sm font-bold">{calculos.length} cálculos</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <span className="text-slate-800 font-semibold">Financeiro</span>
                        <span className="text-slate-600 text-sm font-bold">{receitas.length + despesas.length} registros</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Atividades Recentes */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-800">Atividades Recentes</h3>
                  <button 
                    onClick={carregarDadosDashboard}
                    className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold"
                  >
                    Atualizar
                  </button>
                </div>

                <div className="space-y-4">
                  {getAtividadesRecentes().length > 0 ? getAtividadesRecentes().map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group">
                        <div className={`p-2 rounded-lg bg-slate-100 ${activity.color} group-hover:scale-110 transition-transform`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800 text-sm mb-1">
                            {activity.titulo}
                          </h4>
                          <p className="text-slate-600 text-sm mb-2 font-medium">
                            {activity.descricao}
                          </p>
                          <p className="text-slate-400 text-xs flex items-center font-medium">
                            <Clock className="h-3 w-3 mr-1" />
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="text-center py-8">
                      <MessageSquare className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-600">Nenhuma atividade recente</p>
                      <p className="text-slate-500 text-sm mt-2">Use o sistema para ver as atividades aqui</p>
                    </div>
                  )}
                </div>

                {/* Resumo do Sistema */}
                <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-violet-50 rounded-xl border border-emerald-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">Sistema Integrado</h4>
                      <p className="text-slate-600 text-sm font-medium">
                        {clientes.length + calculos.length + receitas.length + despesas.length} registros totais no Firebase
                      </p>
                    </div>
                    <button 
                      onClick={carregarDadosDashboard}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer do Dashboard */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center space-x-4 text-slate-500">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Última atualização: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-emerald-600 font-semibold">• Firebase Conectado</span>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}