# Utiliser une image Node.js
FROM node:16

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code source dans le conteneur
COPY . .

# Changer les permissions du répertoire
RUN chown -R node:node /app

# Exécuter en tant qu'utilisateur non-root
USER node

# Exposer le port 3000 par défaut pour Vite
EXPOSE 3000

# Commande pour démarrer le serveur de développement
CMD ["npm", "run", "dev", "--", "--host"]
