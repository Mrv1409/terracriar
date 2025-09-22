/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Save,
  Trash2,
  Search,
  Plus,
  Edit3,
  Eye,
  MapPin,
  DollarSign,
  Calendar,
  Package,
  User,
  Building,
  Mail,
  Phone,
  Check,
  X,
  AlertCircle,
  Users,
  Filter,
  Loader
} from 'lucide-react';

// Importar funções do Firebase
import { 
  criarCliente, 
  buscarClientes, 
  atualizarCliente, 
  deletarCliente,
  buscarClientePorEmail,
  Cliente
} from '@/lib/firestore';

export default function CadastroClientesFirebase() {
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    empresa: '',
    email: '',
    telefone: '',
    pais: '',
    valorCompra: '',
    dataEntrega: '',
    produtoVendido: '',
    status: 'ativo' as 'ativo' | 'inativo' | 'pendente'
  });

  // Estado para clientes do Firebase
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);

  const produtos = [
    'Uva Premium',
    'Manga Tropical', 
    'Melão Doce',
    'Coco Fresco',
    'Mix de Produtos'
  ];

  const paises = [
    'Alemanha', 'França', 'Reino Unido', 'Espanha', 'Itália',
    'EUA', 'Canadá', 'Emirados Árabes', 'Arábia Saudita',
    'Japão', 'Singapura', 'Hong Kong', 'Austrália'
  ];

  // Carregar clientes do Firebase
  const carregarClientes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const clientesFirebase = await buscarClientes();
      setClientes(clientesFirebase);
    } catch (err) {
      console.error('Erro ao carregar clientes:', err);
      setError('Erro ao carregar clientes. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar clientes baseado na busca e status
  useEffect(() => {
    let resultado = clientes;

    // Filtrar por termo de busca
    if (searchTerm) {
      resultado = resultado.filter(cliente =>
        cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por status
    if (filterStatus !== 'todos') {
      resultado = resultado.filter(cliente => cliente.status === filterStatus);
    }

    setFilteredClientes(resultado);
  }, [clientes, searchTerm, filterStatus]);

  // Carregar clientes quando o componente montar
  useEffect(() => {
    carregarClientes();
  }, []);

  const handleSubmit = async () => {
    if (!formData.nome || !formData.empresa || !formData.email) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Verificar se email já existe (apenas para novos clientes)
      if (!editingClient) {
        const clienteExistente = await buscarClientePorEmail(formData.email);
        if (clienteExistente) {
          setError('Já existe um cliente cadastrado com este e-mail');
          setIsSubmitting(false);
          return;
        }
      }

      if (editingClient) {
        // Atualizar cliente existente
        await atualizarCliente(editingClient.id!, formData);
        
        // Atualizar lista local
        setClientes(prev => prev.map(client => 
          client.id === editingClient.id 
            ? { ...client, ...formData }
            : client
        ));
      } else {
        // Criar novo cliente
        const novoClienteData = {
          ...formData,
          dataCadastro: new Date().toISOString().split('T')[0]
        };
        
        const novoId = await criarCliente(novoClienteData);
        
        // Adicionar à lista local
        const novoCliente: Cliente = {
          id: novoId,
          ...novoClienteData
        };
        setClientes(prev => [novoCliente, ...prev]);
      }

      setShowSuccess(true);
      resetForm();
      
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Erro ao salvar cliente:', err);
      setError('Erro ao salvar cliente. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '', empresa: '', email: '', telefone: '', pais: '',
      valorCompra: '', dataEntrega: '', produtoVendido: '', status: 'ativo'
    });
    setShowForm(false);
    setEditingClient(null);
    setError(null);
  };

  const handleEdit = (cliente: Cliente) => {
    setFormData({
      nome: cliente.nome,
      empresa: cliente.empresa,
      email: cliente.email,
      telefone: cliente.telefone,
      pais: cliente.pais,
      valorCompra: cliente.valorCompra,
      dataEntrega: cliente.dataEntrega,
      produtoVendido: cliente.produtoVendido,
      status: cliente.status
    });
    setEditingClient(cliente);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return;

    try {
      await deletarCliente(id);
      
      // Remover da lista local
      setClientes(prev => prev.filter(client => client.id !== id));
      
    } catch (err) {
      console.error('Erro ao deletar cliente:', err);
      setError('Erro ao excluir cliente. Tente novamente.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pendente': return 'bg-violet-100 text-violet-700 border-violet-200';
      case 'inativo': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
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
                Dashboard
              </button>
              
              <img
                src="/images/terracriarLogo.png"
                alt="TerraCriar"
                className="h-10 w-auto filter brightness-0 invert opacity-90 mr-4"
              />
              <div>
                <h1 className="text-white text-xl font-bold">Cadastro de Clientes</h1>
                <p className="text-slate-300 text-sm">Gestão de clientes TerraCriar - Firebase</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {isLoading ? (
                <div className="flex items-center text-white">
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Carregando...
                </div>
              ) : (
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cliente
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mensagens */}
      {showSuccess && (
        <div className="fixed top-20 right-4 bg-emerald-100 border border-emerald-400 text-emerald-700 px-6 py-4 rounded-xl shadow-lg z-50 flex items-center">
          <Check className="h-5 w-5 mr-3" />
          Cliente salvo com sucesso!
        </div>
      )}

      {error && (
        <div className="fixed top-20 right-4 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl shadow-lg z-50 flex items-center">
          <AlertCircle className="h-5 w-5 mr-3" />
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-3 text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {showForm ? (
          /* Formulário */
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
                </h2>
                <p className="text-slate-600">
                  {editingClient ? 'Atualize as informações do cliente' : 'Preencha os dados do novo cliente'}
                </p>
              </div>
              <button
                onClick={resetForm}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                disabled={isSubmitting}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-8">
              
              {/* Dados Pessoais */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                  <User className="h-5 w-5 mr-3 text-emerald-600" />
                  Dados Pessoais
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all text-slate-800 placeholder:text-slate-400"
                      placeholder="Nome do responsável"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Empresa *
                    </label>
                    <input
                      type="text"
                      value={formData.empresa}
                      onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all text-slate-800 placeholder:text-slate-400"
                      placeholder="Nome da empresa"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Contato */}
              <div className="bg-violet-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-violet-600" />
                  Informações de Contato
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition-all text-slate-800 placeholder:text-slate-400"
                      placeholder="email@empresa.com"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition-all text-slate-800 placeholder:text-slate-400"
                      placeholder="+55 87 9999-9999"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      País *
                    </label>
                    <select
                      value={formData.pais}
                      onChange={(e) => setFormData({...formData, pais: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-600 focus:border-violet-600 transition-all text-slate-800"
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">Selecione o país</option>
                      {paises.map(pais => (
                        <option key={pais} value={pais}>{pais}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Dados Comerciais */}
              <div className="bg-emerald-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                  <DollarSign className="h-5 w-5 mr-3 text-emerald-600" />
                  Informações Comerciais
                </h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Valor da Compra *
                    </label>
                    <input
                      type="text"
                      value={formData.valorCompra}
                      onChange={(e) => setFormData({...formData, valorCompra: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all text-slate-800 placeholder:text-slate-400"
                      placeholder="R$ 00.000"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Data de Entrega *
                    </label>
                    <input
                      type="date"
                      value={formData.dataEntrega}
                      onChange={(e) => setFormData({...formData, dataEntrega: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all text-slate-800"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Produto Vendido *
                    </label>
                    <select
                      value={formData.produtoVendido}
                      onChange={(e) => setFormData({...formData, produtoVendido: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all text-slate-800"
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">Selecione o produto</option>
                      {produtos.map(produto => (
                        <option key={produto} value={produto}>{produto}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-3 text-slate-600" />
                  Status do Cliente
                </h3>
                
                <div className="flex space-x-4">
                  {[
                    { value: 'ativo', label: 'Ativo', color: 'emerald' },
                    { value: 'pendente', label: 'Pendente', color: 'violet' },
                    { value: 'inativo', label: 'Inativo', color: 'slate' }
                  ].map(status => (
                    <label key={status.value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value={status.value}
                        checked={formData.status === status.value}//eslint-disable-next-line
                        onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                        className={`mr-3 text-${status.color}-600 focus:ring-${status.color}-600`}
                        disabled={isSubmitting}
                      />
                      <span className="text-slate-700 font-medium">{status.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Botões */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-xl transition-colors flex items-center disabled:opacity-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </button>
                
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl transition-colors flex items-center disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin h-4 w-4 mr-3" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingClient ? 'Atualizar Cliente' : 'Salvar Cliente'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Lista de Clientes */
          <>
            {/* Filtros */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Buscar clientes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-slate-800 placeholder:text-slate-400"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-slate-400" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-slate-800"
                      disabled={isLoading}
                    >
                      <option value="todos">Todos</option>
                      <option value="ativo">Ativos</option>
                      <option value="pendente">Pendentes</option>
                      <option value="inativo">Inativos</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="text-slate-600 font-medium">
                    {isLoading ? 'Carregando...' : `${filteredClientes.length} cliente${filteredClientes.length !== 1 ? 's' : ''}`}
                  </span>
                  <button
                    onClick={() => setShowForm(true)}
                    disabled={isLoading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Cliente
                  </button>
                  <button
                    onClick={carregarClientes}
                    disabled={isLoading}
                    className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="text-center py-16">
                <Loader className="h-12 w-12 text-emerald-600 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-bold text-slate-600 mb-2">Carregando clientes...</h3>
                <p className="text-slate-500">Conectando com Firebase</p>
              </div>
            )}

            {/* Lista */}
            {!isLoading && (
              <div className="grid gap-6">
                {filteredClientes.map((cliente) => (
                  <div key={cliente.id} className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 hover:shadow-xl transition-all group">
                    <div className="flex items-start justify-between">
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-1">{cliente.nome}</h3>
                            <p className="text-emerald-600 font-semibold mb-2 flex items-center">
                              <Building className="h-4 w-4 mr-2" />
                              {cliente.empresa}
                            </p>
                          </div>
                          
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(cliente.status)}`}>
                            {cliente.status.charAt(0).toUpperCase() + cliente.status.slice(1)}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                          <div className="flex items-center text-slate-600">
                            <Mail className="h-4 w-4 mr-2 text-violet-600" />
                            <span className="text-sm">{cliente.email}</span>
                          </div>
                          
                          <div className="flex items-center text-slate-600">
                            <Phone className="h-4 w-4 mr-2 text-emerald-600" />
                            <span className="text-sm">{cliente.telefone}</span>
                          </div>
                          
                          <div className="flex items-center text-slate-600">
                            <MapPin className="h-4 w-4 mr-2 text-slate-600" />
                            <span className="text-sm">{cliente.pais}</span>
                          </div>
                          
                          <div className="flex items-center text-slate-600">
                            <Calendar className="h-4 w-4 mr-2 text-violet-600" />
                            <span className="text-sm">{new Date(cliente.dataEntrega).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1 text-emerald-600" />
                              <span className="font-bold text-emerald-600">{cliente.valorCompra}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <Package className="h-4 w-4 mr-1 text-slate-600" />
                              <span className="text-slate-600 text-sm">{cliente.produtoVendido}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-lg transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleEdit(cliente)}
                              className="bg-violet-100 hover:bg-violet-200 text-violet-600 p-2 rounded-lg transition-colors"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(cliente.id!)}
                              className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Estado Vazio */}
            {!isLoading && filteredClientes.length === 0 && (
              <div className="text-center py-16">
                <Users className="h-24 w-24 text-slate-300 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-slate-600 mb-2">
                  {searchTerm || filterStatus !== 'todos' ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
                </h3>
                <p className="text-slate-500 mb-6">
                  {searchTerm || filterStatus !== 'todos' 
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece adicionando o primeiro cliente no Firebase'
                  }
                </p>
                {!searchTerm && filterStatus === 'todos' && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl transition-colors flex items-center mx-auto"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Cadastrar Primeiro Cliente
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}