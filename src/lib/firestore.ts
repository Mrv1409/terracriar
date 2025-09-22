// src/lib/firestore.ts
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// ===== TIPOS =====
export interface Cliente {
  id?: string;
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  pais: string;
  valorCompra: string;
  dataEntrega: string;
  produtoVendido: string;
  status: 'ativo' | 'inativo' | 'pendente';
  dataCadastro: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// ===== FUNÇÕES PARA CLIENTES =====

// Criar cliente
export const criarCliente = async (clienteData: Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'clientes'), {
      ...clienteData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    console.log('Cliente criado com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    throw error;
  }
};

// Buscar todos os clientes
export const buscarClientes = async (): Promise<Cliente[]> => {
  try {
    const q = query(
      collection(db, 'clientes'), 
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const clientes: Cliente[] = [];
    
    querySnapshot.forEach((doc) => {
      clientes.push({
        id: doc.id,
        ...doc.data()
      } as Cliente);
    });
    
    return clientes;
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    throw error;
  }
};

// Buscar clientes por status
export const buscarClientesPorStatus = async (status: string): Promise<Cliente[]> => {
  try {
    const q = query(
      collection(db, 'clientes'),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const clientes: Cliente[] = [];
    
    querySnapshot.forEach((doc) => {
      clientes.push({
        id: doc.id,
        ...doc.data()
      } as Cliente);
    });
    
    return clientes;
  } catch (error) {
    console.error('Erro ao buscar clientes por status:', error);
    throw error;
  }
};

// Atualizar cliente
export const atualizarCliente = async (id: string, clienteData: Partial<Cliente>) => {
  try {
    const clienteRef = doc(db, 'clientes', id);
    await updateDoc(clienteRef, {
      ...clienteData,
      updatedAt: Timestamp.now()
    });
    
    console.log('Cliente atualizado:', id);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    throw error;
  }
};

// Deletar cliente
export const deletarCliente = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'clientes', id));
    console.log('Cliente deletado:', id);
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    throw error;
  }
};

// Buscar cliente por email (útil para evitar duplicatas)
export const buscarClientePorEmail = async (email: string): Promise<Cliente | null> => {
  try {
    const q = query(
      collection(db, 'clientes'),
      where('email', '==', email)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as Cliente;
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao buscar cliente por email:', error);
    throw error;
  }
};

// ===== FUNÇÕES PARA HISTÓRICO DA CALCULADORA =====

export interface CalculationHistory {
  id?: string;
  tipo: 'preco' | 'frete' | 'moeda';
  produto: string;
  quantidade: number;
  precoUnitario: number;
  frete: number;
  impostos: number;
  moedaOrigem: string;
  moedaDestino: string;
  taxaCambio: number;
  valorTotal: number;
  valorFinal: number;
  data: string;
  cliente?: string;
  createdAt?: Timestamp;
}

// Salvar cálculo no histórico
export const salvarCalculo = async (calculoData: Omit<CalculationHistory, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'historico_calculos'), {
      ...calculoData,
      createdAt: Timestamp.now()
    });
    
    console.log('Cálculo salvo com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao salvar cálculo:', error);
    throw error;
  }
};

// Buscar histórico de cálculos
export const buscarHistoricoCalculos = async (): Promise<CalculationHistory[]> => {
  try {
    const q = query(
      collection(db, 'historico_calculos'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const historico: CalculationHistory[] = [];
    
    querySnapshot.forEach((doc) => {
      historico.push({
        id: doc.id,
        ...doc.data()
      } as CalculationHistory);
    });
    
    return historico;
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    throw error;
  }
};

// ===== FUNÇÕES PARA GESTÃO FINANCEIRA =====

export interface Receita {
  id?: string;
  cliente: string;
  produto: string;
  valor: number;
  data: string;
  mes: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Despesa {
  id?: string;
  tipo: 'frete' | 'fornecedor';
  descricao: string;
  valor: number;
  data: string;
  mes: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Criar receita
export const criarReceita = async (receitaData: Omit<Receita, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'receitas'), {
      ...receitaData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    console.log('Receita criada com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar receita:', error);
    throw error;
  }
};

// Buscar receitas
export const buscarReceitas = async (): Promise<Receita[]> => {
  try {
    const q = query(
      collection(db, 'receitas'),
      orderBy('data', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const receitas: Receita[] = [];
    
    querySnapshot.forEach((doc) => {
      receitas.push({
        id: doc.id,
        ...doc.data()
      } as Receita);
    });
    
    return receitas;
  } catch (error) {
    console.error('Erro ao buscar receitas:', error);
    throw error;
  }
};

// Atualizar receita
export const atualizarReceita = async (id: string, receitaData: Partial<Receita>) => {
  try {
    const receitaRef = doc(db, 'receitas', id);
    await updateDoc(receitaRef, {
      ...receitaData,
      updatedAt: Timestamp.now()
    });
    
    console.log('Receita atualizada:', id);
  } catch (error) {
    console.error('Erro ao atualizar receita:', error);
    throw error;
  }
};

// Deletar receita
export const deletarReceita = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'receitas', id));
    console.log('Receita deletada:', id);
  } catch (error) {
    console.error('Erro ao deletar receita:', error);
    throw error;
  }
};

// Criar despesa
export const criarDespesa = async (despesaData: Omit<Despesa, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'despesas'), {
      ...despesaData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    console.log('Despesa criada com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao criar despesa:', error);
    throw error;
  }
};

// Buscar despesas
export const buscarDespesas = async (): Promise<Despesa[]> => {
  try {
    const q = query(
      collection(db, 'despesas'),
      orderBy('data', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const despesas: Despesa[] = [];
    
    querySnapshot.forEach((doc) => {
      despesas.push({
        id: doc.id,
        ...doc.data()
      } as Despesa);
    });
    
    return despesas;
  } catch (error) {
    console.error('Erro ao buscar despesas:', error);
    throw error;
  }
};

// Atualizar despesa
export const atualizarDespesa = async (id: string, despesaData: Partial<Despesa>) => {
  try {
    const despesaRef = doc(db, 'despesas', id);
    await updateDoc(despesaRef, {
      ...despesaData,
      updatedAt: Timestamp.now()
    });
    
    console.log('Despesa atualizada:', id);
  } catch (error) {
    console.error('Erro ao atualizar despesa:', error);
    throw error;
  }
};

// Deletar despesa
export const deletarDespesa = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'despesas', id));
    console.log('Despesa deletada:', id);
  } catch (error) {
    console.error('Erro ao deletar despesa:', error);
    throw error;
  }
};