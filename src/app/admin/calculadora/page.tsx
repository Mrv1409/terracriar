/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Calculator,
  DollarSign,
  TrendingUp,
  Save,
  History,
  RefreshCw,
  ArrowUpDown,
  Truck,//eslint-disable-next-line
  Percent,
  Globe,//eslint-disable-next-line
  Download,
  Trash2,//eslint-disable-next-line
  Edit3,
  Copy,
  Check,
  AlertCircle,
  Loader
} from 'lucide-react';

// Importar funções do Firebase
import { 
  salvarCalculo, 
  buscarHistoricoCalculos,
  CalculationHistory
} from '@/lib/firestore';

export default function CalculadoraFirebase() {
  const [activeTab, setActiveTab] = useState<'preco' | 'frete' | 'moeda'>('preco');
  const [showHistory, setShowHistory] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedCalculation, setSavedCalculation] = useState<CalculationHistory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para cálculo de preços
  const [precoData, setPrecoData] = useState({
    produto: '',
    quantidade: 0,
    precoUnitario: 0,
    margem: 15, // %
    desconto: 0, // %
  });

  // Estados para cálculo de frete
  const [freteData, setFreteData] = useState({
    peso: 0,
    distancia: 0,
    tipoTransporte: 'maritimo',
    seguro: true,
    valorCarga: 0,
  });

  // Estados para conversão de moedas
  const [moedaData, setMoedaData] = useState({
    valor: 0,
    moedaOrigem: 'BRL',
    moedaDestino: 'USD',
    taxaPersonalizada: 0,
  });

  // Mock de taxas de câmbio (em produção, usar API real)
  const [taxasCambio] = useState({
    'USD': { nome: 'Dólar Americano', taxa: 5.20, simbolo: '$' },
    'EUR': { nome: 'Euro', taxa: 5.65, simbolo: '€' },
    'GBP': { nome: 'Libra Esterlina', taxa: 6.45, simbolo: '£' },
    'AED': { nome: 'Dirham dos EAU', taxa: 1.42, simbolo: 'د.إ' },
    'JPY': { nome: 'Iene Japonês', taxa: 0.035, simbolo: '¥' },
    'BRL': { nome: 'Real Brasileiro', taxa: 1.00, simbolo: 'R$' },
  });

  // Histórico do Firebase
  const [historico, setHistorico] = useState<CalculationHistory[]>([]);

  const produtos = [
    'Uva Premium',
    'Manga Tropical', 
    'Melão Doce',
    'Coco Fresco',
    'Mix de Produtos'
  ];

  // Carregar histórico do Firebase
  const carregarHistorico = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const historicoFirebase = await buscarHistoricoCalculos();
      setHistorico(historicoFirebase);
    } catch (err) {
      console.error('Erro ao carregar histórico:', err);
      setError('Erro ao carregar histórico de cálculos');
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar histórico quando componente montar
  useEffect(() => {
    carregarHistorico();
  }, []);

  // Cálculos
  const calcularPreco = () => {
    const { quantidade, precoUnitario, margem, desconto } = precoData;
    const subtotal = quantidade * precoUnitario;
    const comMargem = subtotal * (1 + margem / 100);
    const comDesconto = comMargem * (1 - desconto / 100);
    return {
      subtotal,
      margem: subtotal * (margem / 100),
      desconto: comMargem * (desconto / 100),
      total: comDesconto
    };
  };

  const calcularFrete = () => {
    const { peso, distancia, tipoTransporte, seguro, valorCarga } = freteData;
    
    const tarifas = {
      maritimo: 0.50,
      aereo: 2.80,
      rodoviario: 1.20,
      ferroviario: 0.80
    };
    
    const tarifaBase = tarifas[tipoTransporte as keyof typeof tarifas] * peso;
    const custoDistancia = distancia * 0.10;
    const custoSeguro = seguro ? valorCarga * 0.02 : 0;
    const total = tarifaBase + custoDistancia + custoSeguro;
    
    return {
      tarifaBase,
      custoDistancia,
      custoSeguro,
      total
    };
  };

  const calcularConversao = () => {
    const { valor, moedaOrigem, moedaDestino, taxaPersonalizada } = moedaData;
    
    if (taxaPersonalizada > 0) {
      return {
        valorOriginal: valor,
        taxa: taxaPersonalizada,
        valorConvertido: valor * taxaPersonalizada,
        simboloOrigem: taxasCambio[moedaOrigem as keyof typeof taxasCambio]?.simbolo || '',
        simboloDestino: taxasCambio[moedaDestino as keyof typeof taxasCambio]?.simbolo || ''
      };
    }
    
    const taxaOrigem = taxasCambio[moedaOrigem as keyof typeof taxasCambio]?.taxa || 1;
    const taxaDestino = taxasCambio[moedaDestino as keyof typeof taxasCambio]?.taxa || 1;
    const taxaConversao = taxaDestino / taxaOrigem;
    
    return {
      valorOriginal: valor,
      taxa: taxaConversao,
      valorConvertido: valor * taxaConversao,
      simboloOrigem: taxasCambio[moedaOrigem as keyof typeof taxasCambio]?.simbolo || '',
      simboloDestino: taxasCambio[moedaDestino as keyof typeof taxasCambio]?.simbolo || ''
    };
  };

  const salvarCalculoFirebase = async () => {
    setIsSaving(true);
    setError(null);

    try {
      let novoCalculo: Omit<CalculationHistory, 'id' | 'createdAt'>;
      const dataAtual = new Date().toISOString().split('T')[0];

      if (activeTab === 'preco') {
        const resultado = calcularPreco();
        novoCalculo = {
          tipo: 'preco',
          produto: precoData.produto,
          quantidade: precoData.quantidade,
          precoUnitario: precoData.precoUnitario,
          frete: 0,
          impostos: resultado.margem,
          moedaOrigem: 'BRL',
          moedaDestino: 'BRL',
          taxaCambio: 1,
          valorTotal: resultado.subtotal,
          valorFinal: resultado.total,
          data: dataAtual
        };
      } else if (activeTab === 'frete') {
        const resultado = calcularFrete();
        novoCalculo = {
          tipo: 'frete',
          produto: `Frete ${freteData.tipoTransporte}`,
          quantidade: freteData.peso,
          precoUnitario: 0,
          frete: resultado.total,
          impostos: resultado.custoSeguro,
          moedaOrigem: 'BRL',
          moedaDestino: 'BRL',
          taxaCambio: 1,
          valorTotal: resultado.tarifaBase,
          valorFinal: resultado.total,
          data: dataAtual
        };
      } else {
        const resultado = calcularConversao();
        novoCalculo = {
          tipo: 'moeda',
          produto: 'Conversão de Moeda',
          quantidade: 1,
          precoUnitario: resultado.valorOriginal,
          frete: 0,
          impostos: 0,
          moedaOrigem: moedaData.moedaOrigem,
          moedaDestino: moedaData.moedaDestino,
          taxaCambio: resultado.taxa,
          valorTotal: resultado.valorOriginal,
          valorFinal: resultado.valorConvertido,
          data: dataAtual
        };
      }

      // Salvar no Firebase
      const novoId = await salvarCalculo(novoCalculo);
      
      // Adicionar à lista local
      const calculoComId: CalculationHistory = {
        id: novoId,
        ...novoCalculo
      };
      
      setHistorico(prev => [calculoComId, ...prev]);
      setSavedCalculation(calculoComId);
      setShowSaveModal(true);
      
      setTimeout(() => setShowSaveModal(false), 3000);
      
    } catch (err) {
      console.error('Erro ao salvar cálculo:', err);
      setError('Erro ao salvar cálculo. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const excluirHistorico = async (id: string) => {
    if (confirm('Excluir este cálculo do histórico?')) {
      // Remover apenas da lista local (não do Firebase para manter histórico)
      setHistorico(prev => prev.filter(item => item.id !== id));
    }
  };

  const copiarResultado = (calculo: CalculationHistory) => {
    const texto = `${calculo.tipo.toUpperCase()}: ${calculo.produto} - Valor Final: R$ ${calculo.valorFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    navigator.clipboard.writeText(texto);
    alert('Resultado copiado!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 shadow-xl border-b border-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 space-y-4 sm:space-y-0">
            
            <div className="flex items-center">
              <button
                onClick={() => window.location.href = '/admin/dashboard'}
                className="flex items-center text-white hover:text-emerald-400 mr-4 sm:mr-6 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="text-base font-semibold">Dashboard</span>
              </button>
              
              <img
                src="/images/terracriarLogo.png"
                alt="TerraCriar"
                className="h-8 sm:h-10 w-auto filter brightness-0 invert opacity-90 mr-3 sm:mr-4"
              />
              <div className="hidden sm:block">
                <h1 className="text-white text-lg sm:text-xl font-bold">Calculadora</h1>
                <p className="text-slate-300 text-xs sm:text-sm">Cálculos com Firebase integrado</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              {/* Título mobile */}
              <div className="sm:hidden">
                <h1 className="text-white text-lg font-bold">Calculadora</h1>
                <p className="text-slate-300 text-xs">Firebase integrado</p>
              </div>
              
              {isLoading ? (
                <div className="flex items-center text-white">
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  <span className="text-sm sm:text-base font-medium">Carregando...</span>
                </div>
              ) : (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="bg-violet-600 hover:bg-violet-700 text-white px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl transition-colors flex items-center text-sm sm:text-base font-semibold"
                >
                  <History className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Histórico ({historico.length})</span>
                  <span className="sm:hidden">({historico.length})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modal de Sucesso */}
      {showSaveModal && savedCalculation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Cálculo Salvo no Firebase!</h3>
              <p className="text-slate-600 mb-4">
                {savedCalculation.produto} - R$ {savedCalculation.valorFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mensagem de Erro */}
      {error && (
        <div className="fixed top-20 right-4 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl shadow-lg z-50 flex items-center">
          <AlertCircle className="h-5 w-5 mr-3" />
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-3 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid ${showHistory ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-8`}>
          
          {/* Calculadora */}
          <div className={`${showHistory ? 'lg:col-span-2' : ''}`}>
            
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 mb-8">
              <div className="flex border-b border-slate-200">
                {[
                  { key: 'preco', label: 'Preços', icon: DollarSign, color: 'emerald' },
                  { key: 'frete', label: 'Frete', icon: Truck, color: 'violet' },
                  { key: 'moeda', label: 'Moedas', icon: Globe, color: 'slate' }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}//eslint-disable-next-line
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`flex-1 flex items-center justify-center py-4 px-6 font-semibold transition-all ${
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

            {/* Calculadora de Preços */}
            {activeTab === 'preco' && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                <div className="flex items-center mb-8">
                  <div className="bg-emerald-100 p-3 rounded-xl mr-4">
                    <DollarSign className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Cálculo de Preços</h2>
                    <p className="text-slate-600">Calcule preços com margem e descontos</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Produto *
                      </label>
                      <select
                        value={precoData.produto}
                        onChange={(e) => setPrecoData({...precoData, produto: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all text-slate-800"
                        disabled={isSaving}
                      >
                        <option value="">Selecione o produto</option>
                        {produtos.map(produto => (
                          <option key={produto} value={produto}>{produto}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Quantidade (kg)
                        </label>
                        <input
                          type="number"
                          value={precoData.quantidade}
                          onChange={(e) => setPrecoData({...precoData, quantidade: Number(e.target.value)})}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all text-slate-800"
                          placeholder="1000"
                          disabled={isSaving}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Preço/kg (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={precoData.precoUnitario}
                          onChange={(e) => setPrecoData({...precoData, precoUnitario: Number(e.target.value)})}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all text-slate-800"
                          placeholder="12.50"
                          disabled={isSaving}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Margem (%)
                        </label>
                        <input
                          type="number"
                          value={precoData.margem}
                          onChange={(e) => setPrecoData({...precoData, margem: Number(e.target.value)})}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all text-slate-800"
                          placeholder="15"
                          disabled={isSaving}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Desconto (%)
                        </label>
                        <input
                          type="number"
                          value={precoData.desconto}
                          onChange={(e) => setPrecoData({...precoData, desconto: Number(e.target.value)})}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all text-slate-800"
                          placeholder="0"
                          disabled={isSaving}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Resultado */}
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200">
                    <h3 className="text-lg font-bold text-emerald-800 mb-6">Resultado do Cálculo</h3>
                    
                    {precoData.quantidade > 0 && precoData.precoUnitario > 0 ? (
                      <div className="space-y-4">
                        {(() => {
                          const resultado = calcularPreco();
                          return (
                            <>
                              <div className="flex justify-between items-center py-2 border-b border-emerald-200">
                                <span className="text-emerald-700">Subtotal:</span>
                                <span className="font-bold text-emerald-800">
                                  R$ {resultado.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                              </div>
                              
                              <div className="flex justify-between items-center py-2 border-b border-emerald-200">
                                <span className="text-emerald-700">Margem ({precoData.margem}%):</span>
                                <span className="font-bold text-emerald-600">
                                  + R$ {resultado.margem.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                              </div>
                              
                              {precoData.desconto > 0 && (
                                <div className="flex justify-between items-center py-2 border-b border-emerald-200">
                                  <span className="text-emerald-700">Desconto ({precoData.desconto}%):</span>
                                  <span className="font-bold text-red-600">
                                    - R$ {resultado.desconto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </span>
                                </div>
                              )}
                              
                              <div className="flex justify-between items-center py-3 bg-emerald-200 rounded-xl px-4">
                                <span className="text-emerald-800 font-bold text-lg">TOTAL:</span>
                                <span className="font-bold text-emerald-900 text-2xl">
                                  R$ {resultado.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calculator className="h-16 w-16 text-emerald-300 mx-auto mb-4" />
                        <p className="text-emerald-600">Preencha os dados para ver o cálculo</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={salvarCalculoFirebase}
                    disabled={!precoData.produto || precoData.quantidade <= 0 || precoData.precoUnitario <= 0 || isSaving}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <Loader className="h-5 w-5 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Salvar no Firebase
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Calculadora de Frete */}
            {activeTab === 'frete' && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                <div className="flex items-center mb-8">
                  <div className="bg-violet-100 p-3 rounded-xl mr-4">
                    <Truck className="h-8 w-8 text-violet-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Cálculo de Frete</h2>
                    <p className="text-slate-600">Calcule custos de transporte e logística</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Peso (kg)
                        </label>
                        <input
                          type="number"
                          value={freteData.peso}
                          onChange={(e) => setFreteData({...freteData, peso: Number(e.target.value)})}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition-all text-slate-800"
                          placeholder="1000"
                          disabled={isSaving}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Distância (km)
                        </label>
                        <input
                          type="number"
                          value={freteData.distancia}
                          onChange={(e) => setFreteData({...freteData, distancia: Number(e.target.value)})}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition-all text-slate-800"
                          placeholder="8500"
                          disabled={isSaving}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Tipo de Transporte
                      </label>
                      <select
                        value={freteData.tipoTransporte}
                        onChange={(e) => setFreteData({...freteData, tipoTransporte: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition-all text-slate-800"
                        disabled={isSaving}
                      >
                        <option value="maritimo">Marítimo (R$ 0,50/kg)</option>
                        <option value="aereo">Aéreo (R$ 2,80/kg)</option>
                        <option value="rodoviario">Rodoviário (R$ 1,20/kg)</option>
                        <option value="ferroviario">Ferroviário (R$ 0,80/kg)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Valor da Carga (R$)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={freteData.valorCarga}
                        onChange={(e) => setFreteData({...freteData, valorCarga: Number(e.target.value)})}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition-all text-slate-800"
                        placeholder="50000.00"
                        disabled={isSaving}
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="seguro"
                        checked={freteData.seguro}
                        onChange={(e) => setFreteData({...freteData, seguro: e.target.checked})}
                        className="mr-3 rounded border-slate-300 text-violet-600 focus:ring-violet-600"
                        disabled={isSaving}
                      />
                      <label htmlFor="seguro" className="text-slate-700 font-medium">
                        Incluir seguro (2% do valor da carga)
                      </label>
                    </div>
                  </div>

                  {/* Resultado Frete */}
                  <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-2xl p-6 border border-violet-200">
                    <h3 className="text-lg font-bold text-violet-800 mb-6">Resultado do Frete</h3>
                    
                    {freteData.peso > 0 && freteData.distancia > 0 ? (
                      <div className="space-y-4">
                        {(() => {
                          const resultado = calcularFrete();
                          return (
                            <>
                              <div className="flex justify-between items-center py-2 border-b border-violet-200">
                                <span className="text-violet-700">Tarifa Base:</span>
                                <span className="font-bold text-violet-800">
                                  R$ {resultado.tarifaBase.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                              </div>
                              
                              <div className="flex justify-between items-center py-2 border-b border-violet-200">
                                <span className="text-violet-700">Custo Distância:</span>
                                <span className="font-bold text-violet-800">
                                  R$ {resultado.custoDistancia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                              </div>
                              
                              {freteData.seguro && (
                                <div className="flex justify-between items-center py-2 border-b border-violet-200">
                                  <span className="text-violet-700">Seguro (2%):</span>
                                  <span className="font-bold text-violet-800">
                                    R$ {resultado.custoSeguro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </span>
                                </div>
                              )}
                              
                              <div className="flex justify-between items-center py-3 bg-violet-200 rounded-xl px-4">
                                <span className="text-violet-800 font-bold text-lg">TOTAL FRETE:</span>
                                <span className="font-bold text-violet-900 text-2xl">
                                  R$ {resultado.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Truck className="h-16 w-16 text-violet-300 mx-auto mb-4" />
                        <p className="text-violet-600">Preencha os dados para calcular o frete</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={salvarCalculoFirebase}
                    disabled={freteData.peso <= 0 || freteData.distancia <= 0 || isSaving}
                    className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <Loader className="h-5 w-5 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Salvar no Firebase
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Conversor de Moedas */}
            {activeTab === 'moeda' && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                <div className="flex items-center mb-8">
                  <div className="bg-slate-100 p-3 rounded-xl mr-4">
                    <Globe className="h-8 w-8 text-slate-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Conversor de Moedas</h2>
                    <p className="text-slate-600">Conversão para cotações internacionais</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Valor a Converter
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={moedaData.valor}
                        onChange={(e) => setMoedaData({...moedaData, valor: Number(e.target.value)})}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-600 focus:border-slate-600 transition-all text-slate-800"
                        placeholder="1000.00"
                        disabled={isSaving}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          De
                        </label>
                        <select
                          value={moedaData.moedaOrigem}
                          onChange={(e) => setMoedaData({...moedaData, moedaOrigem: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-600 focus:border-slate-600 transition-all text-slate-800"
                          disabled={isSaving}
                        >
                          {Object.entries(taxasCambio).map(([codigo, info]) => (
                            <option key={codigo} value={codigo}>
                              {codigo} - {info.nome}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Para
                        </label>
                        <select
                          value={moedaData.moedaDestino}
                          onChange={(e) => setMoedaData({...moedaData, moedaDestino: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-600 focus:border-slate-600 transition-all text-slate-800"
                          disabled={isSaving}
                        >
                          {Object.entries(taxasCambio).map(([codigo, info]) => (
                            <option key={codigo} value={codigo}>
                              {codigo} - {info.nome}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Taxa Personalizada (opcional)
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        value={moedaData.taxaPersonalizada}
                        onChange={(e) => setMoedaData({...moedaData, taxaPersonalizada: Number(e.target.value)})}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-600 focus:border-slate-600 transition-all text-slate-800"
                        placeholder="5.2000"
                        disabled={isSaving}
                      />
                      <p className="text-xs text-slate-500 mt-2">
                        Deixe em branco para usar taxa automática
                      </p>
                    </div>

                    {/* Taxas Atuais */}
                    <div className="bg-slate-50 rounded-xl p-4">
                      <h4 className="font-bold text-slate-700 mb-3 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Taxas de Câmbio (BRL)
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(taxasCambio).map(([codigo, info]) => (
                          <div key={codigo} className="flex justify-between">
                            <span className="text-slate-600">{codigo}:</span>
                            <span className="font-medium text-slate-800">{info.taxa.toFixed(4)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Resultado Conversão */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Resultado da Conversão</h3>
                    
                    {moedaData.valor > 0 ? (
                      <div className="space-y-6">
                        {(() => {
                          const resultado = calcularConversao();
                          return (
                            <>
                              <div className="text-center">
                                <div className="bg-white rounded-xl p-6 border border-slate-200 mb-4">
                                  <p className="text-slate-600 text-sm mb-2">Valor Original</p>
                                  <p className="text-3xl font-bold text-slate-800">
                                    {resultado.simboloOrigem} {resultado.valorOriginal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </p>
                                  <p className="text-xs text-slate-500 mt-1">{moedaData.moedaOrigem}</p>
                                </div>

                                <div className="flex justify-center mb-4">
                                  <div className="bg-slate-200 p-3 rounded-full">
                                    <ArrowUpDown className="h-6 w-6 text-slate-600" />
                                  </div>
                                </div>

                                <div className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl p-6">
                                  <p className="text-slate-200 text-sm mb-2">Valor Convertido</p>
                                  <p className="text-3xl font-bold">
                                    {resultado.simboloDestino} {resultado.valorConvertido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </p>
                                  <p className="text-xs text-slate-300 mt-1">{moedaData.moedaDestino}</p>
                                </div>
                              </div>

                              <div className="bg-white rounded-xl p-4 border border-slate-200">
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-600 text-sm">Taxa Aplicada:</span>
                                  <span className="font-bold text-slate-800">
                                    {resultado.taxa.toFixed(4)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-slate-600 text-sm">
                                    1 {moedaData.moedaOrigem} =
                                  </span>
                                  <span className="font-medium text-slate-800">
                                    {resultado.taxa.toFixed(4)} {moedaData.moedaDestino}
                                  </span>
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Globe className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-600">Digite um valor para converter</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      const temp = moedaData.moedaOrigem;
                      setMoedaData({
                        ...moedaData,
                        moedaOrigem: moedaData.moedaDestino,
                        moedaDestino: temp
                      });
                    }}
                    disabled={isSaving}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-3 rounded-xl transition-colors flex items-center disabled:opacity-50"
                  >
                    <ArrowUpDown className="h-5 w-5 mr-2" />
                    Inverter
                  </button>

                  <button
                    onClick={salvarCalculoFirebase}
                    disabled={moedaData.valor <= 0 || isSaving}
                    className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-xl transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <Loader className="h-5 w-5 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Salvar no Firebase
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Histórico Firebase */}
          {showHistory && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center">
                  <History className="h-6 w-6 mr-2 text-emerald-600" />
                  Histórico Firebase
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={carregarHistorico}
                    disabled={isLoading}
                    className="text-slate-600 hover:text-emerald-600 p-2 rounded-lg transition-colors"
                  >
                    <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="text-slate-400 hover:text-slate-600 p-2"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="text-center py-8">
                    <Loader className="h-8 w-8 text-emerald-600 mx-auto mb-4 animate-spin" />
                    <p className="text-slate-600">Carregando histórico do Firebase...</p>
                  </div>
                ) : historico.length > 0 ? (
                  historico.map((item) => (
                    <div key={item.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all group">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              item.tipo === 'preco' ? 'bg-emerald-100 text-emerald-700' :
                              item.tipo === 'frete' ? 'bg-violet-100 text-violet-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {item.tipo.toUpperCase()}
                            </span>
                            <span className="text-xs text-slate-500 ml-2">{item.data}</span>
                          </div>
                          <h4 className="font-semibold text-slate-800">{item.produto}</h4>
                          {item.cliente && (
                            <p className="text-sm text-slate-600">{item.cliente}</p>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-bold text-slate-800">
                            R$ {item.valorFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                          {item.tipo === 'moeda' && (
                            <p className="text-xs text-slate-500">
                              {item.moedaOrigem} → {item.moedaDestino}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="text-sm text-slate-600">
                          {item.tipo === 'preco' && `${item.quantidade}kg × R${item.precoUnitario}`}
                          {item.tipo === 'frete' && `${item.quantidade}kg - Frete`}
                          {item.tipo === 'moeda' && `Taxa: ${item.taxaCambio.toFixed(4)}`}
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => copiarResultado(item)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-1 rounded transition-colors"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => excluirHistorico(item.id!)}
                            className="bg-red-100 hover:bg-red-200 text-red-600 p-1 rounded transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <History className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600">Nenhum cálculo salvo no Firebase ainda</p>
                    <p className="text-slate-500 text-sm mt-2">Faça um cálculo e salve para ver o histórico</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}