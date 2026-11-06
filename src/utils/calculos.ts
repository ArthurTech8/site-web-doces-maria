import type { ItemVenda, Produto } from '@/interfaces'

// Soma um valor de cada item da lista, ex.: somar(gastos, g => g.valor)
export function somar<T>(lista: T[], valor: (item: T) => number): number {
  return lista.reduce((soma, item) => soma + valor(item), 0)
}

// Só os preços de um produto. Permite calcular antes do produto ser salvo (ex.: no formulário)
type Precos = Pick<Produto, 'precoVenda' | 'precoCusto'>

export function calcularLucroUnitario(produto: Precos): number {
  return produto.precoVenda - produto.precoCusto
}

// Percentual do preço de venda que é lucro
export function calcularMargem(produto: Precos): number {
  if (produto.precoVenda === 0) return 0
  return (calcularLucroUnitario(produto) / produto.precoVenda) * 100
}

export function calcularTotalItens(itens: ItemVenda[]): number {
  return somar(itens, item => item.produto.precoVenda * item.quantidade)
}

export function calcularCustoItens(itens: ItemVenda[]): number {
  return somar(itens, item => item.produto.precoCusto * item.quantidade)
}
