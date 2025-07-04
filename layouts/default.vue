<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      :mini-variant="mini"
      width="256"
      mini-variant-width="64"
    >
      <v-list nav dense>
        <v-list-item class="px-4 py-2">
          <v-list-item-content>
            <v-list-item-title class="text-h6" v-if="!mini">Menu</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        
        <v-divider></v-divider>

        <v-list-item 
          to="/dashboard" 
          link 
          @click="closeDrawerOnMobile"
        >
          <v-list-item-icon><v-icon>mdi-view-dashboard</v-icon></v-list-item-icon>
          <v-list-item-content v-if="!mini">
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item 
          to="/fornecedores/fornecedores" 
          link 
          @click="closeDrawerOnMobile"
        >
          <v-list-item-icon><v-icon>mdi-truck</v-icon></v-list-item-icon>
          <v-list-item-content v-if="!mini">
            <v-list-item-title>Fornecedores</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item 
          to="/insumos/insumos" 
          link 
          @click="closeDrawerOnMobile"
        >
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

    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Área Administrativa</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container class="pa-4">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/useAuth';
import { useDisplay } from 'vuetify';

const router = useRouter();
const { logout: doLogout } = useAuth();
const { mobile } = useDisplay();

const drawer = ref(false); 
const mini = ref(false);

function toggleDrawer() {
  drawer.value = !drawer.value;
}

function closeDrawerOnMobile() {
  if (mobile.value) {
    drawer.value = false;
  }
}

function logout() {
  doLogout();
  router.push('/login');
}
</script>

<style scoped>
</style>