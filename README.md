# RAAHI — Verified Locals • Fair Prices • Zero Worries

> RAAHI is an on-demand cultural local guide marketplace and tourist anti-scam platform built with React 18, TypeScript, Vite, Tailwind CSS (Light Mode Default), Node.js, NestJS/Express REST APIs, PostGIS database architecture, and Socket.IO real-time gateways.

## Features Overview

- **Light Mode Default UI Design System**: Warm off-white surfaces (`#FFFBEB`), Saffron accents (`#F59E0B`), Safety Emerald indicators (`#10B981`), and Outfit + Inter typography.
- **Leaflet Live Radar Map**: Real-time proximity radar displaying active verified local guides near Jaipur landmarks with animated pulse markers.
- **Uber-Style Guide Booking Engine**: 12-state state machine supporting instant matching, live ETA, and 4-digit Start-Tour OTP protection.
- **Fair Price Shield**: Fare calculator for Auto Rickshaw, E-Rickshaw, and Local Guides with overcharge warnings, bilingual (English/Hindi) rate card modals, and scam reporting.
- **AI-Assisted Travel Planner**: Multi-day Jaipur itinerary generator with daily timelines and itemized budget estimates.
- **Local Guide Dashboard**: Online/offline toggle, 15-second incoming request countdown modal, tour package manager, and KYC center tracking.

## Repository Structure

```
RAAHI/
├── apps/
│   ├── web/           # React + Vite + Tailwind CSS Frontend
│   └── api/           # Node.js + NestJS/Express Backend REST & Sockets
├── packages/
│   └── shared-types/  # Shared TypeScript interfaces & Socket events
├── database/          # SQL migrations & Jaipur seed dataset
└── docs/              # System architecture, DB ERD & API specifications
```

## Running the Application

```bash
# 1. Install dependencies
npm install

# 2. Build shared types
npm --prefix packages/shared-types run build

# 3. Start API and Web applications concurrently
npm run dev
```

Open your browser to `http://localhost:5173` to explore RAAHI!
