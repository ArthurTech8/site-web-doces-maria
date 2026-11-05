// Configuração de uma coluna do componente TabelaDados
export interface ColunaTabela {
  chave: string // nome do campo do item ou do slot que desenha a célula
  titulo: string
  largura?: string // valor de grid-template-columns, ex.: '2fr'. Padrão: '1fr'
  numerica?: boolean // alinha à direita
  classe?: string // classe extra aplicada nas células da coluna
}
