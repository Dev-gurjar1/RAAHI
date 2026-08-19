# RAAHI V2 — Monorepo Architecture Overview

RAAHI V2 is structured as a production-grade full-stack monorepo designed for high concurrency, real-time location matching, and transparent local guide booking.

## System Architecture Diagram

```
+-----------------------------------------------------------------------+
|                             CLIENT LAYER                              |
|   React 18 + Vite + TypeScript + Tailwind CSS (Light Theme Default)    |
|    Zustand State Stores | Leaflet 1.9.4 Maps | Socket.IO Client     |
+-----------------------------------------------------------------------+
                                   | REST API (HTTP) & WebSockets
                                   v
+-----------------------------------------------------------------------+
|                             API GATEWAY                               |
|              Node.js NestJS / Express Backend (TypeScript)             |
|  JWT Auth Guard | DTO Validation Pipe | Rate Limiter | CORS Guard    |
+-----------------------------------------------------------------------+
     |                    |                      |                  |
     v                    v                      v                  v
+-----------+    +------------------+    +---------------+   +------------+
| Auth      |    | Booking State    |    | Fair Price    |   | Realtime   |
| Engine    |    | Machine Engine   |    | Tariff Engine |   | Gateway    |
+-----------+    +------------------+    +---------------+   +------------+
     |                    |                      |                  |
     +--------------------+----------------------+------------------+
                                   |
                                   v
+-----------------------------------------------------------------------+
|                          PERSISTENCE LAYER                            |
|        PostgreSQL (PostGIS Geospatial)  +  Redis Cache Engine         |
+-----------------------------------------------------------------------+
```

## Key Architectural Principles
1. **Separation of Concerns**: Frontend state (`apps/web`) is kept decoupled from business logic and tariff algorithms (`apps/api`).
2. **Light Theme First**: Default visual presentation uses warm white `#FFFBEB` backgrounds, Saffron `#F59E0B` brand accents, and Emerald `#10B981` safety states.
3. **Strict State Machine**: Booking workflow transitions (`SEARCHING` -> `MATCHED` -> `ARRIVED` -> `OTP_PENDING` -> `TRIP_STARTED` -> `TRIP_COMPLETED`) are enforced on the backend.
4. **Service Abstractions**: External systems (Google OAuth, Razorpay payments, SMS OTP, Police dispatch) are implemented via modular services with `DEMO_MODE` toggles.
