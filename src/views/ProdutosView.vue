<script setup lang="ts">
import { onMounted } from 'vue'
import type { ColunaTabela, Produto } from '@/interfaces'
import { useProdutoStore } from '@/store/produtoStore'
import { calcularLucroUnitario, calcularMargem } from '@/utils/calculos'
import { formatarMoeda, formatarPercentual } from '@/utils/formatadores'
import AlertaErro from '@/components/ui/AlertaErro.vue'
import CabecalhoPagina from '@/components/ui/CabecalhoPagina.vue'
import TabelaDados from '@/components/ui/TabelaDados.vue'

const produtoStore = useProdutoStore()

const colunas: ColunaTabela[] = [
  { chave: 'nome', titulo: 'Produto', largura: '2fr', classe: 'texto-forte' },
  { chave: 'precoVenda', titulo: 'Preço de venda', numerica: true },
  { chave: 'precoCusto', titulo: 'Preço de custo', numerica: true, classe: 'texto-suave' },
  { chave: 'lucro', titulo: 'Lucro unitário', numerica: true },
  { chave: 'margem', titulo: 'Margem', numerica: true },
]

function classeMargem(produto: Produto): string {
  const margem = calcularMargem(produto)
  if (margem >= 30) return 'badge-sucesso'
  if (margem > 0) return 'badge-alerta'
  return 'badge-perigo'
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

    <AlertaErro :mensagem="produtoStore.erro" />

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
      </TabelaDados>
    </section>
  </main>
</template>
