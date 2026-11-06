import type { ItemVenda } from './ItemVenda'
import type { Novo, Registro } from './Registro'

export interface Venda extends Registro {
  data: string // ISO 8601, gerado com new Date().toISOString()
  itens: ItemVenda[]
  total: number
  custoTotal: number
}

export type NovaVenda = Novo<Venda>
