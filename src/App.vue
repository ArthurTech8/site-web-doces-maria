<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/venda/nova-venda">Nova Venda</RouterLink>
      <RouterLink to="/produtos">Produtos</RouterLink>
      <RouterLink to="/financeiro">Financeiro</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>

</style>
