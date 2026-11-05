<script setup lang="ts">
import { onMounted } from 'vue'
import { useGastoFixoStore } from '@/store/gastoFixoStore'
import { useVendaStore } from '@/store/vendaStore'

const gastoStore = useGastoFixoStore()
const vendaStore = useVendaStore()

onMounted(() => {
  gastoStore.carregarGastos()
  vendaStore.carregarVendas()
})
</script>

<template>
  <h1>Financeiro</h1>
  <p>Mês: <input v-model="vendaStore.mesSelecionado" type="month" /></p>
  <p>Vendas no mês: {{ vendaStore.vendasDoMes.length }}</p>
  <p>Itens vendidos: {{ vendaStore.quantidadeVendida }}</p>
  <p>Faturamento: {{ vendaStore.faturamento }}</p>
  <p>Custo dos produtos: {{ vendaStore.custoProdutos }}</p>
  <p>Lucro bruto: {{ vendaStore.lucroBruto }}</p>
  <p>Total de gastos fixos: {{ gastoStore.totalGastos }}</p>
  <p>Lucro líquido: {{ vendaStore.lucroBruto - gastoStore.totalGastos }}</p>
</template>
