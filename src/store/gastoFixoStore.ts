import { computed } from 'vue'
import { defineStore } from 'pinia'
import { gastoFixoService } from '@/services/gastoFixoService'
import { useColecao } from '@/composables/useColecao'
import { somar } from '@/utils/calculos'

export const useGastoFixoStore = defineStore('gastoFixo', () => {
  // estado e ações
  const {
    itens: gastos,
    carregando,
    erro,
    carregar: carregarGastos,
    adicionar: adicionarGasto,
    editar: editarGasto,
    remover: removerGasto,
  } = useColecao(
    gastoFixoService,
    'Não foi possível carregar os gastos fixos. Verifique se a API está rodando.'
  )

  // cálculos
  const totalGastos = computed(() => somar(gastos.value, gasto => gasto.valor))

  return {
    gastos,
    carregando,
    erro,
    totalGastos,
    carregarGastos,
    adicionarGasto,
    editarGasto,
    removerGasto,
  }
})
