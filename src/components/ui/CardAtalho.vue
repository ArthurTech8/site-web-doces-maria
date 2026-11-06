<script setup lang="ts">
import { RouterLink } from 'vue-router'

// Card clicável que leva para uma tela (ex.: "Nova venda")
withDefaults(
  defineProps<{
    rota: string // name da rota em router/index.ts
    titulo: string
    descricao: string
    icone: string // emoji
    destaque?: boolean // atalho principal, com fundo na cor primária
  }>(),
  {
    destaque: false,
  }
)
</script>

<template>
  <RouterLink
    :to="{ name: rota }"
    class="card card-corpo atalho"
    :class="{ 'atalho-destaque': destaque }"
  >
    <span class="atalho-icone" aria-hidden="true">{{ icone }}</span>
    <span class="atalho-titulo">{{ titulo }}</span>
    <span class="atalho-descricao">{{ descricao }}</span>
  </RouterLink>
</template>

<style scoped src="@/assets/styles/card-atalho.css"></style>
