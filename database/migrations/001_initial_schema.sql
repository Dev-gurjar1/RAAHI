-- RAAHI Database Migration 001: Initial Schema with PostGIS Support

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150),
  avatar VARCHAR(255),
  role VARCHAR(20) NOT NULL DEFAULT 'tourist',
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Guide Profiles Table
CREATE TABLE IF NOT EXISTS guide_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  avatar VARCHAR(255) NOT NULL,
  rating NUMERIC(3,2) DEFAULT 5.0,
  review_count INT DEFAULT 0,
  languages TEXT[] NOT NULL,
  experience VARCHAR(50) NOT NULL,
  hourly_rate NUMERIC(10,2) NOT NULL,
  specialties TEXT[] NOT NULL,
  latitude NUMERIC(10,6) NOT NULL,
  longitude NUMERIC(10,6) NOT NULL,
  location GEOMETRY(Point, 4326),
  verified BOOLEAN DEFAULT true,
  online BOOLEAN DEFAULT false,
  response_time VARCHAR(50) DEFAULT '< 5 mins',
  completed_trips INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tour Packages Table
CREATE TABLE IF NOT EXISTS tour_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guide_id UUID REFERENCES guide_profiles(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL,
  duration VARCHAR(50) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  rating NUMERIC(3,2) DEFAULT 4.9,
  image VARCHAR(255) NOT NULL,
  highlights TEXT[] NOT NULL,
  included TEXT[] NOT NULL,
  meeting_point VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tourist_id UUID REFERENCES users(id),
  guide_id UUID REFERENCES guide_profiles(id),
  service_tier VARCHAR(50) NOT NULL,
  pickup_location VARCHAR(255) NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'IDLE',
  estimated_fare NUMERIC(10,2) NOT NULL,
  final_fare NUMERIC(10,2),
  start_otp VARCHAR(6),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scam Reports Table
CREATE TABLE IF NOT EXISTS scam_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  category VARCHAR(50) NOT NULL,
  expected_fare NUMERIC(10,2) NOT NULL,
  charged_fare NUMERIC(10,2) NOT NULL,
  description TEXT NOT NULL,
  location_details VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'submitted',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Spatial Indexes
CREATE INDEX IF NOT EXISTS idx_guide_location ON guide_profiles USING GIST(location);
