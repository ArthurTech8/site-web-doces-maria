import type { ItemVenda } from './ItemVenda'

export interface Venda {
  id: string
  data: string
  itens: ItemVenda[]
  total: number
  custoTotal: number
}

export type NovaVenda = Omit<Venda, 'id'>