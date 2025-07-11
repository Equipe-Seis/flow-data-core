import { useState } from "nuxt/app";
import { computed } from "vue";

export const useAuth = () => {
  const user = useState<string | null>("user", () => "");

  const login = (email: string, password: string) => {
    if (email === "admin@teste.com" && password === "123456") {
      user.value = email;
      return true;
    }

    return false;
  };

  const logout = () => {
    user.value = null;
  };

  const isAuthenticated = computed(() => !!user.value);

  return { user, login, logout, isAuthenticated };
};
