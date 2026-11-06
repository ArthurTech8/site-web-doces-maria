<script setup lang="ts">
defineProps<{
  mensagem: string | null
}>()
</script>

<template>
  <div v-if="mensagem" class="alerta alerta-sucesso" role="status">
    <span>{{ mensagem }}</span>

    <!-- Conteúdo extra à direita, ex.: um link -->
    <slot />
  </div>
</template>
