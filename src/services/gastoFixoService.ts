import type { GastoFixo, NovoGastoFixo } from '@/interfaces'
import { criarServicoCrud } from './crudService'

export const gastoFixoService = criarServicoCrud<GastoFixo, NovoGastoFixo>('/gastosFixos')
