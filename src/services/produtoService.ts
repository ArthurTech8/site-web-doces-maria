import api from './api'
import type { Produto, NovoProduto } from '@/interfaces/Produto'

export async function listarProdutos(): Promise<Produto[]> {
  const resposta = await api.get<Produto[]>('/produtos')
  return resposta.data
}

export async function criarProduto(produto: NovoProduto): Promise<Produto> {
  const resposta = await api.post<Produto>('/produtos', produto)
  return resposta.data
}

export async function atualizarProduto(produto: Produto): Promise<Produto> {
  const resposta = await api.put<Produto>(`/produtos/${produto.id}`, produto)
  return resposta.data
}

export async function excluirProduto(id: string): Promise<void> {
  await api.delete(`/produtos/${id}`)
}
