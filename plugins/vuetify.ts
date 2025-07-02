// plugins/vuetify.ts
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import { createVuetify } from 'vuetify'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: true,
    defaults: {
      VBtn: {
        style: [{ textTransform: 'none' }],
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})