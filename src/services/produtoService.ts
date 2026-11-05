import type { Produto, NovoProduto } from '@/interfaces'
import { criarServicoCrud } from './crudService'

export const produtoService = criarServicoCrud<Produto, NovoProduto>('/produtos')
