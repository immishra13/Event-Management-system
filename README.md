# Event Management System

Cloud Event Hub — a web app to discover, host and register for events, in one place.

## What it does

- **Publish an event** — title, description, date and time, location, plus a banner image uploaded to Firebase Storage. The event is saved to Firestore with who created it and when.
- **Explore events** — upcoming events listed newest first, each card showing its banner, date, location and host, with a link to the details page.
- **Register in one click** — the details page has a Register Now button. Registration is checked before it is saved, so the same person cannot register for the same event twice.
- **Dashboard** — two tabs: events you registered for, and events you host.

## Tech stack

- React 19 + Vite
- Firebase Auth, Firestore and Storage
- React Router v7
- Framer Motion
- Lucide icons
- Glassmorphism design

## Routes

| Route | What it shows |
| --- | --- |
| `/` | Landing page |
| `/auth` | Login / sign up |
| `/explore` | Upcoming events |
| `/event/:id` | Event details + registration |
| `/dashboard` | Registered events and events you host (login required) |
| `/create` | Publish a new event (login required) |

## Data

- `events` collection in Firestore: title, description, date, location, bannerURL, createdBy, createdAt.
- `registrations` collection in Firestore: eventId, userId, registeredAt.

## Run it locally

```bash
npm install
npm run dev
```

Add your own Firebase project config in `src/firebase/config.js` first.

## Project structure

```
src/
  App.jsx            # routes + auth state
  main.jsx           # entry point
  firebase/config.js # Firebase Auth, Firestore, Storage
  pages/
    LandingPage.jsx  # "Discover & Host Extraordinary Events"
    AuthPage.jsx     # login / sign up
    ExplorerPage.jsx # upcoming events, newest first
    DetailsPage.jsx  # event details + Register Now
    Dashboard.jsx    # registered events / events you host
    CreateEvent.jsx  # publish an event with banner upload
  components/
    Navbar.jsx       # Explore, Dashboard, Create Event, Logout
```
