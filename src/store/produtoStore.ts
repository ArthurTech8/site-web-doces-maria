import { defineStore } from 'pinia'
import { produtoService } from '@/services/produtoService'
import { useColecao } from '@/composables/useColecao'

export const useProdutoStore = defineStore('produto', () => {
  // estado e ações
  const {
    itens: produtos,
    carregando,
    erro,
    carregar: carregarProdutos,
    adicionar: adicionarProduto,
    editar: editarProduto,
    remover: removerProduto,
  } = useColecao(
    produtoService,
    'Não foi possível carregar os produtos. Verifique se a API está rodando.'
  )

  return {
    produtos,
    carregando,
    erro,
    carregarProdutos,
    adicionarProduto,
    editarProduto,
    removerProduto,
  }
})
