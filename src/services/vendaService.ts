import type { Venda } from '@/interfaces'
import { criarServicoCrud } from './crudService'

export const vendaService = criarServicoCrud<Venda>('/vendas')
