<script setup lang="ts">
// Card de um número do dashboard (ex.: Faturamento: R$ 80,00)
withDefaults(
  defineProps<{
    rotulo: string
    valor: string // já formatado, ex.: formatarMoeda(80)
    detalhe?: string // texto pequeno abaixo do valor
    tom?: 'neutro' | 'destaque' | 'positivo' | 'negativo'
  }>(),
  {
    detalhe: undefined,
    tom: 'neutro',
  }
)
</script>

<template>
  <article class="card card-corpo indicador" :class="`indicador-${tom}`">
    <span class="indicador-rotulo">{{ rotulo }}</span>
    <strong class="indicador-valor">{{ valor }}</strong>
    <span v-if="detalhe" class="indicador-detalhe">{{ detalhe }}</span>
  </article>
</template>

<style scoped src="@/assets/styles/card-indicador.css"></style>
