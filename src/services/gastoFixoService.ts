import type { GastoFixo } from '@/interfaces'
import { criarServicoCrud } from './crudService'

export const gastoFixoService = criarServicoCrud<GastoFixo>('/gastosFixos')
