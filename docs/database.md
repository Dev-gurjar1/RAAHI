# RAAHI V2 — Database Schema & PostGIS Setup

RAAHI uses PostgreSQL 15 with the PostGIS extension for spatial queries (radius searches, Haversine distance, guide proximity filtering).

## Entity Relationship Diagram (ERD)

```
[Users] (1) ------- (1) [TouristProfiles]
   |
   +---------- (1) [GuideProfiles] (1) ---- (*) [TourPackages]
   |                     |
   |                     +--- (1) [GuideVerifications (KYC)]
   |
   +---------- (*) [Bookings] (*) ---- (1) [Trips]
   |
   +---------- (*) [ScamReports]
```

## Core Schema Tables

### `users`
- `id`: UUID (PRIMARY KEY)
- `phone`: VARCHAR(20) UNIQUE NOT NULL
- `name`: VARCHAR(100) NOT NULL
- `email`: VARCHAR(150)
- `role`: VARCHAR(20) NOT NULL DEFAULT 'tourist'
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### `guide_profiles`
- `id`: UUID (PRIMARY KEY)
- `user_id`: UUID REFERENCES users(id)
- `rating`: NUMERIC(3,2) DEFAULT 5.0
- `review_count`: INT DEFAULT 0
- `languages`: TEXT[]
- `hourly_rate`: NUMERIC(10,2) NOT NULL
- `specialties`: TEXT[]
- `location`: GEOMETRY(Point, 4326) -- PostGIS Point
- `is_verified`: BOOLEAN DEFAULT true
- `is_online`: BOOLEAN DEFAULT false

### `bookings`
- `id`: UUID (PRIMARY KEY)
- `tourist_id`: UUID REFERENCES users(id)
- `guide_id`: UUID REFERENCES guide_profiles(id)
- `service_tier`: VARCHAR(50) NOT NULL
- `status`: VARCHAR(30) NOT NULL DEFAULT 'IDLE'
- `estimated_fare`: NUMERIC(10,2) NOT NULL
- `start_otp`: VARCHAR(6)
- `created_at`: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
