<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import type { ColunaTabela, Produto } from '@/interfaces'
import { useProdutoStore } from '@/store/produtoStore'
import { useVendaStore } from '@/store/vendaStore'
import { useCarrinho } from '@/composables/useCarrinho'
import { calcularSubtotalItem } from '@/utils/calculos'
import { formatarMoeda } from '@/utils/formatadores'
import AlertaErro from '@/components/ui/AlertaErro.vue'
import AlertaSucesso from '@/components/ui/AlertaSucesso.vue'
import CabecalhoPagina from '@/components/ui/CabecalhoPagina.vue'
import TabelaDados from '@/components/ui/TabelaDados.vue'
import FormularioItemVenda from '@/components/venda/FormularioItemVenda.vue'

const produtoStore = useProdutoStore()
const vendaStore = useVendaStore()

const { itens, total, lucro, quantidadeTotal, vazio, adicionar, remover, alterarQuantidade, limpar } =
  useCarrinho()

const colunas: ColunaTabela[] = [
  { chave: 'produto', titulo: 'Produto', largura: '2fr', classe: 'texto-forte' },
  { chave: 'precoUnitario', titulo: 'Preço unitário', numerica: true },
  { chave: 'quantidade', titulo: 'Quantidade', largura: '150px', classe: 'texto-direita' },
  { chave: 'subtotal', titulo: 'Subtotal', numerica: true },
  { chave: 'acoes', titulo: 'Ações', largura: '110px', classe: 'texto-direita' },
]

// A TabelaDados precisa de um id por linha: usamos o id do produto (cada produto aparece uma vez)
const linhasCarrinho = computed(() => itens.value.map(item => ({ id: item.produto.id, ...item })))

// Registro da venda
const registrando = ref(false)
const erroRegistro = ref<string | null>(null)
const mensagemSucesso = ref<string | null>(null)

function adicionarItem(produto: Produto, quantidade: number) {
  adicionar(produto, quantidade)
  mensagemSucesso.value = null
}

async function registrarVenda() {
  if (vazio.value) return

  registrando.value = true
  erroRegistro.value = null
  mensagemSucesso.value = null
  try {
    const venda = await vendaStore.registrarVenda(itens.value)
    mensagemSucesso.value = `Venda registrada: ${quantidadeTotal.value} item(ns), total de ${formatarMoeda(venda.total)}.`
    limpar()
  } catch {
    erroRegistro.value = 'Não foi possível registrar a venda. Tente novamente.'
  } finally {
    registrando.value = false
  }
}

onMounted(() => {
  produtoStore.carregarProdutos()
})
</script>

<template>
  <main class="pagina">
    <CabecalhoPagina titulo="Nova venda" subtitulo="Monte o carrinho e registre a venda">
      <span class="contador">{{ quantidadeTotal }} item(ns) no carrinho</span>
    </CabecalhoPagina>

    <AlertaErro :mensagem="produtoStore.erro" />

    <AlertaSucesso :mensagem="mensagemSucesso">
      <RouterLink :to="{ name: 'financeiro' }">Ver no financeiro</RouterLink>
    </AlertaSucesso>

    <section
      v-if="!produtoStore.carregando && !produtoStore.erro && produtoStore.produtos.length === 0"
      class="card card-corpo"
    >
      <p class="texto-suave">
        Nenhum produto cadastrado.
        <RouterLink :to="{ name: 'produtos' }">Cadastre um produto</RouterLink> para registrar vendas.
      </p>
    </section>

    <FormularioItemVenda
      v-else-if="produtoStore.produtos.length > 0"
      :produtos="produtoStore.produtos"
      @adicionar="adicionarItem"
    />

    <section class="card">
      <TabelaDados
        rotulo="Itens do carrinho"
        :colunas="colunas"
        :itens="linhasCarrinho"
        mensagem-vazia="O carrinho está vazio. Adicione um item acima."
      >
        <template #produto="{ item }">{{ item.produto.nome }}</template>
        <template #precoUnitario="{ item }">{{ formatarMoeda(item.produto.precoVenda) }}</template>
        <template #quantidade="{ item }">
          <div class="controle-quantidade">
            <button
              type="button"
              class="botao botao-texto"
              :aria-label="`Diminuir quantidade de ${item.produto.nome}`"
              @click="alterarQuantidade(item.produto.id, item.quantidade - 1)"
            >
              −
            </button>
            <span class="controle-quantidade-valor">{{ item.quantidade }}</span>
            <button
              type="button"
              class="botao botao-texto"
              :aria-label="`Aumentar quantidade de ${item.produto.nome}`"
              @click="alterarQuantidade(item.produto.id, item.quantidade + 1)"
            >
              +
            </button>
          </div>
        </template>
        <template #subtotal="{ item }">{{ formatarMoeda(calcularSubtotalItem(item)) }}</template>
        <template #acoes="{ item }">
          <button
            type="button"
            class="botao botao-texto botao-texto-perigo"
            @click="remover(item.produto.id)"
          >
            Remover
          </button>
        </template>
      </TabelaDados>

      <footer class="card-rodape">
        <AlertaErro :mensagem="erroRegistro" />

        <div class="formulario-rodape rodape-venda">
          <div class="resumo">
            <div class="resumo-item">
              <span class="resumo-rotulo">Itens</span>
              <span class="resumo-valor">{{ quantidadeTotal }}</span>
            </div>
            <div class="resumo-item">
              <span class="resumo-rotulo">Lucro estimado</span>
              <span class="resumo-valor">{{ formatarMoeda(lucro) }}</span>
            </div>
            <div class="resumo-item">
              <span class="resumo-rotulo">Total</span>
              <span class="resumo-valor resumo-valor-destaque">{{ formatarMoeda(total) }}</span>
            </div>
          </div>

          <div class="formulario-acoes">
            <button
              type="button"
              class="botao botao-secundario"
              :disabled="vazio || registrando"
              @click="limpar"
            >
              Limpar
            </button>
            <button
              type="button"
              class="botao botao-primario"
              :disabled="vazio || registrando"
              @click="registrarVenda"
            >
              {{ registrando ? 'Registrando...' : 'Registrar venda' }}
            </button>
          </div>
        </div>
      </footer>
    </section>
  </main>
</template>

<style scoped>
.controle-quantidade {
  display: inline-flex;
  align-items: center;
  gap: var(--espaco-1);
}

.controle-quantidade-valor {
  min-width: 3ch;
  font-weight: 600;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.rodape-venda {
  margin-top: 0;
}
</style>
