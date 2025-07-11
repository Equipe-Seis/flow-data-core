<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app temporary width="256">
      <v-list nav dense>
        <v-list-item class="px-4 py-2" title="Menu" />

        <v-divider></v-divider>

        <v-list-item to="/dashboard" link @click="closeDrawerOnMobile" prepend-icon="mdi-view-dashboard"
          title="Dashboard" color="primary" />
        <v-list-item to="/fornecedores/fornecedores" link @click="closeDrawerOnMobile" prepend-icon="mdi-truck"
          title="Fornecedores" color="primary" />
        <v-list-item to="/insumos/insumos" link @click="closeDrawerOnMobile" prepend-icon="mdi-package-variant"
          title="Insumos" color="primary" />
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn @click="logout" prepend-icon="mdi-logout" variant="outlined" block color="primary">
            Sair
          </v-btn>
        </div>
      </template>
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