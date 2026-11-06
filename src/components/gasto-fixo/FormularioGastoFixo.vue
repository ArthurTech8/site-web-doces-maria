<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { GastoFixo, NovoGastoFixo } from '@/interfaces'
import AlertaErro from '@/components/ui/AlertaErro.vue'

// Formulário de cadastro e edição de gasto fixo.
// Não salva nada sozinho: emite "salvar" com os dados e a tela decide o que fazer.
// Não é um card: fica dentro do card de gastos fixos.
const props = withDefaults(
  defineProps<{
    gasto?: GastoFixo | null // quando informado, o formulário entra em modo de edição
    salvando?: boolean
    erro?: string | null
  }>(),
  {
    gasto: null,
    salvando: false,
    erro: null,
  }
)

const emit = defineEmits<{
  salvar: [dados: NovoGastoFixo]
  cancelar: []
}>()

const campos = reactive({
  descricao: '',
  valor: '' as number | '',
})

const tentouEnviar = ref(false)

const editando = computed(() => props.gasto !== null)

function preencher(gasto: GastoFixo | null) {
  campos.descricao = gasto?.descricao ?? ''
  campos.valor = gasto?.valor ?? ''
  tentouEnviar.value = false
}

watch(() => props.gasto, preencher, { immediate: true })

const erros = computed(() => ({
  descricao: campos.descricao.trim() === '' ? 'Informe a descrição.' : '',
  valor: Number(campos.valor) > 0 ? '' : 'Informe um valor maior que zero.',
}))

const valido = computed(() => !erros.value.descricao && !erros.value.valor)

function enviar() {
  tentouEnviar.value = true
  if (!valido.value) return

  emit('salvar', {
    descricao: campos.descricao.trim(),
    valor: Number(campos.valor),
  })
}

// A tela chama limpar() depois de salvar um gasto novo com sucesso
defineExpose({ limpar: () => preencher(null) })
</script>

<template>
  <form class="card-corpo" novalidate @submit.prevent="enviar">
    <AlertaErro :mensagem="erro" />

    <div class="formulario-grade" style="--colunas-formulario: 2fr 1fr">
      <label class="campo" :class="{ 'campo-invalido': tentouEnviar && erros.descricao }">
        <span class="campo-rotulo">Descrição</span>
        <input
          v-model="campos.descricao"
          class="campo-entrada"
          type="text"
          maxlength="40"
          placeholder="Ex.: Aluguel"
        />
        <span v-if="tentouEnviar && erros.descricao" class="campo-erro">{{ erros.descricao }}</span>
      </label>

      <label class="campo" :class="{ 'campo-invalido': tentouEnviar && erros.valor }">
        <span class="campo-rotulo">Valor mensal (R$)</span>
        <input
          v-model.number="campos.valor"
          class="campo-entrada"
          type="number"
          min="0"
          step="0.01"
          inputmode="decimal"
          placeholder="0,00"
        />
        <span v-if="tentouEnviar && erros.valor" class="campo-erro">{{ erros.valor }}</span>
      </label>
    </div>

    <div class="formulario-rodape">
      <p v-if="editando" class="formulario-previa texto-suave">Editando: {{ gasto?.descricao }}</p>

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
          <template v-else>Adicionar gasto</template>
        </button>
      </div>
    </div>
  </form>
</template>
