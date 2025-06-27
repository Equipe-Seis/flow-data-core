<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      app
      permanent
      :mini-variant="mini"
      width="256"
      mini-variant-width="64"
    >
      <v-list nav dense>
        <v-list-item-title class="px-4 py-2">Menu</v-list-item-title>

        <v-list-item to="/dashboard" link>
          <v-list-item-icon><v-icon>mdi-view-dashboard</v-icon></v-list-item-icon>
          <v-list-item-content v-if="!mini">
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item to="/fornecedores/fornecedores" link>
          <v-list-item-icon><v-icon>mdi-truck</v-icon></v-list-item-icon>
          <v-list-item-content v-if="!mini">
            <v-list-item-title>Fornecedores</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item to="/insumos/insumos" link>
          <v-list-item-icon><v-icon>mdi-package-variant</v-icon></v-list-item-icon>
          <v-list-item-content v-if="!mini">
            <v-list-item-title>Insumos</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="logout" link>
          <v-list-item-icon><v-icon>mdi-logout</v-icon></v-list-item-icon>
          <v-list-item-content v-if="!mini">
            <v-list-item-title>Sair</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar app color="primary" dark>
      <v-btn icon @click="toggleMini">
        <v-icon>{{ mini ? 'mdi-menu-open' : 'mdi-menu' }}</v-icon>
      </v-btn>
      <v-toolbar-title>Área Administrativa</v-toolbar-title>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container class="pa-4">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const drawer = ref(true)
const mini = ref(false)

function toggleMini() {
  mini.value = !mini.value
}

const router = useRouter()
const { logout: doLogout } = useAuth()

function logout() {
  doLogout()
  router.push('/login')
}
</script>
