import api from './api'
import type { Novo, Registro } from '@/interfaces'

// Operações padrão de um recurso da API.
// Nenhum registro é apagado: "inativar" marca ativo = false e "listar" não devolve inativos.
export interface ServicoCrud<T extends Registro> {
  listar(): Promise<T[]>
  criar(novo: Novo<T>): Promise<T>
  atualizar(item: T): Promise<T>
  inativar(id: string): Promise<void>
}

// Cria as operações de CRUD para um recurso, ex.: criarServicoCrud<Produto>('/produtos')
export function criarServicoCrud<T extends Registro>(recurso: string): ServicoCrud<T> {
  return {
    async listar() {
      const resposta = await api.get<T[]>(recurso)
      // Registros sem o campo "ativo" (criados antes dessa regra) contam como ativos
      return resposta.data.filter(item => item.ativo !== false)
    },

    async criar(novo) {
      const resposta = await api.post<T>(recurso, { ...novo, ativo: true })
      return resposta.data
    },

    async atualizar(item) {
      const resposta = await api.put<T>(`${recurso}/${item.id}`, item)
      return resposta.data
    },

    async inativar(id) {
      await api.patch(`${recurso}/${id}`, { ativo: false })
    },
  }
}
