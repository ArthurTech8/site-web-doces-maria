// Campos que todo registro salvo na API tem
export interface Registro {
  id: string
  ativo: boolean // false = excluído. Nada é apagado do banco: o registro só fica inativo
}

// Registro novo, antes de ser salvo: sem id (gerado pela API) e sem ativo (o service define true)
export type Novo<T extends Registro> = Omit<T, keyof Registro>
