export interface GastoFixo {
  id: string;
  descricao: string;
  valor: number;
}

export type NovoGastoFixo = Omit<GastoFixo, 'id'>;