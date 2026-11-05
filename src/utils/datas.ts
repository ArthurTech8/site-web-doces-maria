// Converte uma data em texto no formato "AAAA-MM" (ex.: "2026-11").
// Usa o fuso horário local para uma venda às 22h do dia 31 não cair no mês seguinte
export function chaveDoMes(data: Date): string {
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  return `${data.getFullYear()}-${mes}`
}
