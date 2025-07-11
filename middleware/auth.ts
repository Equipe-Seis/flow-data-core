import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { useAuth } from "../composables/useAuth";

export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth();

  if (to.path === "/login") return;

  if (to.path === "/dashboard" && !isAuthenticated.value) {
    return navigateTo("/login");
  }

  //if (!isAuthenticated.value && process.client) {
  //return navigateTo('/login')
  //}
});
