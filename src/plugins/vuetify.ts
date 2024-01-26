import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'myCustomTheme', 
    themes: {
      myCustomTheme: {
        colors: {
          primary: '#c9d4e6ff',    
          secondary: '#ef7b26ff', 
          
          EMBlue: '#1f416dff',
          EMBrown: '#bf8740ff',
          EMRed: '#a10010ff',
          EMDarkBrown: '#4c000aff',
          
        },
      },
    },
  },
})
