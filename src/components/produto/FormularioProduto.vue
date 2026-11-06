<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { NovoProduto, Produto } from '@/interfaces'
import { calcularLucroUnitario, calcularMargem } from '@/utils/calculos'
import { formatarMoeda, formatarPercentual } from '@/utils/formatadores'
import AlertaErro from '@/components/ui/AlertaErro.vue'

// Formulário de cadastro e edição de produto.
// Não salva nada sozinho: emite "salvar" com os dados e a tela decide o que fazer.
const props = withDefaults(
  defineProps<{
    produto?: Produto | null // quando informado, o formulário entra em modo de edição
    salvando?: boolean
    erro?: string | null
  }>(),
  {
    produto: null,
    salvando: false,
    erro: null,
  }
)

const emit = defineEmits<{
  salvar: [dados: NovoProduto]
  cancelar: []
}>()

// Campos numéricos ficam '' quando o input está vazio
const campos = reactive({
  nome: '',
  precoVenda: '' as number | '',
  precoCusto: '' as number | '',
})

// Os erros só aparecem depois da primeira tentativa de envio
const tentouEnviar = ref(false)

const editando = computed(() => props.produto !== null)

function preencher(produto: Produto | null) {
  campos.nome = produto?.nome ?? ''
  campos.precoVenda = produto?.precoVenda ?? ''
  campos.precoCusto = produto?.precoCusto ?? ''
  tentouEnviar.value = false
}

watch(() => props.produto, preencher, { immediate: true })

const erros = computed(() => ({
  nome: campos.nome.trim() === '' ? 'Informe o nome do produto.' : '',
  precoVenda: Number(campos.precoVenda) > 0 ? '' : 'Informe um preço de venda maior que zero.',
  precoCusto: Number(campos.precoCusto) > 0 ? '' : 'Informe um preço de custo maior que zero.',
}))

const valido = computed(() => Object.values(erros.value).every(erro => erro === ''))

// Prévia do lucro enquanto a Maria digita
const precos = computed(() => {
  if (erros.value.precoVenda || erros.value.precoCusto) return null
  return { precoVenda: Number(campos.precoVenda), precoCusto: Number(campos.precoCusto) }
})

const temPrejuizo = computed(() => precos.value !== null && calcularLucroUnitario(precos.value) <= 0)

function enviar() {
  tentouEnviar.value = true
  if (!valido.value) return

  emit('salvar', {
    nome: campos.nome.trim(),
    precoVenda: Number(campos.precoVenda),
    precoCusto: Number(campos.precoCusto),
  })
}

// A tela chama limpar() depois de salvar um produto novo com sucesso
defineExpose({ limpar: () => preencher(null) })
</script>

<template>
  <form class="card card-corpo" novalidate @submit.prevent="enviar">
    <h2 class="card-titulo">{{ editando ? `Editar produto: ${produto?.nome}` : 'Novo produto' }}</h2>

    <AlertaErro :mensagem="erro" />

    <div class="formulario-grade">
      <label class="campo" :class="{ 'campo-invalido': tentouEnviar && erros.nome }">
        <span class="campo-rotulo">Nome</span>
        <input
          v-model="campos.nome"
          class="campo-entrada"
          type="text"
          maxlength="60"
          placeholder="Ex.: Cupcake"
        />
        <span v-if="tentouEnviar && erros.nome" class="campo-erro">{{ erros.nome }}</span>
      </label>

      <label class="campo" :class="{ 'campo-invalido': tentouEnviar && erros.precoVenda }">
        <span class="campo-rotulo">Preço de venda (R$)</span>
        <input
          v-model.number="campos.precoVenda"
          class="campo-entrada"
          type="number"
          min="0"
          step="0.01"
          inputmode="decimal"
          placeholder="0,00"
        />
        <span v-if="tentouEnviar && erros.precoVenda" class="campo-erro">{{ erros.precoVenda }}</span>
      </label>

      <label class="campo" :class="{ 'campo-invalido': tentouEnviar && erros.precoCusto }">
        <span class="campo-rotulo">Preço de custo (R$)</span>
        <input
          v-model.number="campos.precoCusto"
          class="campo-entrada"
          type="number"
          min="0"
          step="0.01"
          inputmode="decimal"
          placeholder="0,00"
        />
        <span v-if="tentouEnviar && erros.precoCusto" class="campo-erro">{{ erros.precoCusto }}</span>
      </label>
    </div>

    <div class="formulario-rodape">
      <p class="formulario-previa" :class="temPrejuizo ? 'texto-aviso' : 'texto-suave'">
        <template v-if="precos === null">Preencha os preços para ver o lucro por unidade.</template>
        <template v-else-if="temPrejuizo">
          Atenção: o custo é igual ou maior que o preço de venda. Este produto dá prejuízo.
        </template>
        <template v-else>
          Lucro por unidade: <strong>{{ formatarMoeda(calcularLucroUnitario(precos)) }}</strong>
          ({{ formatarPercentual(calcularMargem(precos)) }} de margem)
        </template>
      </p>

      <div class="formulario-acoes">
        <button
          v-if="editando"
          type="button"
          class="botao botao-secundario"
          :disabled="salvando"
          @click="emit('cancelar')"
        >
          Cancelar
        </button>
        <button type="submit" class="botao botao-primario" :disabled="salvando">
          <template v-if="salvando">Salvando...</template>
          <template v-else-if="editando">Salvar alterações</template>
          <template v-else>Cadastrar produto</template>
        </button>
      </div>
    </div>
  </form>
</template>
