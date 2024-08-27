#!/bin/bash

# Charger les variables d'environnement depuis le fichier .env
if [ -f /app/.env ]; then
  export $(cat /app/.env | grep -v '#' | awk '/=/ {print $1}')
fi

# Vérifier si PROJECT_NAME est défini
if [ -z "$PROJECT_NAME" ]; then
  echo "PROJECT_NAME is not set. Please check your .env file."
  exit 1
fi

# Attendre que les conteneurs soient complètement démarrés
sleep 10  # Vous pouvez ajuster ce délai selon vos besoins

# Récupérer les ports mappés pour chaque conteneur
FRONTEND_PORT=$(docker ps --filter "name=${PROJECT_NAME}-webapp" --format "{{.Ports}}" | awk -F'->' '{print $1}' | awk -F':' '{print $2}')
API_PORT=$(docker ps --filter "name=${PROJECT_NAME}-api" --format "{{.Ports}}" | awk -F'->' '{print $1}' | awk -F':' '{print $2}')
NGINX_HTTP_PORT=$(docker ps --filter "name=${PROJECT_NAME}-nginx" --format "{{.Ports}}" | grep -m1 "80/tcp" | awk -F'->' '{print $1}' | awk -F':' '{print $2}')
NGINX_HTTPS_PORT=$(docker ps --filter "name=${PROJECT_NAME}-nginx" --format "{{.Ports}}" | grep -m1 "443/tcp" | awk -F'->' '{print $1}' | awk -F':' '{print $2}')
MONGODB_PORT=$(docker ps --filter "name=${PROJECT_NAME}-db" --format "{{.Ports}}" | awk -F'->' '{print $1}' | awk -F':' '{print $2}')

# Créer ou mettre à jour le fichier .env avec les ports mappés
echo "REACT_APP_API_URL=http://localhost:${API_PORT}" > /app/.env
echo "REACT_APP_FRONTEND_URL=http://localhost:${FRONTEND_PORT}" >> /app/.env
echo "REACT_APP_NGINX_HTTP_URL=http://localhost:${NGINX_HTTP_PORT}" >> /app/.env
echo "REACT_APP_NGINX_HTTPS_URL=https://localhost:${NGINX_HTTPS_PORT}" >> /app/.env
echo "MONGODB_URL=mongodb://rootuser:rootpass@localhost:${MONGODB_PORT}" >> /app/.env

# Lancer l'application front-end
exec "$@"
