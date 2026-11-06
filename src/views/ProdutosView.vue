<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { ColunaTabela, NovoProduto, Produto } from '@/interfaces'
import { useProdutoStore } from '@/store/produtoStore'
import { calcularLucroUnitario, calcularMargem } from '@/utils/calculos'
import { formatarMoeda, formatarPercentual } from '@/utils/formatadores'
import AlertaErro from '@/components/ui/AlertaErro.vue'
import CabecalhoPagina from '@/components/ui/CabecalhoPagina.vue'
import ModalConfirmacao from '@/components/ui/ModalConfirmacao.vue'
import TabelaDados from '@/components/ui/TabelaDados.vue'
import FormularioProduto from '@/components/produto/FormularioProduto.vue'

const produtoStore = useProdutoStore()

const colunas: ColunaTabela[] = [
  { chave: 'nome', titulo: 'Produto', largura: '2fr', classe: 'texto-forte' },
  { chave: 'precoVenda', titulo: 'Preço de venda', numerica: true },
  { chave: 'precoCusto', titulo: 'Preço de custo', numerica: true, classe: 'texto-suave' },
  { chave: 'lucro', titulo: 'Lucro unitário', numerica: true },
  { chave: 'margem', titulo: 'Margem', numerica: true },
  { chave: 'acoes', titulo: 'Ações', largura: '170px', classe: 'texto-direita' },
]

function classeMargem(produto: Produto): string {
  const margem = calcularMargem(produto)
  if (margem >= 30) return 'badge-sucesso'
  if (margem > 0) return 'badge-alerta'
  return 'badge-perigo'
}

// Cadastro e edição
const formulario = ref<InstanceType<typeof FormularioProduto> | null>(null)
const produtoEmEdicao = ref<Produto | null>(null)
const salvando = ref(false)
const erroFormulario = ref<string | null>(null)

function iniciarEdicao(produto: Produto) {
  produtoEmEdicao.value = produto
  erroFormulario.value = null
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelarEdicao() {
  produtoEmEdicao.value = null
  erroFormulario.value = null
}

async function salvarProduto(dados: NovoProduto) {
  salvando.value = true
  erroFormulario.value = null
  try {
    if (produtoEmEdicao.value) {
      // Parte do registro original (mantém id e ativo) e aplica os campos do formulário
      await produtoStore.editarProduto({ ...produtoEmEdicao.value, ...dados })
      produtoEmEdicao.value = null
    } else {
      await produtoStore.adicionarProduto(dados)
      formulario.value?.limpar()
    }
  } catch {
    erroFormulario.value = 'Não foi possível salvar o produto. Tente novamente.'
  } finally {
    salvando.value = false
  }
}

// Exclusão
const produtoParaExcluir = ref<Produto | null>(null)
const excluindo = ref(false)
const erroExclusao = ref<string | null>(null)

const mensagemExclusao = computed(() =>
  produtoParaExcluir.value
    ? `O produto "${produtoParaExcluir.value.nome}" ficará inativo e não aparecerá mais nas listas nem na Nova Venda. O registro continua salvo no banco de dados, e as vendas já registradas não são alteradas.`
    : ''
)

async function confirmarExclusao() {
  if (!produtoParaExcluir.value) return
  const produto = produtoParaExcluir.value

  excluindo.value = true
  erroExclusao.value = null
  try {
    await produtoStore.removerProduto(produto.id)
    if (produtoEmEdicao.value?.id === produto.id) cancelarEdicao()
    produtoParaExcluir.value = null
  } catch {
    erroExclusao.value = `Não foi possível excluir o produto "${produto.nome}". Tente novamente.`
    produtoParaExcluir.value = null
  } finally {
    excluindo.value = false
  }
}

onMounted(() => {
  produtoStore.carregarProdutos()
})
</script>

<template>
  <main class="pagina">
    <CabecalhoPagina titulo="Produtos" subtitulo="Itens cadastrados com preço de venda e custo">
      <span class="contador">{{ produtoStore.produtos.length }} produto(s)</span>
    </CabecalhoPagina>

    <AlertaErro :mensagem="produtoStore.erro ?? erroExclusao" />

    <FormularioProduto
      ref="formulario"
      :produto="produtoEmEdicao"
      :salvando="salvando"
      :erro="erroFormulario"
      @salvar="salvarProduto"
      @cancelar="cancelarEdicao"
    />

    <section class="card">
      <TabelaDados
        rotulo="Lista de produtos"
        :colunas="colunas"
        :itens="produtoStore.produtos"
        :carregando="produtoStore.carregando"
        mensagem-vazia="Nenhum produto cadastrado."
      >
        <template #precoVenda="{ item }">{{ formatarMoeda(item.precoVenda) }}</template>
        <template #precoCusto="{ item }">{{ formatarMoeda(item.precoCusto) }}</template>
        <template #lucro="{ item }">{{ formatarMoeda(calcularLucroUnitario(item)) }}</template>
        <template #margem="{ item }">
          <span class="badge" :class="classeMargem(item)">
            {{ formatarPercentual(calcularMargem(item)) }}
          </span>
        </template>
        <template #acoes="{ item }">
          <div class="grupo-acoes">
            <button type="button" class="botao botao-texto" @click="iniciarEdicao(item)">
              Editar
            </button>
            <button
              type="button"
              class="botao botao-texto botao-texto-perigo"
              @click="produtoParaExcluir = item"
            >
              Excluir
            </button>
          </div>
        </template>
      </TabelaDados>
    </section>

    <ModalConfirmacao
      :aberto="produtoParaExcluir !== null"
      titulo="Excluir produto?"
      :mensagem="mensagemExclusao"
      texto-confirmar="Excluir"
      perigo
      :processando="excluindo"
      @confirmar="confirmarExclusao"
      @cancelar="produtoParaExcluir = null"
    />
  </main>
</template>
