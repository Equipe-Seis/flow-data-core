import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import { createVuetify } from "vuetify";
import { defineNuxtPlugin } from "nuxt/app";

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    defaults: {
      VBtn: {
        style: [{ textTransform: "none" }],
      },
      VTextField: {
        variant: "outlined"
      },
      VSelect: {
        variant: "outlined"
      },
    },
    theme: {
      defaultTheme: "customTheme",
      themes: {
        customTheme: {
          dark: false,
          colors: {
            primary: "#1AAD46",
            secondary: "#1FCF54",
            accent: "#10692B",
            error: "#FD6F71",
            info: "#2196F3",
            success: "#00C31D",
            warning: "#E0D82D",
            background: "#f5f5f5",
            surface: "#FFFFFF",
          },
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
