# RAAHI V2 — Deployment & Environment Setup

## Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker & Docker Compose (optional for local DB)

## Quick Start (Development Mode)

1. **Install Monorepo Dependencies**:
   ```bash
   npm install
   ```

2. **Start Database & Redis (Docker)**:
   ```bash
   docker-compose up -d
   ```

3. **Build Shared Types**:
   ```bash
   npm --prefix packages/shared-types run build
   ```

4. **Launch Monorepo (Concurrent Frontend & Backend)**:
   ```bash
   npm run dev
   ```

Frontend will launch on `http://localhost:5173` (or available port).
Backend API will run on `http://localhost:4000`.

## Production Build

```bash
npm run build
```
Outputs:
- Backend: `apps/api/dist`
- Frontend: `apps/web/dist`
