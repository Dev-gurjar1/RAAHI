# RAAHI V2 — REST API & WebSocket Specification

Base URL: `http://localhost:4000/api/v1`

## REST Endpoints

### Auth Module
- `POST /auth/send-otp` — Request 6-digit verification code.
- `POST /auth/verify-otp` — Validate code & return JWT token.
- `POST /auth/google` — Simulated Google OAuth callback.

### Guides Module
- `GET /guides` — List verified local guides with distance & radius filters.
- `GET /guides/:id` — Get detailed guide profile.
- `POST /guides/online` — Set guide online status (`online: true`).
- `POST /guides/offline` — Set guide offline status (`online: false`).

### Fair Price Module
- `POST /fair-price/calculate` — Calculate benchmark fare range for Auto, E-Rickshaw, or Guide.

### Bookings Module
- `POST /bookings` — Create a new tourist guide booking request.
- `POST /bookings/:id/accept` — Guide accepts booking request.
- `POST /bookings/:id/start-otp` — Verify 4-digit Start-Tour OTP.
- `POST /bookings/:id/complete` — Complete active tour trip.

### Planner & Reports
- `POST /planner/generate` — Generate multi-day travel itinerary with budget breakdown.
- `POST /reports/scam` — Submit an overcharging or safety incident report.

## WebSocket Events (Socket.IO)

- `booking:searching` — Fired when tourist initiates guide matching.
- `booking:matched` — Fired when guide is matched.
- `guide:request` — Sent to online guides with 15s countdown timer.
- `trip:started` — Fired when Start-Tour OTP is validated.
