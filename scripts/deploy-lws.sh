#!/usr/bin/env bash
/**
 * @author @hopsyder
 * @organization Nexus Partners
 * @description Script de déploiement automatique 1-clic pour VPS LWS (Ubuntu / Debian)
 * @created 2026-08-19
 * @updated 2026-08-19
 * 🌐 ceo.nexuspartners.xyz
 * 📧 daoudaabassichristian@gmail.com
 */

set -e

echo "🚀 Début du déploiement automatisé ART FASHION sur VPS LWS..."

# 1. Mise à jour du système & Installation des dépendances système
echo "📦 Installation de Nginx, Node.js & Certbot..."
sudo apt update && sudo apt install -y curl git nginx certbot python3-certbot-nginx

# 2. Installation de Node.js 20 LTS & pnpm
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

if ! command -v pnpm &> /dev/null; then
    sudo npm install -g pnpm pm2
fi

# 3. Installation du projet & compilation des bundles de production
echo "🔨 Compilation des bundles e-Commerce Storefront & Admin CMS..."
pnpm install
pnpm build

# 4. Configuration des dossiers de stockage d'images statiques
echo "📁 Création des répertoires de stockage des médias..."
sudo mkdir -p /var/www/art-fashion/uploads
sudo chown -R www-data:www-data /var/www/art-fashion/uploads

echo "✅ Déploiement compilé avec succès ! Prêt pour Nginx."
