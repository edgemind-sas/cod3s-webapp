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

# Copier le script entrypoint.sh dans le conteneur
COPY entrypoint.sh /usr/local/bin/entrypoint.sh

# Changer les permissions du script pour le rendre exécutable
RUN chmod +x /usr/local/bin/entrypoint.sh

# Changer les permissions du répertoire
RUN chown -R node:node /app

# Exécuter en tant qu'utilisateur non-root
USER node

# Exposer le port 3000 par défaut pour Vite
EXPOSE 3000

# Définir le script entrypoint.sh comme point d'entrée
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Commande pour démarrer le serveur de développement
CMD ["npm", "run", "dev", "--", "--host"]
