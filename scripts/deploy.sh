#!/usr/bin/env bash
# =============================================================================
# deploy.sh — Script de déploiement ART FASHION sur VPS LWS
# Usage : bash deploy.sh
# Auteur : @hopsyder | Nexus Partners
# =============================================================================
set -euo pipefail

# ── Couleurs terminal ────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✅ $*${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $*${NC}"; }
err()  { echo -e "${RED}❌ $*${NC}"; exit 1; }

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║       ART FASHION — Déploiement VPS LWS                 ║"
echo "║       Boutique Prêt-à-Porter · Cotonou, Bénin           ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# ── 1. Vérification Docker ───────────────────────────────────────────────────
if ! command -v docker &>/dev/null; then
  warn "Docker non trouvé. Installation en cours..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
  ok "Docker installé"
else
  ok "Docker trouvé : $(docker --version)"
fi

if ! docker compose version &>/dev/null; then
  warn "Docker Compose v2 non trouvé. Installation..."
  apt-get install -y docker-compose-plugin 2>/dev/null || \
  curl -SL "https://github.com/docker/compose/releases/download/v2.27.1/docker-compose-linux-x86_64" \
    -o /usr/local/bin/docker-compose && chmod +x /usr/local/bin/docker-compose
  ok "Docker Compose installé"
else
  ok "Docker Compose trouvé : $(docker compose version)"
fi

# ── 2. Arrêt des conteneurs existants ────────────────────────────────────────
echo ""
echo "━━━ Arrêt des conteneurs existants..."
docker compose down --remove-orphans 2>/dev/null || true
ok "Conteneurs arrêtés"

# ── 3. Build et lancement ─────────────────────────────────────────────────────
echo ""
echo "━━━ Build + lancement (peut prendre 3-5 minutes)..."
docker compose up -d --build

# ── 4. Attente healthcheck ────────────────────────────────────────────────────
echo ""
echo "━━━ Attente du démarrage des services..."
sleep 5

MAX_WAIT=60
ELAPSED=0
while [ $ELAPSED -lt $MAX_WAIT ]; do
  STATUS=$(docker compose ps --format json 2>/dev/null | python3 -c "
import sys, json
data = [json.loads(l) for l in sys.stdin if l.strip()]
ok = all(s.get('Health','') in ('healthy','') for s in data)
print('ok' if ok else 'wait')
" 2>/dev/null || echo "wait")
  [ "$STATUS" = "ok" ] && break
  sleep 3; ELAPSED=$((ELAPSED+3))
  echo "  Démarrage en cours... ($ELAPSED/$MAX_WAIT s)"
done

# ── 5. Tests de santé ─────────────────────────────────────────────────────────
echo ""
echo "━━━ Vérification des endpoints..."

# Storefront
if curl -sf http://localhost/ -o /dev/null; then
  ok "Storefront accessible : http://localhost/"
else
  err "Storefront inaccessible !"
fi

# Admin
if curl -sf http://localhost/admin/ -o /dev/null; then
  ok "Admin CMS accessible : http://localhost/admin/"
else
  warn "Admin CMS : réponse inattendue (vérifier http://localhost/admin/)"
fi

# API Upload
if curl -sf http://localhost/api/health -o /dev/null; then
  ok "API Upload accessible : http://localhost/api/health"
else
  warn "API Upload : vérifier http://localhost/api/health"
fi

# ── 6. Affichage statut final ────────────────────────────────────────────────
echo ""
echo "━━━ Statut des conteneurs :"
docker compose ps

# ── 7. IP du serveur ──────────────────────────────────────────────────────────
SERVER_IP=$(curl -sf https://ipv4.icanhazip.com 2>/dev/null || hostname -I | awk '{print $1}')

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║   🎉  DÉPLOIEMENT RÉUSSI !                              ║"
echo "╠══════════════════════════════════════════════════════════╣"
echo "║                                                          ║"
printf  "║   🛍️  Boutique vitrine : http://%-24s║\n" "${SERVER_IP}/"
printf  "║   ⚙️  Back-office admin : http://%-24s║\n" "${SERVER_IP}/admin/"
printf  "║   🔧 API health check  : http://%-24s║\n" "${SERVER_IP}/api/health"
echo "║                                                          ║"
echo "║   💡 Prochaines étapes :                                ║"
echo "║   → Configurer votre nom de domaine vers cette IP       ║"
echo "║   → Activer HTTPS : certbot --nginx -d votre-domaine    ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
