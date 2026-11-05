import api from './api'
import type { Venda, NovaVenda } from '@/interfaces/Venda'

export async function listarVendas(): Promise<Venda[]> {
  const resposta = await api.get<Venda[]>('/vendas')
  return resposta.data
}

export async function criarVenda(venda: NovaVenda): Promise<Venda> {
  const resposta = await api.post<Venda>('/vendas', venda)
  return resposta.data
}

export async function excluirVenda(id: string): Promise<void> {
  await api.delete(`/vendas/${id}`)
}
