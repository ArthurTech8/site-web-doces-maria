import { computed } from 'vue'
import { useVendaStore } from '@/store/vendaStore'
import { calcularLucroVenda, calcularQuantidadeVenda, somar } from '@/utils/calculos'
import { chaveDoDia, ordenarMaisRecentes } from '@/utils/datas'

// Indicadores das vendas de um dia (padrão: hoje). A tela precisa carregar a vendaStore.
export function useResumoDoDia(dia: Date = new Date()) {
  const vendaStore = useVendaStore()
  const chave = chaveDoDia(dia)

  const vendasDoDia = computed(() =>
    vendaStore.vendas.filter(venda => chaveDoDia(new Date(venda.data)) === chave)
  )

  const faturamento = computed(() => somar(vendasDoDia.value, venda => venda.total))
  const lucroBruto = computed(() => somar(vendasDoDia.value, calcularLucroVenda))
  const quantidadeVendida = computed(() => somar(vendasDoDia.value, calcularQuantidadeVenda))

  // As vendas mais recentes de qualquer dia, para mostrar o histórico rápido
  function ultimasVendas(quantidade: number) {
    return ordenarMaisRecentes(vendaStore.vendas).slice(0, quantidade)
  }

  return {
    vendasDoDia,
    faturamento,
    lucroBruto,
    quantidadeVendida,
    ultimasVendas,
  }
}
