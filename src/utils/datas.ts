// Converte uma data em texto no formato "AAAA-MM" (ex.: "2026-11").
// Usa o fuso horário local para uma venda às 22h do dia 31 não cair no mês seguinte
export function chaveDoMes(data: Date): string {
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  return `${data.getFullYear()}-${mes}`
}

// Converte uma data em texto no formato "AAAA-MM-DD" (ex.: "2026-11-05"), no fuso horário local
export function chaveDoDia(data: Date): string {
  const dia = String(data.getDate()).padStart(2, '0')
  return `${chaveDoMes(data)}-${dia}`
}

// Cópia da lista ordenada da data mais recente para a mais antiga (campo "data" em ISO)
export function ordenarMaisRecentes<T extends { data: string }>(lista: T[]): T[] {
  return [...lista].sort((a, b) => b.data.localeCompare(a.data))
}
