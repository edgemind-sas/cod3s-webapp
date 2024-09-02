// src/config/globals.ts
function getApiBaseUrl(): string {
  const port = import.meta.env.VITE_BACKEND_PORT; // Valeur par défaut si la variable d'environnement n'est pas définie
  return `http://localhost:${port}/`;
}
export default {
  apiBaseUrl: getApiBaseUrl(),
  pathDocument: '/home/abderrahim/Bureau/INTWINE/project/cod3s-webapp/src/assets'
};
