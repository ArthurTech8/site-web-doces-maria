// 8 → "R$ 8,00"
export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// 43.75 → "43,8%"
export function formatarPercentual(valor: number): string {
  return `${valor.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`
}

// "2026-11-05T15:00:00.000Z" → "05/11/2026 12:00"
export function formatarDataHora(dataIso: string): string {
  return new Date(dataIso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}
