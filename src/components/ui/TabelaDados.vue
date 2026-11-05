<script setup lang="ts" generic="T extends { id: string }">
import { computed } from 'vue'
import type { ColunaTabela } from '@/interfaces'

// Tabela em CSS Grid (sem <table>) com acessibilidade via role.
// Cada célula mostra o campo do item com o mesmo nome da coluna,
// ou o conteúdo do slot com o nome da coluna, se a tela fornecer um.
const props = withDefaults(
  defineProps<{
    rotulo: string // descrição da tabela para leitores de tela
    colunas: ColunaTabela[]
    itens: T[]
    carregando?: boolean
    mensagemVazia?: string
  }>(),
  {
    carregando: false,
    mensagemVazia: 'Nenhum registro encontrado.',
  }
)

defineSlots<Record<string, (props: { item: T }) => unknown>>()

const gridColunas = computed(() => props.colunas.map(coluna => coluna.largura ?? '1fr').join(' '))

function valorPadrao(item: T, chave: string): unknown {
  return (item as unknown as Record<string, unknown>)[chave]
}
</script>

<template>
  <div class="tabela" role="table" :aria-label="rotulo" :style="{ '--colunas': gridColunas }">
    <div class="tabela-linha tabela-cabecalho" role="row">
      <span
        v-for="coluna in colunas"
        :key="coluna.chave"
        class="tabela-celula"
        :class="{ numero: coluna.numerica }"
        role="columnheader"
      >
        {{ coluna.titulo }}
      </span>
    </div>

    <div class="tabela-corpo" role="rowgroup">
      <div v-if="carregando" class="tabela-linha" role="row">
        <span class="tabela-celula estado-vazio" role="cell">Carregando...</span>
      </div>

      <div v-else-if="itens.length === 0" class="tabela-linha" role="row">
        <span class="tabela-celula estado-vazio" role="cell">{{ mensagemVazia }}</span>
      </div>

      <template v-else>
        <div v-for="item in itens" :key="item.id" class="tabela-linha" role="row">
          <span
            v-for="coluna in colunas"
            :key="coluna.chave"
            class="tabela-celula"
            :class="[{ numero: coluna.numerica }, coluna.classe]"
            role="cell"
            :data-label="coluna.titulo"
          >
            <slot :name="coluna.chave" :item="item">{{ valorPadrao(item, coluna.chave) }}</slot>
          </span>
        </div>
      </template>
    </div>
  </div>
</template>
