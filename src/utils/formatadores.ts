import type { ItemVenda } from '@/interfaces'

// 8 → "R$ 8,00"
export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// 43.75 → "43,8%"
export function formatarPercentual(valor: number): string {
  return `${valor.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`
}

// "2026-11" → "novembro de 2026"
export function formatarMes(chaveMes: string): string {
  const [ano, mes] = chaveMes.split('-').map(Number)
  if (!ano || !mes) return chaveMes
  return new Date(ano, mes - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

// Itens de uma venda → "10× Cupcake, 2× Brigadeiro"
export function descreverItens(itens: ItemVenda[]): string {
  return itens.map(item => `${item.quantidade}× ${item.produto.nome}`).join(', ')
}

// "2026-11-05T15:00:00.000Z" → "05/11/2026 12:00"
export function formatarDataHora(dataIso: string): string {
  return new Date(dataIso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}
