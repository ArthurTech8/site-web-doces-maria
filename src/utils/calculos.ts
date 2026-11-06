import type { ItemVenda, Produto, Venda } from '@/interfaces'

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

export function calcularSubtotalItem(item: ItemVenda): number {
  return item.produto.precoVenda * item.quantidade
}

export function calcularTotalItens(itens: ItemVenda[]): number {
  return somar(itens, calcularSubtotalItem)
}

export function calcularCustoItens(itens: ItemVenda[]): number {
  return somar(itens, item => item.produto.precoCusto * item.quantidade)
}

export function calcularLucroVenda(venda: Venda): number {
  return venda.total - venda.custoTotal
}

// Quantidade de itens de uma venda (ex.: 10 cupcakes + 2 brigadeiros = 12)
export function calcularQuantidadeVenda(venda: Venda): number {
  return somar(venda.itens, item => item.quantidade)
}

// Quantos itens precisam ser vendidos para gerar um valor de lucro.
// Retorna null quando o lucro por item não é positivo (nunca alcançaria o valor)
export function calcularItensNecessarios(valor: number, lucroPorItem: number): number | null {
  if (lucroPorItem <= 0) return null
  return Math.ceil(valor / lucroPorItem)
}
