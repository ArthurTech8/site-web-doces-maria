import { createRouter, createWebHistory } from 'vue-router'

// Os links do sistema usam o "name" da rota (ex.: { name: 'produtos' }),
// então o "path" pode mudar sem quebrar o menu
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/venda/nova-venda',
      name: 'nova-venda',
      component: () => import('@/views/NovaVendaView.vue'),
    },
    {
      path: '/produtos',
      name: 'produtos',
      component: () => import('@/views/ProdutosView.vue'),
    },
    {
      path: '/financeiro',
      name: 'financeiro',
      component: () => import('@/views/FinanceiroView.vue'),
    },
  ],
})

export default router
