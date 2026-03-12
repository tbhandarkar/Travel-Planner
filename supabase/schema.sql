-- ============================================================
-- AI Travel Planner — Supabase Schema
-- Run this in the Supabase SQL editor: https://app.supabase.com
-- ============================================================

-- ─── Trips ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trips (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  destination TEXT        NOT NULL,
  days        INTEGER     NOT NULL CHECK (days BETWEEN 1 AND 14),
  budget      TEXT,
  interests   TEXT[]      DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Itinerary items ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS itinerary_items (
  id             UUID   PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id        UUID   NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  day            INTEGER NOT NULL,
  time_of_day    TEXT    NOT NULL CHECK (time_of_day IN ('morning', 'afternoon', 'evening')),
  place_name     TEXT    NOT NULL,
  description    TEXT    NOT NULL,
  estimated_time TEXT    NOT NULL,
  latitude       FLOAT,
  longitude      FLOAT
);

CREATE INDEX IF NOT EXISTS idx_itinerary_items_trip_id ON itinerary_items(trip_id);

-- ─── Hotels ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hotels (
  id           UUID   PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id      UUID   NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  name         TEXT   NOT NULL,
  approx_price TEXT   NOT NULL,
  rating       FLOAT  NOT NULL,
  area         TEXT   NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_hotels_trip_id ON hotels(trip_id);

-- ─── Row Level Security ───────────────────────────────────
ALTER TABLE trips           ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels          ENABLE ROW LEVEL SECURITY;

-- trips: owner only
CREATE POLICY "trips_select" ON trips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "trips_insert" ON trips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "trips_delete" ON trips FOR DELETE USING (auth.uid() = user_id);

-- itinerary_items: tied to trip ownership
CREATE POLICY "items_select" ON itinerary_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_id AND trips.user_id = auth.uid()));
CREATE POLICY "items_insert" ON itinerary_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_id AND trips.user_id = auth.uid()));
CREATE POLICY "items_delete" ON itinerary_items FOR DELETE
  USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_id AND trips.user_id = auth.uid()));

-- hotels: tied to trip ownership
CREATE POLICY "hotels_select" ON hotels FOR SELECT
  USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_id AND trips.user_id = auth.uid()));
CREATE POLICY "hotels_insert" ON hotels FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_id AND trips.user_id = auth.uid()));
CREATE POLICY "hotels_delete" ON hotels FOR DELETE
  USING (EXISTS (SELECT 1 FROM trips WHERE trips.id = trip_id AND trips.user_id = auth.uid()));
