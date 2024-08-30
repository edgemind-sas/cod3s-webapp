#!/bin/sh

# Afficher les variables d'environnement pour le débogage
echo "BACKEND_PORT is set to: $BACKEND_PORT"

# Remplacer les variables d'environnement dans nginx.conf.template et les écrire dans nginx.conf
envsubst '${BACKEND_PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Démarrer Nginx
nginx -g 'daemon off;'
