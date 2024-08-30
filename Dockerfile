# Étape 1 : Construire l'application avec Node.js
FROM node:18 AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances avec legacy-peer-deps
RUN npm install --legacy-peer-deps

# Copier tout le code source
COPY . .

# Construire l'application pour la production
RUN npm run build

# Étape 2 : Servir l'application avec Nginx
FROM nginx:alpine

# Copier les fichiers construits depuis l'étape précédente
COPY --from=build /app/dist /usr/share/nginx/html

# Copier la configuration Nginx
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# Ajouter un script d'entrée pour configurer Nginx dynamiquement
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Exposer les ports
EXPOSE 80
EXPOSE 443

# Démarrer Nginx via le script d'entrée
CMD ["/entrypoint.sh"]
