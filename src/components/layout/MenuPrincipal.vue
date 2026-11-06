<script setup lang="ts">
import { RouterLink } from 'vue-router'

// Para adicionar uma tela no menu, inclua o nome da rota (definido em router/index.ts)
const links = [
  { rota: 'home', texto: 'Home' },
  { rota: 'nova-venda', texto: 'Nova Venda' },
  { rota: 'produtos', texto: 'Produtos' },
  { rota: 'financeiro', texto: 'Financeiro' },
]
</script>

<template>
  <header class="menu">
    <RouterLink :to="{ name: 'home' }" class="menu-marca">
      <span class="menu-logo" aria-hidden="true">🧁</span>
      Doces da Maria
    </RouterLink>

    <nav class="menu-links" aria-label="Menu principal">
      <RouterLink
        v-for="link in links"
        :key="link.rota"
        :to="{ name: link.rota }"
        class="menu-link"
      >
        {{ link.texto }}
      </RouterLink>
    </nav>
  </header>
</template>

<style scoped src="@/assets/styles/menu-principal.css"></style>
