import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home' , 
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/financeiro',
      name: 'Financeiro' , 
      component: () => import('../views/FinanceiroView.vue')
    },
    {
      path: '/venda/nova-venda' ,
      name: 'Nova Venda' ,
      component: () => import('../views/NovaVendaView.vue')
    },
    {
      path: '/produtos',
      name: 'Produtos',
      component: () => import ('../views/ProdutosView.vue')
    }
  ],
})

export default router
