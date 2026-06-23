# KARUSDA — Church Web App

A multi-page React site for Karatina University Seventh-day Adventist Church
(KARUSDA): Home, Events, Ministries, Missions, and a login-gated Admin area.
No login is needed to browse the public site — only `/admin` requires sign-in.

## Run it

```bash
npm install
npm run dev
```

Then open the URL it prints (usually http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

## Add your own hero video

Drop two files into `public/videos/`:
- `hero-worship.mp4` — a short (10–20s), looped clip of a service in session
- `hero-poster.jpg` — a still frame shown while the video loads

The video autoplays muted on the homepage, per the brief.

## Admin access

Go to **Admin** in the navbar and sign in with:

- Username: `admin`
- Password: `karusda2026`

⚠️ These are demo credentials stored in `src/data/initialData.js`. Replace
them with real authentication (e.g. a backend with hashed passwords, or a
service like Firebase Auth/Supabase) before putting this online for real.

From the Admin dashboard you can add/delete announcements, add/delete events
across all three categories, add/delete gallery photos, edit each ministry's
description and meeting time, edit choir details, and add/delete leadership
entries.

## How content persists

There's no backend yet — all content (announcements, events, gallery,
ministries, choir, leadership, mission totals) lives in React context and is
mirrored to the browser's `localStorage`, so admin edits survive a page
refresh on the same device/browser. To make edits visible to *all* visitors
across devices, you'll want to connect this to a real database (e.g.
Supabase, Firebase, or your own API) — the `AppContext.jsx` file is the one
place you'd swap localStorage calls for real network requests.

## Project structure

```
src/
  main.jsx              entry point
  App.jsx                routes
  context/AppContext.jsx  global data store + admin auth + CRUD actions
  data/initialData.js     seed content (edit directly, or via Admin)
  components/             Navbar, Footer, HorizonArc divider, SabbathHorizon
                          widget, AnnouncementCard, Layout
  pages/                  Home, Events, Ministries, Missions, Admin
```

## Design notes

- Palette: cream `#F6F1E4`, paper `#FFFCF4`, ink `#1C1810`, gold `#C9962E`,
  clay `#A14A2E`, highland green `#3F5D3A`.
- Type: Fraunces (display), Inter (body), Space Mono (schedule/time data).
- Signature element: **Sabbath Horizon** — the homepage's interactive weekly
  schedule, drawn as a literal horizon arc with the Sabbath (Friday vespers
  through Saturday evening) traced in gold. The same arc shape recurs as the
  `HorizonArc` section divider throughout the site.
