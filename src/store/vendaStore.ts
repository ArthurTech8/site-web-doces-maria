import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { ItemVenda, NovaVenda, Venda } from '@/interfaces'
import { vendaService } from '@/services/vendaService'
import { useColecao } from '@/composables/useColecao'
import { calcularCustoItens, calcularTotalItens, somar } from '@/utils/calculos'
import { chaveDoMes } from '@/utils/datas'

export const useVendaStore = defineStore('venda', () => {
  // estado e ações
  // (vendas não são editadas: se houver erro, a venda é excluída e lançada de novo)
  const {
    itens: vendas,
    carregando,
    erro,
    carregar: carregarVendas,
    adicionar,
    remover: removerVenda,
  } = useColecao(
    vendaService,
    'Não foi possível carregar as vendas. Verifique se a API está rodando.'
  )

  const mesSelecionado = ref(chaveDoMes(new Date()))

  // cálculos (sempre do mês selecionado)
  const vendasDoMes = computed(() =>
    vendas.value.filter(venda => chaveDoMes(new Date(venda.data)) === mesSelecionado.value)
  )

  const faturamento = computed(() => somar(vendasDoMes.value, venda => venda.total))

  const custoProdutos = computed(() => somar(vendasDoMes.value, venda => venda.custoTotal))

  const lucroBruto = computed(() => faturamento.value - custoProdutos.value)

  const quantidadeVendida = computed(() =>
    somar(vendasDoMes.value, venda => somar(venda.itens, item => item.quantidade))
  )

  // Monta a venda a partir dos itens e salva na API
  async function registrarVenda(itens: ItemVenda[]): Promise<Venda> {
    const novaVenda: NovaVenda = {
      data: new Date().toISOString(),
      itens,
      total: calcularTotalItens(itens),
      custoTotal: calcularCustoItens(itens),
    }
    return adicionar(novaVenda)
  }

  return {
    vendas,
    carregando,
    erro,
    mesSelecionado,
    vendasDoMes,
    faturamento,
    custoProdutos,
    lucroBruto,
    quantidadeVendida,
    carregarVendas,
    registrarVenda,
    removerVenda,
  }
})
