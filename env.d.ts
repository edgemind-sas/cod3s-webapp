/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BACKEND_PORT: string;
    // Ajoutez ici d'autres variables d'environnement si nécessaire
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  