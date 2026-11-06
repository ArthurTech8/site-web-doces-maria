import type { Novo, Registro } from './Registro'

export interface Produto extends Registro {
  nome: string
  precoVenda: number
  precoCusto: number
}

export type NovoProduto = Novo<Produto>
