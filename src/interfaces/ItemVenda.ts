import type { Produto } from './Produto'

// Guarda uma cópia do produto no momento da venda,
// para que mudanças de preço futuras não alterem o histórico
export interface ItemVenda {
  produto: Produto
  quantidade: number
}
