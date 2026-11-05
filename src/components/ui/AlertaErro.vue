<script setup lang="ts">
defineProps<{
  mensagem: string | null
}>()
</script>

<template>
  <div v-if="mensagem" class="alerta alerta-erro" role="alert">
    {{ mensagem }}
  </div>
</template>
