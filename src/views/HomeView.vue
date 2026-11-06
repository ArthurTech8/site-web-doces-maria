<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import type { ColunaTabela } from '@/interfaces'
import { useVendaStore } from '@/store/vendaStore'
import { useResumoDoDia } from '@/composables/useResumoDoDia'
import {
  descreverItens,
  formatarDataHora,
  formatarDataPorExtenso,
  formatarMoeda,
} from '@/utils/formatadores'
import AlertaErro from '@/components/ui/AlertaErro.vue'
import CabecalhoPagina from '@/components/ui/CabecalhoPagina.vue'
import CardAtalho from '@/components/ui/CardAtalho.vue'
import CardIndicador from '@/components/ui/CardIndicador.vue'
import TabelaDados from '@/components/ui/TabelaDados.vue'

const vendaStore = useVendaStore()

const { vendasDoDia, faturamento, lucroBruto, quantidadeVendida, ultimasVendas } = useResumoDoDia()

const hoje = formatarDataPorExtenso(new Date())

const vendasRecentes = computed(() => ultimasVendas(5))

const colunasVendas: ColunaTabela[] = [
  { chave: 'data', titulo: 'Data', largura: '1.2fr' },
  { chave: 'itens', titulo: 'Itens', largura: '2fr' },
  { chave: 'total', titulo: 'Total', numerica: true, classe: 'texto-forte' },
]

onMounted(() => {
  vendaStore.carregarVendas()
})
</script>

<template>
  <main class="pagina">
    <CabecalhoPagina titulo="Olá, Maria!" :subtitulo="hoje" />

    <AlertaErro :mensagem="vendaStore.erro" />

    <!-- Atalhos -->
    <nav class="grade-cards" aria-label="Atalhos">
      <CardAtalho
        rota="nova-venda"
        titulo="Nova venda"
        descricao="Registrar uma venda agora"
        icone="🛒"
        destaque
      />
      <CardAtalho
        rota="produtos"
        titulo="Produtos"
        descricao="Cadastrar e ajustar preços"
        icone="🧁"
      />
      <CardAtalho
        rota="financeiro"
        titulo="Financeiro"
        descricao="Lucro do mês e gastos fixos"
        icone="📊"
      />
    </nav>

    <!-- Resumo de hoje -->
    <h2 class="secao-titulo">Hoje</h2>
    <section class="grade-indicadores" aria-label="Resumo de hoje">
      <CardIndicador
        rotulo="Vendas"
        :valor="String(vendasDoDia.length)"
        :detalhe="`${quantidadeVendida} item(ns) vendido(s)`"
      />
      <CardIndicador rotulo="Faturamento" :valor="formatarMoeda(faturamento)" tom="destaque" />
      <CardIndicador
        rotulo="Lucro bruto"
        :valor="formatarMoeda(lucroBruto)"
        detalhe="Antes dos gastos fixos"
        :tom="lucroBruto > 0 ? 'positivo' : 'neutro'"
      />
    </section>

    <!-- Últimas vendas -->
    <section class="card">
      <header class="card-cabecalho">
        <h2 class="card-titulo">Últimas vendas</h2>
        <RouterLink :to="{ name: 'financeiro' }" class="botao botao-texto">Ver todas</RouterLink>
      </header>

      <TabelaDados
        rotulo="Últimas vendas"
        :colunas="colunasVendas"
        :itens="vendasRecentes"
        :carregando="vendaStore.carregando"
        mensagem-vazia="Nenhuma venda registrada ainda."
      >
        <template #data="{ item }">{{ formatarDataHora(item.data) }}</template>
        <template #itens="{ item }">{{ descreverItens(item.itens) }}</template>
        <template #total="{ item }">{{ formatarMoeda(item.total) }}</template>
      </TabelaDados>
    </section>
  </main>
</template>
