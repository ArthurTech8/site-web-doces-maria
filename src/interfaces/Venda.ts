import type { ItemVenda } from './ItemVenda'

export interface Venda {
  id: string
  data: string // ISO 8601, gerado com new Date().toISOString()
  itens: ItemVenda[]
  total: number
  custoTotal: number
}

export type NovaVenda = Omit<Venda, 'id'>
