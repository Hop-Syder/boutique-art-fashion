# =============================================================================
# Dockerfile — ART FASHION Monorepo (Builder Stage)
# Stage 1 : Build pnpm (Storefront + Admin-CMS)
# Stage 2 : Nginx Alpine (serveur de production)
# =============================================================================

# ── Stage 1 : Build ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

WORKDIR /app

# Copie des manifests pour optimiser le cache Docker
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./
COPY packages/shared/package.json     ./packages/shared/
COPY apps/storefront/package.json     ./apps/storefront/
COPY apps/admin-cms/package.json      ./apps/admin-cms/

RUN pnpm install --frozen-lockfile

# Copie du code source complet
COPY . .

# Build Turborepo (storefront + admin-cms)
RUN pnpm build

# ── Stage 2 : Nginx ─────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Configuration Nginx single-origin
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Builds générés
COPY --from=builder /app/apps/storefront/dist  /usr/share/nginx/html/storefront
COPY --from=builder /app/apps/admin-cms/dist   /usr/share/nginx/html/admin

# Dossier uploads (sera monté par volume Docker → données persistantes)
RUN mkdir -p /usr/share/nginx/html/uploads

# Un seul port exposé (single-origin)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
