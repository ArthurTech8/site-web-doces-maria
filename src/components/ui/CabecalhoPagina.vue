<script setup lang="ts">
defineProps<{
  titulo: string
  subtitulo?: string
}>()
</script>

<template>
  <header class="pagina-cabecalho">
    <div>
      <h1>{{ titulo }}</h1>
      <p v-if="subtitulo" class="subtitulo">{{ subtitulo }}</p>
    </div>

    <!-- Conteúdo à direita do título: contador, botões etc. -->
    <slot />
  </header>
</template>
