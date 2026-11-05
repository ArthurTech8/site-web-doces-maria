<script setup lang="ts">
import { RouterLink } from 'vue-router'

// Para adicionar uma tela no menu, inclua o nome da rota (definido em router/index.ts)
const links = [
  { rota: 'home', texto: 'Home' },
  { rota: 'nova-venda', texto: 'Nova Venda' },
  { rota: 'produtos', texto: 'Produtos' },
  { rota: 'financeiro', texto: 'Financeiro' },
]
</script>

<template>
  <header class="menu">
    <RouterLink :to="{ name: 'home' }" class="menu-marca">
      <span class="menu-logo" aria-hidden="true">🧁</span>
      Doces da Maria
    </RouterLink>

    <nav class="menu-links" aria-label="Menu principal">
      <RouterLink
        v-for="link in links"
        :key="link.rota"
        :to="{ name: link.rota }"
        class="menu-link"
      >
        {{ link.texto }}
      </RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.menu {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--espaco-6);
  padding: 0 var(--espaco-8);
  border-bottom: 1px solid var(--cor-borda);
  background-color: var(--cor-superficie);
  box-shadow: var(--sombra-card);
}

.menu-marca {
  display: flex;
  align-items: center;
  gap: var(--espaco-2);
  color: var(--cor-texto);
  font-size: 18px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}

.menu-logo {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: var(--raio-md);
  background-color: var(--cor-primaria-clara);
  font-size: 20px;
}

.menu-links {
  display: flex;
  gap: var(--espaco-1);
}

.menu-link {
  padding: 22px var(--espaco-4) 19px;
  border-bottom: 3px solid transparent;
  color: var(--cor-texto-suave);
  font-size: var(--texto-md);
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition:
    color 0.15s,
    border-color 0.15s;
}

.menu-link:hover {
  color: var(--cor-texto);
}

.menu-link.router-link-exact-active {
  border-bottom-color: var(--cor-primaria);
  color: var(--cor-primaria);
}

/* Telas pequenas: marca em cima e links roláveis embaixo */
@media (max-width: 720px) {
  .menu {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: var(--espaco-3) var(--espaco-4) 0;
  }

  .menu-links {
    overflow-x: auto;
  }

  .menu-link {
    padding: var(--espaco-3);
  }
}
</style>
