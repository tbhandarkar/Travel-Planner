# AI Travel Planner — Setup Guide

## Prerequisites
- Node.js 18+
- A Supabase account (free tier is fine)
- An OpenAI API key (GPT-4o access)
- A Google Cloud project with billing enabled

---

## 1. Install dependencies

```bash
npm install
```

---

## 2. Configure environment variables

Copy the example file and fill in your keys:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

---

## 3. Set up Supabase

### a) Create a project
Go to https://app.supabase.com → New project

### b) Run the schema
1. In your project dashboard, click **SQL Editor**
2. Paste the contents of `supabase/schema.sql`
3. Click **Run**

### c) Enable Email Auth
1. Go to **Authentication → Providers**
2. Ensure **Email** is enabled (it is by default)

### d) Get your credentials
- **URL**: Settings → API → Project URL
- **Anon key**: Settings → API → `anon public`

---

## 4. Set up Google Cloud APIs

1. Go to https://console.cloud.google.com
2. Create or select a project
3. Enable these APIs:
   - **Maps JavaScript API** (map rendering)
   - **Geocoding API** (place name → coordinates)
4. Create an API key: Credentials → Create Credentials → API Key
5. (Optional but recommended) Restrict the key to your domain

---

## 5. Run locally

```bash
npm run dev
```

Open http://localhost:3000

---

## Folder structure

```
/app
  /page.tsx                  # Main planner page
  /auth/page.tsx             # Sign in / Sign up
  /trips/page.tsx            # Saved trips list
  /trips/[id]/page.tsx       # Trip detail view
  /api/generate-itinerary/   # POST — calls OpenAI + Geocoding
  /api/save-trip/            # POST — saves to Supabase
  /api/trips/                # GET  — list user's trips
  /api/trips/[id]/           # GET / DELETE — single trip

/components
  AuthForm.tsx
  DestinationForm.tsx
  Header.tsx
  HotelCard.tsx
  ItineraryCard.tsx
  LoadingState.tsx
  MapView.tsx
  TripList.tsx

/lib
  types.ts          # All TypeScript interfaces
  openai.ts         # OpenAI itinerary generation
  supabase.ts       # Browser Supabase client
  supabase-server.ts# Server Supabase client
  geocoding.ts      # Google Geocoding API helper

/supabase
  schema.sql        # DB schema + RLS policies
```

---

## Notes

- Hotel prices are AI-generated estimates — always verify on booking sites
- The Geocoding API is called server-side (key not exposed to browser)
- Row Level Security ensures users only see their own trips
- The app works without signing in (generate itineraries) but requires auth to save trips
