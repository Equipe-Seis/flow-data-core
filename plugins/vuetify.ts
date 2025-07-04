import "@mdi/font/css/materialdesignicons.css"
import "vuetify/styles"

import { createVuetify } from 'vuetify'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: true,
    defaults: {
      VBtn: {
        style: [{ textTransform: 'none' }],
      },
    },
    theme: {
      defaultTheme: 'customTheme',
      themes: {
        customTheme: {
          dark: false,
          colors: {
            primary: '#056618',
            secondary: '#00FA4F',
            accent: '#82B1FF',
            error: '#FD6F71',
            info: '#2196F3',
            success: '#4CAF50',
            warning: 'F2FB00',
            background: '#f5f5f5',
            surface: '#FFFFFF',
          },
        },
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
