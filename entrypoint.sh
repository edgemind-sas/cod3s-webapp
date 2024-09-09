#!/bin/sh

# Afficher les variables d'environnement pour le débogage
echo "URL WebApp: https://localhost:$NGINX_SSL_PORT/modelisation"

# Remplacer les variables d'environnement dans nginx.conf.template et les écrire dans nginx.conf
envsubst '${BACKEND_PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Démarrer Nginx
nginx -g 'daemon off;'
