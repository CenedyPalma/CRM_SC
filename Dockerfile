# ==============================================================================
# Multi-Stage Production Dockerfile for Business OS & Enterprise CRM Monorepo
# ==============================================================================

FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.1.0 --activate
RUN apk add --no-cache libc6-compat openssl

# ------------------------------------------------------------------------------
# Dependencies & Builder Stage
# ------------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app

# Copy root manifest and workspace manifests
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY packages/ ./packages/
COPY apps/ ./apps/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma Client & Build all workspaces
RUN pnpm --filter @repo/database run generate
RUN pnpm run build

# Prune dev dependencies for production
RUN pnpm prune --prod

# ------------------------------------------------------------------------------
# Universal Production Runner Stage
# ------------------------------------------------------------------------------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built node_modules and output bundles
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps ./apps
COPY --from=builder /app/package.json ./package.json

ARG APP_NAME=web-core
ENV TARGET_APP=$APP_NAME

EXPOSE 3000 4000

# Default command starts the targeted app
CMD ["sh", "-c", "pnpm --filter @repo/$TARGET_APP start"]
