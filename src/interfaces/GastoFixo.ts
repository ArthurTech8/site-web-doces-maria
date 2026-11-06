import type { Novo, Registro } from './Registro'

export interface GastoFixo extends Registro {
  descricao: string
  valor: number
}

export type NovoGastoFixo = Novo<GastoFixo>
