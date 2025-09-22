/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Plus,
  Package,
  Users,
  Truck,
  Building,
  Calendar,//eslint-disable-next-line
  Filter,
  Download,
  Trash2,
  Edit3,
  Eye,
  AlertCircle,
  Save,
  Loader,
  Check,
  X,
  PieChart,
  Target
} from 'lucide-react';

// Importar funções do Firebase
import { 
  criarReceita,
  buscarReceitas,
  criarDespesa,
  buscarDespesas,
  atualizarReceita,
  atualizarDespesa,
  deletarReceita,
  deletarDespesa,
  Receita,
  Despesa
} from '@/lib/firestore';

export default function GestaoFinanceiraFirebase() {
  const [activeTab, setActiveTab] = useState<'receitas' | 'despesas' | 'relatorios'>('receitas');
  const [selectedMonth, setSelectedMonth] = useState('2025-09');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formType, setFormType] = useState<'receita' | 'despesa'>('receita');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingItem, setEditingItem] = useState<(Receita | Despesa) | null>(null);
  
  // Estados do Firebase
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  
  // Formulário de receita
  const [receitaForm, setReceitaForm] = useState({
    cliente: '',
    produto: '',
    valor: 0,
    data: '',
    mes: ''
  });

  // Formulário de despesa
  const [despesaForm, setDespesaForm] = useState({
    tipo: 'frete' as 'frete' | 'fornecedor',
    descricao: '',
    valor: 0,
    data: '',
    mes: ''
  });

  const produtos = [
    'Uva Premium',
    'Manga Tropical', 
    'Melão Doce',
    'Coco Fresco',
    'Mix de Produtos'
  ];

  const clientesComuns = [
    'FreshMarket GmbH',
    'Premium Fruits Ltd',
    'Middle East Imports',
    'Asia Fruits Co',
    'Europe Fresh Trading'
  ];

  const mesesDisponiveis = [
    { value: '2025-09', label: 'Setembro 2025' },
    { value: '2025-10', label: 'Outubro 2025' },
    { value: '2025-11', label: 'Novembro 2025' },
    { value: '2025-12', label: 'Dezembro 2025' }
  ];

  // Carregar dados do Firebase
  const carregarDados = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [receitasFirebase, despesasFirebase] = await Promise.all([
        buscarReceitas(),
        buscarDespesas()
      ]);
      
      setReceitas(receitasFirebase);
      setDespesas(despesasFirebase);
    } catch (err) {
      console.error('Erro ao carregar dados financeiros:', err);
      setError('Erro ao carregar dados financeiros');
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar dados quando componente montar
  useEffect(() => {
    carregarDados();
  }, []);

  // Cálculos baseados nos dados do Firebase
  const getReceitasMes = (mes: string) => {
    return receitas.filter(r => r.mes === mes);
  };

  const getDespesasMes = (mes: string) => {
    return despesas.filter(d => d.mes === mes);
  };

  const getTotalReceitas = (mes: string) => {
    return getReceitasMes(mes).reduce((total, receita) => total + receita.valor, 0);
  };

  const getTotalDespesas = (mes: string) => {
    return getDespesasMes(mes).reduce((total, despesa) => total + despesa.valor, 0);
  };

  const getLucroLiquido = (mes: string) => {
    return getTotalReceitas(mes) - getTotalDespesas(mes);
  };

  // Receitas por produto
  const getReceitasPorProduto = (mes: string) => {
    const produtos: { [key: string]: number } = {};
    getReceitasMes(mes).forEach(receita => {
      produtos[receita.produto] = (produtos[receita.produto] || 0) + receita.valor;
    });
    return Object.entries(produtos).map(([produto, valor]) => ({ produto, valor }));
  };

  // Margem por produto (assumindo 30% de custo médio)
  const getMargemPorProduto = (mes: string) => {
    return getReceitasPorProduto(mes).map(item => ({
      produto: item.produto,
      receita: item.valor,
      custo: item.valor * 0.3,
      margem: item.valor * 0.7,
      percentual: 70
    }));
  };

  // Dados para gráfico de lucro mensal
  const getDadosGraficoLucro = () => {
    const meses = ['2025-09', '2025-10', '2025-11', '2025-12'];
    return meses.map(mes => ({
      mes: mes.split('-')[1] + '/' + mes.split('-')[0],
      receitas: getTotalReceitas(mes),
      despesas: getTotalDespesas(mes),
      lucro: getLucroLiquido(mes)
    }));
  };

  // Salvar receita
  const handleSalvarReceita = async () => {
    if (!receitaForm.cliente || !receitaForm.produto || receitaForm.valor <= 0 || !receitaForm.data) {
      setError('Preencha todos os campos da receita');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const dadosReceita = {
        cliente: receitaForm.cliente,
        produto: receitaForm.produto,
        valor: receitaForm.valor,
        data: receitaForm.data,
        mes: receitaForm.data.substring(0, 7) // YYYY-MM
      };

      console.log('Dados da receita a serem salvos:', dadosReceita);

      if (editingItem && 'cliente' in editingItem) {
        // Atualizar receita existente
        await atualizarReceita(editingItem.id!, dadosReceita);
        setReceitas(prev => prev.map(receita => 
          receita.id === editingItem.id 
            ? { ...receita, ...dadosReceita }
            : receita
        ));
        console.log('Receita atualizada no estado local');
      } else {
        // Criar nova receita
        const novoId = await criarReceita(dadosReceita);
        console.log('Nova receita criada no Firebase com ID:', novoId);
        
        const receitaComId: Receita = {
          id: novoId,
          ...dadosReceita
        };
        
        console.log('Receita a ser adicionada ao estado:', receitaComId);
        
        setReceitas(prev => {
          const novoEstado = [receitaComId, ...prev];
          console.log('Novo estado de receitas:', novoEstado);
          return novoEstado;
        });
      }

      // Recarregar dados do Firebase para garantir sincronização
      setTimeout(() => {
        carregarDados();
      }, 500);

      resetForm();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Erro ao salvar receita:', err);
      setError('Erro ao salvar receita');
    } finally {
      setIsSaving(false);
    }
  };

  // Salvar despesa
  const handleSalvarDespesa = async () => {
    if (!despesaForm.descricao || despesaForm.valor <= 0 || !despesaForm.data) {
      setError('Preencha todos os campos da despesa');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const dadosDespesa = {
        ...despesaForm,
        mes: despesaForm.data.substring(0, 7) // YYYY-MM
      };

      if (editingItem && 'tipo' in editingItem) {
        // Atualizar despesa existente
        await atualizarDespesa(editingItem.id!, dadosDespesa);
        setDespesas(prev => prev.map(despesa => 
          despesa.id === editingItem.id 
            ? { ...despesa, ...dadosDespesa }
            : despesa
        ));
      } else {
        // Criar nova despesa
        const novoId = await criarDespesa(dadosDespesa);
        const despesaComId: Despesa = {
          id: novoId,
          ...dadosDespesa
        };
        setDespesas(prev => [despesaComId, ...prev]);
      }

      resetForm();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Erro ao salvar despesa:', err);
      setError('Erro ao salvar despesa');
    } finally {
      setIsSaving(false);
    }
  };

  // Editar receita
  const handleEditReceita = (receita: Receita) => {
    setReceitaForm({
      cliente: receita.cliente,
      produto: receita.produto,
      valor: receita.valor,
      data: receita.data,
      mes: receita.mes
    });
    setEditingItem(receita);
    setFormType('receita');
    setShowAddForm(true);
  };

  // Editar despesa
  const handleEditDespesa = (despesa: Despesa) => {
    setDespesaForm({
      tipo: despesa.tipo,
      descricao: despesa.descricao,
      valor: despesa.valor,
      data: despesa.data,
      mes: despesa.mes
    });
    setEditingItem(despesa);
    setFormType('despesa');
    setShowAddForm(true);
  };

  // Deletar receita
  const handleDeleteReceita = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta receita?')) return;

    try {
      await deletarReceita(id);
      setReceitas(prev => prev.filter(receita => receita.id !== id));
    } catch (err) {
      console.error('Erro ao deletar receita:', err);
      setError('Erro ao excluir receita');
    }
  };

  // Deletar despesa
  const handleDeleteDespesa = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta despesa?')) return;

    try {
      await deletarDespesa(id);
      setDespesas(prev => prev.filter(despesa => despesa.id !== id));
    } catch (err) {
      console.error('Erro ao deletar despesa:', err);
      setError('Erro ao excluir despesa');
    }
  };

  const resetForm = () => {
    setReceitaForm({ cliente: '', produto: '', valor: 0, data: '', mes: '' });
    setDespesaForm({ tipo: 'frete', descricao: '', valor: 0, data: '', mes: '' });
    setShowAddForm(false);
    setEditingItem(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 shadow-xl border-b border-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            
            <div className="flex items-center">
              <button
                onClick={() => window.location.href = '/admin/dashboard'}
                className="flex items-center text-white hover:text-emerald-400 mr-6 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="text-base font-semibold">Dashboard</span>
              </button>
              
              <img
                src="/images/terracriarLogo.png"
                alt="TerraCriar"
                className="h-10 w-auto filter brightness-0 invert opacity-90 mr-4"
              />
              <div>
                <h1 className="text-white text-xl font-bold">Gestão Financeira</h1>
                <p className="text-slate-300 text-sm">Receitas e despesas com Firebase</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {isLoading ? (
                <div className="flex items-center text-white">
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  <span className="text-base font-medium">Carregando...</span>
                </div>
              ) : (
                <>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-slate-700 text-white px-4 py-2 rounded-xl border border-slate-600 focus:ring-2 focus:ring-emerald-600 text-base font-medium"
                    disabled={isLoading}
                  >
                    {mesesDisponiveis.map(mes => (
                      <option key={mes.value} value={mes.value}>{mes.label}</option>
                    ))}
                  </select>
                  
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition-colors flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="text-base font-semibold">Adicionar</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mensagens */}
      {showSuccess && (
        <div className="fixed top-20 right-4 bg-emerald-100 border border-emerald-400 text-emerald-700 px-6 py-4 rounded-xl shadow-lg z-50 flex items-center">
          <Check className="h-5 w-5 mr-3" />
          <span className="font-medium">Dados salvos no Firebase com sucesso!</span>
        </div>
      )}

      {error && (
        <div className="fixed top-20 right-4 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl shadow-lg z-50 flex items-center">
          <AlertCircle className="h-5 w-5 mr-3" />
          <span className="font-medium">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-3 text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Modal de Formulário */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                {editingItem ? 'Editar' : 'Adicionar'} {formType === 'receita' ? 'Receita' : 'Despesa'}
              </h3>
              <button
                onClick={resetForm}
                className="text-slate-400 hover:text-slate-600"
                disabled={isSaving}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Tabs do Modal */}
            <div className="flex mb-6 bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setFormType('receita')}
                className={`flex-1 py-2 px-4 rounded-lg text-base font-semibold transition-all ${
                  formType === 'receita'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
                disabled={isSaving}
              >
                Receita
              </button>
              <button
                onClick={() => setFormType('despesa')}
                className={`flex-1 py-2 px-4 rounded-lg text-base font-semibold transition-all ${
                  formType === 'despesa'
                    ? 'bg-violet-600 text-white'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
                disabled={isSaving}
              >
                Despesa
              </button>
            </div>

            {formType === 'receita' ? (
              /* Formulário de Receita */
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Cliente *</label>
                  <select
                    value={receitaForm.cliente}
                    onChange={(e) => setReceitaForm({...receitaForm, cliente: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-slate-800 font-medium"
                    disabled={isSaving}
                  >
                    <option value="">Selecione o cliente</option>
                    {clientesComuns.map(cliente => (
                      <option key={cliente} value={cliente}>{cliente}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Produto *</label>
                  <select
                    value={receitaForm.produto}
                    onChange={(e) => setReceitaForm({...receitaForm, produto: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-slate-800 font-medium"
                    disabled={isSaving}
                  >
                    <option value="">Selecione o produto</option>
                    {produtos.map(produto => (
                      <option key={produto} value={produto}>{produto}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Valor (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={receitaForm.valor}
                    onChange={(e) => setReceitaForm({...receitaForm, valor: Number(e.target.value)})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-slate-800 font-medium"
                    placeholder="45000.00"
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Data *</label>
                  <input
                    type="date"
                    value={receitaForm.data}
                    onChange={(e) => setReceitaForm({...receitaForm, data: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-slate-800 font-medium"
                    disabled={isSaving}
                  />
                </div>

                <button
                  onClick={handleSalvarReceita}
                  disabled={isSaving}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl font-semibold text-base transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  {isSaving ? (
                    <>
                      <Loader className="h-5 w-5 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      {editingItem ? 'Atualizar' : 'Salvar'} Receita
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Formulário de Despesa */
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tipo *</label>
                  <select
                    value={despesaForm.tipo}
                    onChange={(e) => setDespesaForm({...despesaForm, tipo: e.target.value as 'frete' | 'fornecedor'})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-600 focus:border-violet-600 text-slate-800 font-medium"
                    disabled={isSaving}
                  >
                    <option value="frete">Frete/Logística</option>
                    <option value="fornecedor">Fornecedor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Descrição *</label>
                  <input
                    type="text"
                    value={despesaForm.descricao}
                    onChange={(e) => setDespesaForm({...despesaForm, descricao: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-600 focus:border-violet-600 text-slate-800 font-medium"
                    placeholder={despesaForm.tipo === 'frete' ? 'Frete Marítimo - Alemanha' : 'Fazenda São Francisco'}
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Valor (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={despesaForm.valor}
                    onChange={(e) => setDespesaForm({...despesaForm, valor: Number(e.target.value)})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-600 focus:border-violet-600 text-slate-800 font-medium"
                    placeholder="8500.00"
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Data *</label>
                  <input
                    type="date"
                    value={despesaForm.data}
                    onChange={(e) => setDespesaForm({...despesaForm, data: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-600 focus:border-violet-600 text-slate-800 font-medium"
                    disabled={isSaving}
                  />
                </div>

                <button
                  onClick={handleSalvarDespesa}
                  disabled={isSaving}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 px-4 rounded-xl font-semibold text-base transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  {isSaving ? (
                    <>
                      <Loader className="h-5 w-5 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      {editingItem ? 'Atualizar' : 'Salvar'} Despesa
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Loading */}
        {isLoading && (
          <div className="text-center py-16">
            <Loader className="h-12 w-12 text-emerald-600 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-bold text-slate-600 mb-2">Carregando dados do Firebase...</h3>
            <p className="text-slate-500">Conectando com a base de dados</p>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Resumo Financeiro */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-100 text-sm font-medium">Receitas</p>
                    <p className="text-2xl font-bold">
                      R$ {getTotalReceitas(selectedMonth).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl shadow-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <TrendingDown className="h-8 w-8" />
                  </div>
                  <div className="text-right">
                    <p className="text-violet-100 text-sm font-medium">Despesas</p>
                    <p className="text-2xl font-bold">
                      R$ {getTotalDespesas(selectedMonth).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`bg-gradient-to-br ${getLucroLiquido(selectedMonth) >= 0 ? 'from-emerald-600 to-emerald-700' : 'from-red-500 to-red-600'} rounded-2xl shadow-xl p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <DollarSign className="h-8 w-8" />
                  </div>
                  <div className="text-right">
                    <p className="text-white/80 text-sm font-medium">Lucro Líquido</p>
                    <p className="text-2xl font-bold">
                      R$ {getLucroLiquido(selectedMonth).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 mb-8">
              <div className="flex border-b border-slate-200">
                {[
                  { key: 'receitas', label: 'Receitas', icon: TrendingUp, color: 'emerald' },
                  { key: 'despesas', label: 'Despesas', icon: TrendingDown, color: 'violet' },
                  { key: 'relatorios', label: 'Relatórios', icon: BarChart3, color: 'slate' }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}//eslint-disable-next-line
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`flex-1 flex items-center justify-center py-4 px-6 font-semibold text-base transition-all ${
                        activeTab === tab.key
                          ? `text-${tab.color}-600 border-b-2 border-${tab.color}-600 bg-${tab.color}-50`
                          : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Receitas */}
            {activeTab === 'receitas' && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-slate-800">Receitas por Cliente/Produto</h2>
                  <div className="text-emerald-600 font-bold text-xl">
                    Total: R$ {getTotalReceitas(selectedMonth).toLocaleString('pt-BR')}
                  </div>
                </div>

                <div className="space-y-4">
                  {getReceitasMes(selectedMonth).map(receita => (
                    <div key={receita.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all group">
                      <div className="flex items-center space-x-4">
                        <div className="bg-emerald-100 p-3 rounded-xl">
                          <Users className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg">{receita.cliente}</h3>
                          <div className="flex items-center text-slate-600 text-base font-medium">
                            <Package className="h-4 w-4 mr-1" />
                            {receita.produto}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-emerald-600">
                            R$ {receita.valor.toLocaleString('pt-BR')}
                          </p>
                          <p className="text-slate-500 text-base font-medium flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(receita.data).toLocaleDateString('pt-BR')}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleEditReceita(receita)}
                            className="bg-emerald-100 hover:bg-emerald-200 text-emerald-600 p-2 rounded-lg transition-colors"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteReceita(receita.id!)}
                            className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {getReceitasMes(selectedMonth).length === 0 && (
                    <div className="text-center py-16">
                      <TrendingUp className="h-24 w-24 text-slate-300 mx-auto mb-6" />
                      <h3 className="text-xl font-bold text-slate-600 mb-2">Nenhuma receita encontrada</h3>
                      <p className="text-slate-500 mb-6">Adicione receitas para acompanhar o desempenho financeiro</p>
                      <button
                        onClick={() => {
                          setFormType('receita');
                          setShowAddForm(true);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl transition-colors flex items-center mx-auto"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Adicionar Primeira Receita
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Despesas */}
            {activeTab === 'despesas' && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-slate-800">Despesas Operacionais</h2>
                  <div className="text-violet-600 font-bold text-xl">
                    Total: R$ {getTotalDespesas(selectedMonth).toLocaleString('pt-BR')}
                  </div>
                </div>

                <div className="space-y-4">
                  {getDespesasMes(selectedMonth).map(despesa => (
                    <div key={despesa.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all group">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl ${
                          despesa.tipo === 'frete' 
                            ? 'bg-violet-100' 
                            : 'bg-orange-100'
                        }`}>
                          {despesa.tipo === 'frete' ? (
                            <Truck className="h-6 w-6 text-violet-600" />
                          ) : (
                            <Building className="h-6 w-6 text-orange-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg">{despesa.descricao}</h3>
                          <div className="flex items-center text-slate-600 text-base font-medium">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              despesa.tipo === 'frete'
                                ? 'bg-violet-100 text-violet-700'
                                : 'bg-orange-100 text-orange-700'
                            }`}>
                              {despesa.tipo === 'frete' ? 'Frete/Logística' : 'Fornecedor'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-violet-600">
                            R$ {despesa.valor.toLocaleString('pt-BR')}
                          </p>
                          <p className="text-slate-500 text-base font-medium flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(despesa.data).toLocaleDateString('pt-BR')}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleEditDespesa(despesa)}
                            className="bg-violet-100 hover:bg-violet-200 text-violet-600 p-2 rounded-lg transition-colors"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteDespesa(despesa.id!)}
                            className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {getDespesasMes(selectedMonth).length === 0 && (
                    <div className="text-center py-16">
                      <TrendingDown className="h-24 w-24 text-slate-300 mx-auto mb-6" />
                      <h3 className="text-xl font-bold text-slate-600 mb-2">Nenhuma despesa registrada</h3>
                      <p className="text-slate-500 mb-6">Registre as despesas para controlar os custos operacionais</p>
                      <button
                        onClick={() => {
                          setFormType('despesa');
                          setShowAddForm(true);
                        }}
                        className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl transition-colors flex items-center mx-auto"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Registrar Primeira Despesa
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Relatórios */}
            {activeTab === 'relatorios' && (
              <div className="space-y-8">
                
                {/* Performance por Produto */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                      <PieChart className="h-6 w-6 mr-3 text-emerald-600" />
                      Performance por Produto
                    </h2>
                    <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-lg transition-colors flex items-center">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </button>
                  </div>

                  <div className="grid gap-4">
                    {getMargemPorProduto(selectedMonth).map((item, index) => (
                      <div key={index} className="border border-slate-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-slate-800">{item.produto}</h3>
                          <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {item.percentual}% margem
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-slate-600 text-sm font-medium mb-1">Receita</p>
                            <p className="text-xl font-bold text-emerald-600">
                              R$ {item.receita.toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-600 text-sm font-medium mb-1">Custo Estimado</p>
                            <p className="text-xl font-bold text-violet-600">
                              R$ {item.custo.toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-600 text-sm font-medium mb-1">Margem Bruta</p>
                            <p className="text-xl font-bold text-slate-800">
                              R$ {item.margem.toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 bg-slate-100 rounded-full h-3">
                          <div 
                            className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${item.percentual}%` }}
                          />
                        </div>
                      </div>
                    ))}

                    {getMargemPorProduto(selectedMonth).length === 0 && (
                      <div className="text-center py-12">
                        <Target className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-600 mb-2">Sem dados para análise</h3>
                        <p className="text-slate-500">Adicione receitas para ver a performance por produto</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Evolução Mensal */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                      <BarChart3 className="h-6 w-6 mr-3 text-violet-600" />
                      Evolução Mensal
                    </h2>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-emerald-500 rounded mr-2"></div>
                        <span className="text-sm font-medium text-slate-600">Receitas</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-violet-500 rounded mr-2"></div>
                        <span className="text-sm font-medium text-slate-600">Despesas</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-slate-700 rounded mr-2"></div>
                        <span className="text-sm font-medium text-slate-600">Lucro</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {getDadosGraficoLucro().map((dados, index) => (
                      <div key={index} className="border border-slate-200 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-slate-800">{dados.mes}</h3>
                          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            dados.lucro >= 0 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {dados.lucro >= 0 ? 'Lucro' : 'Prejuízo'}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <p className="text-emerald-600 text-sm font-medium mb-1">Receitas</p>
                            <p className="text-xl font-bold text-emerald-600">
                              R$ {dados.receitas.toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-violet-600 text-sm font-medium mb-1">Despesas</p>
                            <p className="text-xl font-bold text-violet-600">
                              R$ {dados.despesas.toLocaleString('pt-BR')}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-slate-700 text-sm font-medium mb-1">Resultado</p>
                            <p className={`text-xl font-bold ${
                              dados.lucro >= 0 ? 'text-emerald-600' : 'text-red-600'
                            }`}>
                              R$ {dados.lucro.toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </div>

                        {/* Barra de progresso visual */}
                        <div className="relative bg-slate-100 rounded-full h-6">
                          <div 
                            className="absolute top-0 left-0 bg-emerald-500 h-6 rounded-full opacity-80"
                            style={{ 
                              width: dados.receitas > 0 ? `${Math.min((dados.receitas / Math.max(...getDadosGraficoLucro().map(d => d.receitas))) * 100, 100)}%` : '0%' 
                            }}
                          />
                          <div 
                            className="absolute top-0 left-0 bg-violet-500 h-6 rounded-full opacity-60"
                            style={{ 
                              width: dados.despesas > 0 ? `${Math.min((dados.despesas / Math.max(...getDadosGraficoLucro().map(d => d.receitas))) * 100, 100)}%` : '0%' 
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resumo Geral */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                    <AlertCircle className="h-6 w-6 mr-3 text-slate-600" />
                    Resumo do Período
                  </h2>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-4">Principais Clientes</h3>
                      <div className="space-y-3">
                        {getReceitasMes(selectedMonth)
                          .sort((a, b) => b.valor - a.valor)
                          .slice(0, 3)
                          .map((receita, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg group hover:bg-slate-100 transition-all">
                              <div>
                                <span className="font-medium text-slate-800">{receita.cliente}</span>
                                <p className="text-sm text-slate-600">{receita.produto}</p>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className="font-bold text-emerald-600">
                                  R$ {receita.valor.toLocaleString('pt-BR')}
                                </span>
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => handleEditReceita(receita)}
                                    className="bg-emerald-100 hover:bg-emerald-200 text-emerald-600 p-1 rounded transition-colors"
                                  >
                                    <Edit3 className="h-3 w-3" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteReceita(receita.id!)}
                                    className="bg-red-100 hover:bg-red-200 text-red-600 p-1 rounded transition-colors"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-4">Principais Despesas</h3>
                      <div className="space-y-3">
                        {getDespesasMes(selectedMonth)
                          .sort((a, b) => b.valor - a.valor)
                          .slice(0, 3)
                          .map((despesa, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg group hover:bg-slate-100 transition-all">
                              <div>
                                <span className="font-medium text-slate-800">{despesa.descricao}</span>
                                <p className="text-sm text-slate-600">
                                  {despesa.tipo === 'frete' ? 'Frete/Logística' : 'Fornecedor'}
                                </p>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className="font-bold text-violet-600">
                                  R$ {despesa.valor.toLocaleString('pt-BR')}
                                </span>
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => handleEditDespesa(despesa)}
                                    className="bg-violet-100 hover:bg-violet-200 text-violet-600 p-1 rounded transition-colors"
                                  >
                                    <Edit3 className="h-3 w-3" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteDespesa(despesa.id!)}
                                    className="bg-red-100 hover:bg-red-200 text-red-600 p-1 rounded transition-colors"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}