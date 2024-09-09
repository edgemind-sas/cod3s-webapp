/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)

registerPlugins(app)

// Set the document title dynamically
const projectName = import.meta.env.VITE_PROJECT_NAME || 'DefaultProjectName';
document.title = `cod3sApp-${projectName}`;

app.mount('#app')
