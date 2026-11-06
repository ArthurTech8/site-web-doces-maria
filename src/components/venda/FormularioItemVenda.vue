<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Produto } from '@/interfaces'
import { formatarMoeda } from '@/utils/formatadores'

// Escolha de produto e quantidade para adicionar ao carrinho.
// Não altera o carrinho sozinho: emite "adicionar" e a tela decide o que fazer.
const props = defineProps<{
  produtos: Produto[]
}>()

const emit = defineEmits<{
  adicionar: [produto: Produto, quantidade: number]
}>()

const produtoId = ref('')
const quantidade = ref<number | ''>(1)
const tentouEnviar = ref(false)

// Com um único produto cadastrado (ex.: só cupcake), ele já vem selecionado
watch(
  () => props.produtos,
  produtos => {
    if (produtos.length === 1 && produtos[0]) produtoId.value = produtos[0].id
  },
  { immediate: true }
)

const produtoSelecionado = computed(() => props.produtos.find(p => p.id === produtoId.value) ?? null)

const erros = computed(() => ({
  produto: produtoSelecionado.value ? '' : 'Escolha um produto.',
  quantidade: Number.isInteger(quantidade.value) && Number(quantidade.value) >= 1
    ? ''
    : 'Informe uma quantidade inteira maior que zero.',
}))

const valido = computed(() => !erros.value.produto && !erros.value.quantidade)

const subtotal = computed(() =>
  valido.value && produtoSelecionado.value
    ? produtoSelecionado.value.precoVenda * Number(quantidade.value)
    : null
)

function enviar() {
  tentouEnviar.value = true
  if (!valido.value || !produtoSelecionado.value) return

  emit('adicionar', produtoSelecionado.value, Number(quantidade.value))
  quantidade.value = 1
  tentouEnviar.value = false
}
</script>

<template>
  <form class="card card-corpo" novalidate @submit.prevent="enviar">
    <h2 class="card-titulo">Adicionar item</h2>

    <div class="formulario-grade">
      <label class="campo" :class="{ 'campo-invalido': tentouEnviar && erros.produto }">
        <span class="campo-rotulo">Produto</span>
        <select v-model="produtoId" class="campo-entrada">
          <option value="" disabled>Selecione um produto</option>
          <option v-for="produto in produtos" :key="produto.id" :value="produto.id">
            {{ produto.nome }}: {{ formatarMoeda(produto.precoVenda) }}
          </option>
        </select>
        <span v-if="tentouEnviar && erros.produto" class="campo-erro">{{ erros.produto }}</span>
      </label>

      <label class="campo" :class="{ 'campo-invalido': tentouEnviar && erros.quantidade }">
        <span class="campo-rotulo">Quantidade</span>
        <input
          v-model.number="quantidade"
          class="campo-entrada"
          type="number"
          min="1"
          step="1"
          inputmode="numeric"
        />
        <span v-if="tentouEnviar && erros.quantidade" class="campo-erro">{{ erros.quantidade }}</span>
      </label>

      <div class="campo">
        <span class="campo-rotulo">Preço unitário</span>
        <span class="campo-entrada texto-suave">
          {{ produtoSelecionado ? formatarMoeda(produtoSelecionado.precoVenda) : '—' }}
        </span>
      </div>
    </div>

    <div class="formulario-rodape">
      <p class="formulario-previa texto-suave">
        <template v-if="subtotal === null">Escolha o produto e a quantidade.</template>
        <template v-else>
          Subtotal: <strong>{{ formatarMoeda(subtotal) }}</strong>
          ({{ quantidade }} × {{ formatarMoeda(produtoSelecionado?.precoVenda ?? 0) }})
        </template>
      </p>

      <div class="formulario-acoes">
        <button type="submit" class="botao botao-primario">Adicionar ao carrinho</button>
      </div>
    </div>
  </form>
</template>
