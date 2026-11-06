import type { Produto } from '@/interfaces'
import { criarServicoCrud } from './crudService'

export const produtoService = criarServicoCrud<Produto>('/produtos')
