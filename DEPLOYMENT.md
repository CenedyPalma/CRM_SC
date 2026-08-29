# 🚀 Production Deployment Manual — Business OS & Enterprise CRM

This document provides step-by-step instructions for deploying the **Business OS & Enterprise CRM** monorepo to production environments (Ubuntu/Debian VPS, AWS EC2, DigitalOcean, or GCP).

---

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Option A: Docker Compose Deployment (Recommended)](#option-a-docker-compose-deployment-recommended)
4. [Option B: Bare Metal / VPS Deployment (PM2 + Systemd)](#option-b-bare-metal--vps-deployment-pm2--systemd)
5. [SSL / HTTPS Configuration with Let's Encrypt](#ssl--https-configuration-with-lets-encrypt)
6. [Database Migrations & Backup Strategy](#database-migrations--backup-strategy)
7. [Production Health Checks](#production-health-checks)

---

## 🏗️ Architecture Overview

The system runs as an enterprise microservice monorepo:
- **Frontend & Gateway:** Next.js (Port `4000`) with unified API routing (`/api/*`).
- **Backend Microservices:** 21 NestJS services (Ports `3001` - `3026`) handling domain operations (CRM, Sales, Workflows, BI Engine, Auth, Settings, etc.).
- **Data Layer:** PostgreSQL (Port `5432`) + Redis Queue (Port `6379`).
- **Edge Reverse Proxy:** NGINX (Ports `80`/`443`) terminating SSL and routing traffic.

---

## ⚙️ Prerequisites

- **OS:** Ubuntu 22.04 LTS or newer
- **Memory:** Minimum 4GB RAM (8GB recommended for full microservice suite)
- **Software:**
  - Docker & Docker Compose plugin (`docker compose version`)
  - Node.js `20.x` or `22.x` & `pnpm` (if running bare metal)
  - OpenSSL (for generating secrets)

---

## 🐳 Option A: Docker Compose Deployment (Recommended)

### Step 1: Clone Repository & Setup Environment
```bash
git clone git@github.com:CenedyPalma/CRM_SC.git
cd CRM_SC

# Copy environment template
cp .env.example .env
```

### Step 2: Generate Production Secrets
Generate a cryptographically secure 256-bit JWT secret:
```bash
openssl rand -base64 32
```
Paste this value into `.env` under `JWT_SECRET=`.

Update your database credentials, domain, and external API keys (`OPENAI_API_KEY`, `SMTP_*`, etc.) in `.env`.

### Step 3: Launch Production Containers
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### Step 4: Verify Running Containers
```bash
docker compose -f docker-compose.prod.yml ps
```

---

## 🖥️ Option B: Bare Metal / VPS Deployment (PM2 + Systemd)

If deploying directly on a Linux server without Docker:

### Step 1: Install Global Dependencies
```bash
npm install -g pnpm pm2
```

### Step 2: Install Project Dependencies & Build
```bash
pnpm install --frozen-lockfile
pnpm --filter @repo/database run generate
pnpm --filter @repo/database run db:push
pnpm run build
```

### Step 3: Start Services with PM2
```bash
pm2 start "pnpm --filter @repo/web-core start" --name "crm-web"
pm2 start "pnpm --filter @repo/crm start" --name "crm-service"
pm2 start "pnpm --filter @repo/automation start" --name "automation-service"
pm2 start "pnpm --filter @repo/bi-engine start" --name "bi-engine-service"
pm2 save
pm2 startup
```

---

## 🔒 SSL / HTTPS Configuration with Let's Encrypt

Install Certbot to secure your domain with free automated SSL certificates:

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d crm.yourdomain.com
```

Certbot will automatically configure HTTPS renewal in NGINX.

---

## 💾 Database Migrations & Backup Strategy

### Running Migrations in Production
```bash
# Push schema updates safely
pnpm --filter @repo/database run db:push
```

### Automated Daily PostgreSQL Backups
Add a cron job to back up your PostgreSQL database every night at 2:00 AM:

```bash
crontab -e
```
Add the line:
```cron
0 2 * * * pg_dump -U postgres -h localhost crm_db | gzip > /var/backups/crm_db_$(date +\%Y\%m\%d).sql.gz
```

---

## 🩺 Production Health Checks

| Endpoint | Target | Expected Response |
| :--- | :--- | :--- |
| `GET /health` | NGINX Edge | `{"status":"UP"}` |
| `GET /api/bi/metrics/dashboard` | API Gateway & BI | `{"revenue": "...", "totalContacts": ...}` |
| `GET /login` | Web UI | `200 OK` |
