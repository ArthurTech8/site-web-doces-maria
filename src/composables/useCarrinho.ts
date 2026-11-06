import { computed, ref } from 'vue'
import type { ItemVenda, Produto } from '@/interfaces'
import { calcularCustoItens, calcularTotalItens, somar } from '@/utils/calculos'

// Itens de uma venda que ainda está sendo montada (não salva na API).
export function useCarrinho() {
  const itens = ref<ItemVenda[]>([])

  const total = computed(() => calcularTotalItens(itens.value))
  const custo = computed(() => calcularCustoItens(itens.value))
  const lucro = computed(() => total.value - custo.value)
  const quantidadeTotal = computed(() => somar(itens.value, item => item.quantidade))
  const vazio = computed(() => itens.value.length === 0)

  // O mesmo produto adicionado duas vezes vira um item só, com as quantidades somadas
  function adicionar(produto: Produto, quantidade: number) {
    const existente = itens.value.find(item => item.produto.id === produto.id)
    if (existente) {
      existente.quantidade += quantidade
    } else {
      // Cópia do produto: o preço fica "congelado" no momento da venda
      itens.value.push({ produto: { ...produto }, quantidade })
    }
  }

  function remover(produtoId: string) {
    itens.value = itens.value.filter(item => item.produto.id !== produtoId)
  }

  // Quantidade zero remove o item
  function alterarQuantidade(produtoId: string, quantidade: number) {
    if (quantidade <= 0) {
      remover(produtoId)
      return
    }
    const item = itens.value.find(i => i.produto.id === produtoId)
    if (item) item.quantidade = quantidade
  }

  function limpar() {
    itens.value = []
  }

  return {
    itens,
    total,
    custo,
    lucro,
    quantidadeTotal,
    vazio,
    adicionar,
    remover,
    alterarQuantidade,
    limpar,
  }
}
