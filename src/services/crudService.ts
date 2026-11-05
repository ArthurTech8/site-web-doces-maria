import api from './api'

// Operações padrão de um recurso da API.
// T = registro salvo (com id) | N = registro novo (sem id)
export interface ServicoCrud<T, N> {
  listar(): Promise<T[]>
  criar(novo: N): Promise<T>
  atualizar(item: T): Promise<T>
  excluir(id: string): Promise<void>
}

// Cria as operações de CRUD para um recurso, ex.: criarServicoCrud<Produto, NovoProduto>('/produtos')
export function criarServicoCrud<T extends { id: string }, N>(recurso: string): ServicoCrud<T, N> {
  return {
    async listar() {
      const resposta = await api.get<T[]>(recurso)
      return resposta.data
    },

    async criar(novo) {
      const resposta = await api.post<T>(recurso, novo)
      return resposta.data
    },

    async atualizar(item) {
      const resposta = await api.put<T>(`${recurso}/${item.id}`, item)
      return resposta.data
    },

    async excluir(id) {
      await api.delete(`${recurso}/${id}`)
    },
  }
}
