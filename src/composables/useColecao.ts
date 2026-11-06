import { ref, type Ref } from 'vue'
import type { Novo, Registro } from '@/interfaces'
import type { ServicoCrud } from '@/services/crudService'

// Estado e ações padrão de uma lista vinda da API (carregar, adicionar, editar, remover).
// Usado dentro das stores para não repetir a mesma lógica em cada uma.
// A lista contém só registros ativos.
export function useColecao<T extends Registro>(servico: ServicoCrud<T>, mensagemErroCarregar: string) {
  const itens = ref([]) as Ref<T[]>
  const carregando = ref(false)
  const erro = ref<string | null>(null)

  async function carregar() {
    carregando.value = true
    erro.value = null
    try {
      itens.value = await servico.listar()
    } catch {
      erro.value = mensagemErroCarregar
    } finally {
      carregando.value = false
    }
  }

  // adicionar, editar e remover deixam o erro subir para a tela,
  // que mostra a mensagem junto do formulário ou botão que a Maria usou
  async function adicionar(novo: Novo<T>): Promise<T> {
    const salvo = await servico.criar(novo)
    itens.value.push(salvo)
    return salvo
  }

  async function editar(item: T): Promise<T> {
    const salvo = await servico.atualizar(item)
    const posicao = itens.value.findIndex(i => i.id === item.id)
    if (posicao !== -1) itens.value[posicao] = salvo
    return salvo
  }

  // Exclusão lógica: o registro fica inativo na API e sai da lista da tela
  async function remover(id: string) {
    await servico.inativar(id)
    itens.value = itens.value.filter(i => i.id !== id)
  }

  return { itens, carregando, erro, carregar, adicionar, editar, remover }
}
