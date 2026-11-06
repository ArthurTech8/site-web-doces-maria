import { computed } from 'vue'
import { useGastoFixoStore } from '@/store/gastoFixoStore'
import { useProdutoStore } from '@/store/produtoStore'
import { useVendaStore } from '@/store/vendaStore'
import { calcularItensNecessarios, calcularLucroUnitario, somar } from '@/utils/calculos'

// Indicadores do mês selecionado que dependem de mais de uma store
// (vendas + gastos fixos). A tela precisa carregar as três stores.
export function useResumoFinanceiro() {
  const vendaStore = useVendaStore()
  const gastoStore = useGastoFixoStore()
  const produtoStore = useProdutoStore()

  const lucroLiquido = computed(() => vendaStore.lucroBruto - gastoStore.totalGastos)

  const gastosCobertos = computed(() => lucroLiquido.value >= 0)

  // Percentual dos gastos fixos que o lucro bruto do mês já cobre (0 a 100)
  const coberturaGastos = computed(() => {
    if (gastoStore.totalGastos === 0) return 100
    const percentual = (vendaStore.lucroBruto / gastoStore.totalGastos) * 100
    return Math.min(100, Math.max(0, percentual))
  })

  // Lucro que ainda falta para pagar os gastos fixos do mês
  const faltaParaEquilibrio = computed(() => Math.max(0, -lucroLiquido.value))

  // Lucro médio por item: usa as vendas do mês; sem vendas, a média dos produtos cadastrados
  const lucroMedioPorItem = computed(() => {
    if (vendaStore.quantidadeVendida > 0) {
      return vendaStore.lucroBruto / vendaStore.quantidadeVendida
    }
    const produtos = produtoStore.produtos
    if (produtos.length === 0) return 0
    return somar(produtos, calcularLucroUnitario) / produtos.length
  })

  // Estimativa de quantos itens ainda precisam ser vendidos no mês
  const itensParaEquilibrio = computed(() =>
    calcularItensNecessarios(faltaParaEquilibrio.value, lucroMedioPorItem.value)
  )

  return {
    lucroLiquido,
    gastosCobertos,
    coberturaGastos,
    faltaParaEquilibrio,
    lucroMedioPorItem,
    itensParaEquilibrio,
  }
}
