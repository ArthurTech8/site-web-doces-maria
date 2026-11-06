<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

// Janela de confirmação usando a tag nativa <dialog>.
// A tela controla quando abre/fecha pela prop "aberto".
const props = withDefaults(
  defineProps<{
    aberto: boolean
    titulo: string
    mensagem: string
    textoConfirmar?: string
    perigo?: boolean // botão de confirmar vermelho (ex.: excluir)
    processando?: boolean
  }>(),
  {
    textoConfirmar: 'Confirmar',
    perigo: false,
    processando: false,
  }
)

const emit = defineEmits<{
  confirmar: []
  cancelar: []
}>()

const dialogo = ref<HTMLDialogElement | null>(null)

function sincronizar(aberto: boolean) {
  if (!dialogo.value) return
  if (aberto && !dialogo.value.open) dialogo.value.showModal()
  if (!aberto && dialogo.value.open) dialogo.value.close()
}

watch(() => props.aberto, sincronizar)
onMounted(() => sincronizar(props.aberto))
</script>

<template>
  <!-- @cancel: a tecla Esc pede para fechar, mas quem decide é a tela -->
  <dialog ref="dialogo" class="modal" @cancel.prevent="emit('cancelar')">
    <h2 class="modal-titulo">{{ titulo }}</h2>
    <p class="modal-mensagem">{{ mensagem }}</p>

    <div class="modal-acoes">
      <button
        type="button"
        class="botao botao-secundario"
        :disabled="processando"
        @click="emit('cancelar')"
      >
        Cancelar
      </button>
      <button
        type="button"
        class="botao"
        :class="perigo ? 'botao-perigo' : 'botao-primario'"
        :disabled="processando"
        @click="emit('confirmar')"
      >
        {{ processando ? 'Aguarde...' : textoConfirmar }}
      </button>
    </div>
  </dialog>
</template>

<style scoped src="@/assets/styles/modal-confirmacao.css"></style>
