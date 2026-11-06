<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { ColunaTabela, GastoFixo, NovoGastoFixo, Venda } from '@/interfaces'
import { useGastoFixoStore } from '@/store/gastoFixoStore'
import { useProdutoStore } from '@/store/produtoStore'
import { useVendaStore } from '@/store/vendaStore'
import { useResumoFinanceiro } from '@/composables/useResumoFinanceiro'
import { calcularLucroVenda } from '@/utils/calculos'
import { chaveDoMes, ordenarMaisRecentes } from '@/utils/datas'
import {
  descreverItens,
  formatarDataHora,
  formatarMes,
  formatarMoeda,
  formatarPercentual,
} from '@/utils/formatadores'
import AlertaErro from '@/components/ui/AlertaErro.vue'
import CabecalhoPagina from '@/components/ui/CabecalhoPagina.vue'
import CardIndicador from '@/components/ui/CardIndicador.vue'
import ModalConfirmacao from '@/components/ui/ModalConfirmacao.vue'
import TabelaDados from '@/components/ui/TabelaDados.vue'
import FormularioGastoFixo from '@/components/gasto-fixo/FormularioGastoFixo.vue'

const vendaStore = useVendaStore()
const gastoStore = useGastoFixoStore()
const produtoStore = useProdutoStore()

const {
  lucroLiquido,
  gastosCobertos,
  coberturaGastos,
  faltaParaEquilibrio,
  itensParaEquilibrio,
} = useResumoFinanceiro()

// Mês exibido. Se o campo for apagado, volta para o mês atual
const mes = computed({
  get: () => vendaStore.mesSelecionado,
  set: valor => {
    vendaStore.mesSelecionado = valor || chaveDoMes(new Date())
  },
})

const erroCarregamento = computed(() => vendaStore.erro ?? gastoStore.erro)

// Vendas do mês, da mais recente para a mais antiga
const vendasOrdenadas = computed(() => ordenarMaisRecentes(vendaStore.vendasDoMes))

const colunasGastos: ColunaTabela[] = [
  { chave: 'descricao', titulo: 'Descrição', largura: '2fr', classe: 'texto-forte' },
  { chave: 'valor', titulo: 'Valor', numerica: true },
  { chave: 'acoes', titulo: 'Ações', largura: '140px', classe: 'texto-direita' },
]

const colunasVendas: ColunaTabela[] = [
  { chave: 'data', titulo: 'Data', largura: '1.3fr' },
  { chave: 'itens', titulo: 'Itens', largura: '2fr' },
  { chave: 'total', titulo: 'Total', numerica: true, classe: 'texto-forte' },
  { chave: 'custoTotal', titulo: 'Custo', numerica: true, classe: 'texto-suave' },
  { chave: 'lucro', titulo: 'Lucro', numerica: true },
  { chave: 'acoes', titulo: 'Ações', largura: '90px', classe: 'texto-direita' },
]

// Gastos fixos: cadastro e edição
const formularioGasto = ref<InstanceType<typeof FormularioGastoFixo> | null>(null)
const gastoEmEdicao = ref<GastoFixo | null>(null)
const salvandoGasto = ref(false)
const erroGasto = ref<string | null>(null)

function iniciarEdicaoGasto(gasto: GastoFixo) {
  gastoEmEdicao.value = gasto
  erroGasto.value = null
}

function cancelarEdicaoGasto() {
  gastoEmEdicao.value = null
  erroGasto.value = null
}

async function salvarGasto(dados: NovoGastoFixo) {
  salvandoGasto.value = true
  erroGasto.value = null
  try {
    if (gastoEmEdicao.value) {
      // Parte do registro original (mantém id e ativo) e aplica os campos do formulário
      await gastoStore.editarGasto({ ...gastoEmEdicao.value, ...dados })
      gastoEmEdicao.value = null
    } else {
      await gastoStore.adicionarGasto(dados)
      formularioGasto.value?.limpar()
    }
  } catch {
    erroGasto.value = 'Não foi possível salvar o gasto. Tente novamente.'
  } finally {
    salvandoGasto.value = false
  }
}

// Exclusões (gasto ou venda) passam pelo modal de confirmação
const gastoParaExcluir = ref<GastoFixo | null>(null)
const vendaParaExcluir = ref<Venda | null>(null)
const excluindo = ref(false)
const erroExclusao = ref<string | null>(null)

const mensagemExclusaoGasto = computed(() =>
  gastoParaExcluir.value
    ? `O gasto "${gastoParaExcluir.value.descricao}" (${formatarMoeda(gastoParaExcluir.value.valor)}) ficará inativo e deixará de ser descontado do lucro. O registro continua salvo no banco de dados.`
    : ''
)

const mensagemExclusaoVenda = computed(() =>
  vendaParaExcluir.value
    ? `A venda de ${formatarDataHora(vendaParaExcluir.value.data)} (${formatarMoeda(vendaParaExcluir.value.total)}) ficará inativa e os indicadores do mês serão recalculados. O registro continua salvo no banco de dados.`
    : ''
)

async function confirmarExclusaoGasto() {
  const gasto = gastoParaExcluir.value
  if (!gasto) return

  excluindo.value = true
  erroExclusao.value = null
  try {
    await gastoStore.removerGasto(gasto.id)
    if (gastoEmEdicao.value?.id === gasto.id) cancelarEdicaoGasto()
  } catch {
    erroExclusao.value = `Não foi possível excluir o gasto "${gasto.descricao}". Tente novamente.`
  } finally {
    gastoParaExcluir.value = null
    excluindo.value = false
  }
}

async function confirmarExclusaoVenda() {
  const venda = vendaParaExcluir.value
  if (!venda) return

  excluindo.value = true
  erroExclusao.value = null
  try {
    await vendaStore.removerVenda(venda.id)
  } catch {
    erroExclusao.value = 'Não foi possível excluir a venda. Tente novamente.'
  } finally {
    vendaParaExcluir.value = null
    excluindo.value = false
  }
}

onMounted(() => {
  vendaStore.carregarVendas()
  gastoStore.carregarGastos()
  produtoStore.carregarProdutos()
})
</script>

<template>
  <main class="pagina">
    <CabecalhoPagina titulo="Financeiro" :subtitulo="`Resultados de ${formatarMes(mes)}`">
      <label class="campo">
        <span class="campo-rotulo">Mês</span>
        <input v-model="mes" class="campo-entrada" type="month" />
      </label>
    </CabecalhoPagina>

    <AlertaErro :mensagem="erroCarregamento ?? erroExclusao" />

    <!-- Indicadores do mês -->
    <section class="grade-indicadores" aria-label="Indicadores do mês">
      <CardIndicador
        rotulo="Faturamento"
        :valor="formatarMoeda(vendaStore.faturamento)"
        :detalhe="`${vendaStore.vendasDoMes.length} venda(s)`"
        tom="destaque"
      />
      <CardIndicador
        rotulo="Custo dos produtos"
        :valor="formatarMoeda(vendaStore.custoProdutos)"
        :detalhe="`${vendaStore.quantidadeVendida} item(ns) vendido(s)`"
      />
      <CardIndicador
        rotulo="Lucro bruto"
        :valor="formatarMoeda(vendaStore.lucroBruto)"
        detalhe="Faturamento − custo"
      />
      <CardIndicador
        rotulo="Gastos fixos"
        :valor="formatarMoeda(gastoStore.totalGastos)"
        :detalhe="`${gastoStore.gastos.length} gasto(s) mensal(is)`"
      />
      <CardIndicador
        rotulo="Lucro líquido"
        :valor="formatarMoeda(lucroLiquido)"
        detalhe="Lucro bruto − gastos fixos"
        :tom="gastosCobertos ? 'positivo' : 'negativo'"
      />
    </section>

    <!-- Ponto de equilíbrio -->
    <section class="card card-corpo">
      <h2 class="card-titulo">Ponto de equilíbrio</h2>

      <div
        class="progresso"
        role="progressbar"
        aria-label="Gastos fixos cobertos pelo lucro bruto"
        :aria-valuenow="Math.round(coberturaGastos)"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          class="progresso-barra"
          :class="{ 'progresso-barra-completa': gastosCobertos }"
          :style="{ width: `${coberturaGastos}%` }"
        />
      </div>

      <p class="equilibrio-texto">
        <strong>{{ formatarPercentual(coberturaGastos) }}</strong> dos gastos fixos cobertos
        ({{ formatarMoeda(vendaStore.lucroBruto) }} de {{ formatarMoeda(gastoStore.totalGastos) }}).
      </p>
      <p v-if="gastosCobertos" class="equilibrio-texto texto-sucesso">
        Gastos fixos do mês pagos! Lucro líquido de {{ formatarMoeda(lucroLiquido) }}.
      </p>
      <p v-else class="equilibrio-texto texto-suave">
        Faltam <strong>{{ formatarMoeda(faltaParaEquilibrio) }}</strong> de lucro para cobrir os gastos fixos
        <template v-if="itensParaEquilibrio !== null">
          (cerca de <strong>{{ itensParaEquilibrio }}</strong> item(ns) a mais).
        </template>
        <template v-else>.</template>
      </p>
    </section>

    <div class="painel-financeiro">
      <!-- Gastos fixos -->
      <section class="card">
        <header class="card-cabecalho">
          <h2 class="card-titulo">Gastos fixos mensais</h2>
        </header>

        <FormularioGastoFixo
          ref="formularioGasto"
          :gasto="gastoEmEdicao"
          :salvando="salvandoGasto"
          :erro="erroGasto"
          @salvar="salvarGasto"
          @cancelar="cancelarEdicaoGasto"
        />

        <TabelaDados
          rotulo="Gastos fixos"
          :colunas="colunasGastos"
          :itens="gastoStore.gastos"
          :carregando="gastoStore.carregando"
          mensagem-vazia="Nenhum gasto fixo cadastrado."
        >
          <template #valor="{ item }">{{ formatarMoeda(item.valor) }}</template>
          <template #acoes="{ item }">
            <div class="grupo-acoes">
              <button type="button" class="botao botao-texto" @click="iniciarEdicaoGasto(item)">
                Editar
              </button>
              <button
                type="button"
                class="botao botao-texto botao-texto-perigo"
                @click="gastoParaExcluir = item"
              >
                Excluir
              </button>
            </div>
          </template>
        </TabelaDados>

        <footer class="card-rodape resumo">
          <div class="resumo-item">
            <span class="resumo-rotulo">Total mensal</span>
            <span class="resumo-valor">{{ formatarMoeda(gastoStore.totalGastos) }}</span>
          </div>
        </footer>
      </section>

      <!-- Vendas do mês -->
      <section class="card">
        <header class="card-cabecalho">
          <h2 class="card-titulo">Vendas do mês</h2>
          <span class="contador">{{ vendaStore.vendasDoMes.length }} venda(s)</span>
        </header>

        <TabelaDados
          rotulo="Vendas do mês"
          :colunas="colunasVendas"
          :itens="vendasOrdenadas"
          :carregando="vendaStore.carregando"
          mensagem-vazia="Nenhuma venda registrada neste mês."
        >
          <template #data="{ item }">{{ formatarDataHora(item.data) }}</template>
          <template #itens="{ item }">{{ descreverItens(item.itens) }}</template>
          <template #total="{ item }">{{ formatarMoeda(item.total) }}</template>
          <template #custoTotal="{ item }">{{ formatarMoeda(item.custoTotal) }}</template>
          <template #lucro="{ item }">{{ formatarMoeda(calcularLucroVenda(item)) }}</template>
          <template #acoes="{ item }">
            <button
              type="button"
              class="botao botao-texto botao-texto-perigo"
              @click="vendaParaExcluir = item"
            >
              Excluir
            </button>
          </template>
        </TabelaDados>
      </section>
    </div>

    <ModalConfirmacao
      :aberto="gastoParaExcluir !== null"
      titulo="Excluir gasto fixo?"
      :mensagem="mensagemExclusaoGasto"
      texto-confirmar="Excluir"
      perigo
      :processando="excluindo"
      @confirmar="confirmarExclusaoGasto"
      @cancelar="gastoParaExcluir = null"
    />

    <ModalConfirmacao
      :aberto="vendaParaExcluir !== null"
      titulo="Excluir venda?"
      :mensagem="mensagemExclusaoVenda"
      texto-confirmar="Excluir"
      perigo
      :processando="excluindo"
      @confirmar="confirmarExclusaoVenda"
      @cancelar="vendaParaExcluir = null"
    />
  </main>
</template>

<style scoped>
.equilibrio-texto {
  margin: var(--espaco-3) 0 0;
  font-size: var(--texto-md);
}

/* Gastos fixos (coluna estreita) ao lado das vendas do mês (coluna larga) */
.painel-financeiro {
  display: grid;
  grid-template-columns: minmax(320px, 1fr) 2fr;
  align-items: start;
  gap: var(--espaco-6);
  margin-top: var(--espaco-6);
}

.painel-financeiro > .card {
  margin-top: 0;
}

@media (max-width: 1100px) {
  .painel-financeiro {
    grid-template-columns: 1fr;
  }
}
</style>
