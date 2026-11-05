import api from './api'
import type { GastoFixo, NovoGastoFixo } from '@/interfaces/GastoFixo'

export async function listarGastosFixos(): Promise<GastoFixo[]> {
  const resposta = await api.get<GastoFixo[]>('/gastosFixos')
  return resposta.data
}

export async function criarGastoFixo(gasto: NovoGastoFixo): Promise<GastoFixo> {
  const resposta = await api.post<GastoFixo>('/gastosFixos', gasto)
  return resposta.data
}

export async function atualizarGastoFixo(gasto: GastoFixo): Promise<GastoFixo> {
  const resposta = await api.put<GastoFixo>(`/gastosFixos/${gasto.id}`, gasto)
  return resposta.data
}

export async function excluirGastoFixo(id: string): Promise<void> {
  await api.delete(`/gastosFixos/${id}`)
}
