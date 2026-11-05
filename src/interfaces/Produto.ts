export interface Produto {
  id: string;
  nome: string;
  precoVenda: number;
  precoCusto: number;
}

export type NovoProduto = Omit<Produto, 'id'>;