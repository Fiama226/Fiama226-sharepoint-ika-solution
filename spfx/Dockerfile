# syntax=docker/dockerfile:1.7
# =============================================================================
# IKA Intranet SPFx — Dockerfile multi-stage
# -----------------------------------------------------------------------------
# Stages :
#   builder  → compile Tailwind + heft test + heft package-solution (production)
#              Produit un .sppkg prêt à être uploadé dans l'App Catalog.
#   dev      → image de développement avec hot-reload du workbench SPFx
#              (heft start).
#
# Build prod (par défaut) :
#     docker build -t ika-spfx:prod .
#     docker run --rm -v $(pwd)/sharepoint/solution:/out ika-spfx:prod
#
# Build dev :
#     docker build --target dev -t ika-spfx:dev .
#     docker compose up -d spfx-workbench
#     # workbench dispo sur https://localhost:4321
# =============================================================================

ARG NODE_VERSION=22.11.0

# -----------------------------------------------------------------------------
# Base : image Node LTS utilisée par tous les stages
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION}-bookworm-slim AS base
WORKDIR /app

# Utilitaires utiles dans tous les stages
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
       ca-certificates curl git python3 build-essential \
  && rm -rf /var/lib/apt/lists/*

# -----------------------------------------------------------------------------
# Deps : installation des dépendances npm (cache-friendly)
# -----------------------------------------------------------------------------
FROM base AS deps
WORKDIR /app

# Copie d'abord les manifests pour profiter du cache Docker
COPY package.json package-lock.json* .npmrc* ./

# Installation clean en mode CI
RUN npm ci --no-audit --no-fund --prefer-offline

# -----------------------------------------------------------------------------
# Builder : build de production (Tailwind + Heft package-solution)
# -----------------------------------------------------------------------------
FROM deps AS builder
WORKDIR /app

COPY tsconfig.json ./
COPY config ./config
COPY sharepoint ./sharepoint
COPY src ./src

# Compile Tailwind (utilisé par les tests/Heft si nécessaire)
RUN npm run build:tailwind

# Build Heft en production : test + package-solution
RUN npm run build

# Récupère le package .sppkg généré
RUN ls -la sharepoint/solution/ 2>/dev/null || ls -la ./solution/ 2>/dev/null

# -----------------------------------------------------------------------------
# Output : image minimale qui ne contient QUE le .sppkg (pour export)
# -----------------------------------------------------------------------------
FROM scratch AS output
COPY --from=builder /app/sharepoint/solution /solution
COPY --from=builder /app/sharepoint/assets/LICENSE.md /LICENSE.md

# -----------------------------------------------------------------------------
# Dev : image avec workbench SPFx et hot-reload
# -----------------------------------------------------------------------------
FROM base AS dev
WORKDIR /app

ENV NODE_ENV=development \
    BROWSER=none \
    CI=true \
    HEFT_TELEMETRY_OPT_OUT=true

# Installation des dépendances (la couche deps sera réutilisée si possible
# via un cache local nommé "spfx-deps")
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json* ./
COPY tsconfig.json ./
COPY config ./config
COPY src ./src

# Ports Heft (workbench) + proxy HTTPS local
EXPOSE 4321 4322

# Healthcheck simple : on vérifie que le dev-server répond
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=5 \
  CMD curl -kfsS https://localhost:4321/_layouts/15/workbench.aspx -o /dev/null \
   || curl -kfsS https://localhost:4321/ -o /dev/null \
   || exit 1

# Commande par défaut : tailwind:watch en arrière-plan + heft start au premier plan
CMD ["sh", "-c", "\
  echo '[docker] Building Tailwind once before starting workbench...' && \
  npm run build:tailwind && \
  echo '[docker] Starting Heft dev server (workbench on https://localhost:4321)...' && \
  npm run start \
"]
