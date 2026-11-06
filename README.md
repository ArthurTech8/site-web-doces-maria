# Doces da Maria

Sistema web de controle de vendas e financeiro de uma loja de doces: cadastro de produtos com preço de venda e custo, registro de vendas e dashboard com faturamento, gastos fixos e lucro.

## Como rodar

```sh
npm install
npm run dev
```

- Aplicação: http://localhost:5173
- API (json-server): http://localhost:3000

Os dados ficam no arquivo `db.json`.

## Antes de alterar o código

Leia o [ARQUITETURA.md](ARQUITETURA.md): ele descreve a estrutura de pastas, as regras de cada camada, as convenções de nomes e os checklists para criar novas telas e entidades.

Toda alteração deve passar pela **Validação obrigatória** descrita lá, incluindo:

```sh
npm run validar
```
