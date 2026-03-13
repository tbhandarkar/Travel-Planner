# ✈️ AI Travel Planner

## About

AI Travel Planner is a full-stack web application that takes the hard work out of trip planning. A user simply enters a destination city, the number of days they want to travel, their daily budget, and their personal interests — and the app instantly generates a complete, personalised day-by-day travel itinerary using artificial intelligence. Each day is broken into morning, afternoon, and evening activities, all tailored to the traveller's preferences. The app also suggests hotels, plots every attraction on an interactive map, and lets users save and revisit their trips at any time. Built as an educational project to demonstrate how modern AI and cloud services can be combined into a production-quality web application.

---

## Features

- **AI Itinerary Generation** — Enter a destination and receive a fully structured day-wise travel plan in seconds, including place names, descriptions, and estimated visit times for each activity
- **Budget & Interest Personalisation** — Filter recommendations by daily budget and interests such as Food & Dining, Culture & History, Nature, Shopping, Nightlife, Art, Adventure, and Wellness
- **Hotel Suggestions** — Get 4 AI-curated hotel recommendations with approximate prices, ratings, and area information for each trip
- **Interactive Google Map** — All attractions are geocoded and displayed as colour-coded markers (morning / afternoon / evening) on a live Google Map, with clickable info windows and direct links to Google Maps directions
- **User Authentication** — Secure email and password sign-up / sign-in powered by Supabase Auth
- **Save & Manage Trips** — Authenticated users can save any generated itinerary to their account and access it later from the My Trips dashboard
- **Trip Detail View** — View any saved trip in full, including the complete itinerary, hotel suggestions, and interactive map
- **Delete Trips** — Remove saved trips with a single click directly from the dashboard
- **Loading Skeletons** — Animated placeholder UI shown while the AI generates results (generation can take up to 30 seconds)
- **Responsive Design** — Clean, mobile-friendly layout built with TailwindCSS

---

## AI Tools Used

| Tool | Purpose |
|------|---------|
| **OpenAI GPT-4o** | Generates the complete day-wise itinerary and hotel suggestions based on destination, duration, budget, and interests. Uses structured JSON output mode to ensure consistent, parseable responses |

---

## External Services Used

| Service | Purpose |
|---------|---------|
| **Supabase** | PostgreSQL database (stores trips, itinerary items, and hotels), user authentication (email/password), and Row Level Security to ensure users only access their own data |
| **Google Maps JavaScript API** | Renders the interactive map with custom colour-coded markers for each activity time slot |
| **Google Geocoding API** | Converts AI-generated place names (e.g. "Senso-ji Temple") into latitude/longitude coordinates for map display — called server-side so the API key is never exposed to the browser |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS |
| AI | OpenAI API (GPT-4o) |
| Database & Auth | Supabase |
| Maps | @react-google-maps/api |
| Auth Middleware | @supabase/ssr |

---

## Project Structure

```
/app
  page.tsx                   # Main planner page
  /auth/page.tsx             # Sign in / Sign up
  /trips/page.tsx            # Saved trips list
  /trips/[id]/page.tsx       # Trip detail view
  /api/generate-itinerary/   # Calls OpenAI + Geocoding API
  /api/save-trip/            # Saves trip to Supabase
  /api/trips/                # Lists user's saved trips
  /api/trips/[id]/           # Fetch or delete a single trip

/components
  AuthForm.tsx               # Sign in / Sign up form
  DestinationForm.tsx        # Trip planning input form
  Header.tsx                 # Navigation bar
  HotelCard.tsx              # Hotel suggestion card
  ItineraryCard.tsx          # Day plan card (morning/afternoon/evening)
  LoadingState.tsx           # Skeleton loader
  MapView.tsx                # Google Maps with markers
  TripList.tsx               # Saved trips grid

/lib
  types.ts                   # TypeScript interfaces
  openai.ts                  # OpenAI prompt + response parsing
  supabase.ts                # Browser Supabase client
  supabase-server.ts         # Server Supabase client
  geocoding.ts               # Google Geocoding helper

/supabase
  schema.sql                 # Database schema + RLS policies
```

---

## Educational Purpose

This project was built purely for **learning and educational purposes**. It demonstrates:

- How to integrate a **Large Language Model (GPT-4o)** into a real web application using structured JSON outputs
- How to build a **full-stack Next.js application** using the App Router with both Server and Client Components
- How to implement **user authentication and a database** using Supabase with Row Level Security
- How to work with **third-party mapping APIs** (Google Maps + Geocoding)
- How to handle **real-world concerns** such as loading states, error handling, environment variable security, and TypeScript typing

> **Note:** Hotel prices and place suggestions are AI-generated estimates for educational demonstration only. Always verify information on official booking and travel sites before making real travel plans.

---

## Deployment

### Hosting Platform — Vercel (recommended)

This app is deployed using **[Vercel](https://vercel.com)** — the hosting platform built by the Next.js team. Vercel is free for personal projects and provides a live public URL with zero server configuration.

**Live URL format:**
```
https://travel-planner-tbhandarkar.vercel.app
```

### How Deployment Works

Every time code is pushed to the `main` branch on GitHub, Vercel **automatically detects the change and redeploys** the app. No manual steps needed after the initial setup.

```
Local code change
      ↓
git push to GitHub (main branch)
      ↓
Vercel detects the push automatically
      ↓
Runs: npm run build
      ↓
Deploys updated app live
```

### Deploying to Vercel (first time)

1. Go to **https://vercel.com** and sign up with your GitHub account
2. Click **"Add New Project"** → select this repository
3. Add the following **Environment Variables** in the Vercel dashboard before deploying:

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Your OpenAI secret key |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Your Google Maps API key |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon public key |

4. Click **"Deploy"** — the app goes live in ~2 minutes

### Cost Breakdown

| Service | Free Tier | Paid When |
|---------|-----------|-----------|
| Vercel (hosting) | ✅ Free for personal use | Commercial scale |
| Supabase (DB + Auth) | ✅ 500MB DB, 50K users | Large scale |
| Google Maps | ✅ $200/month free credit | High traffic |
| OpenAI GPT-4o | ❌ Pay per use | Every itinerary generated (~$0.01–$0.05 each) |
| Custom domain | ✅ Not required | Optional (~$12/year) |

> You can run this app in production at **$0/month** for small personal use. The only cost is OpenAI usage.

### Alternative Hosting — Netlify

This app can also be deployed on **[Netlify](https://netlify.com)** using the included `netlify.toml` config file. The setup process is identical — connect GitHub, add environment variables, and deploy.

---

## Local Setup

See [SETUP.md](./SETUP.md) for full local installation and configuration instructions.
