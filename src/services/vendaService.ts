import type { Venda, NovaVenda } from '@/interfaces'
import { criarServicoCrud } from './crudService'

export const vendaService = criarServicoCrud<Venda, NovaVenda>('/vendas')
