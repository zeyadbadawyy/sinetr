# Sinetr

**A fitness platform built to help people train consistently, track their progress, and understand their fitness journey.**

Sinetr is a long-term fitness platform focused on bringing workout planning, performance tracking, and training history together in one place.

The goal is to build more than a workout tracker: a platform where people can organize their training, record their performance, monitor progress, and eventually connect with a wider fitness ecosystem.

> **Status:** Active development — Training Foundation

## Overview

Sinetr is being developed with a focus on reliable training workflows, structured data, and a clean user experience.

The current foundation allows users to create training programs, organize workout days, manage exercises, record workout performance, and review completed sessions.

The project is being developed incrementally, with an emphasis on building a dependable foundation before expanding into more advanced features.

## Features

### Authentication
- User registration and login
- Protected application routes
- User-specific data and workout records

### Exercise Library
- Browse available exercises
- Exercise categories and equipment information
- Individual exercise pages

### Training Programs
- Create and manage training programs
- Organize programs into workout days
- Add, edit, remove, and reorder exercises
- Configure target sets, repetitions, and rest periods

### Workout Tracking
- Start and resume unfinished workouts
- Record sets, weights, and repetitions
- Save workout performance
- Complete workout sessions
- View previous performance while training

### Workout History
- Browse completed workout sessions
- Review individual workout records
- Inspect recorded sets and performance

## Tech Stack

| Area | Technology |
|---|---|
| Framework | Next.js |
| Language | TypeScript |
| UI | React, Tailwind CSS |
| Database | PostgreSQL |
| Backend services | Supabase |
| ORM | Drizzle ORM |
| Authentication | Supabase Auth |
| Deployment | Planned |

## Architecture

Sinetr uses a structured application architecture that separates its main responsibilities:

- **App Router:** Application routes and server-rendered pages.
- **Components:** Reusable interface components and feature-specific UI.
- **Database schema:** Relational data models managed through Drizzle ORM.
- **Database queries:** Dedicated data-access functions.
- **Server actions:** Server-side operations for application workflows.
- **Authentication:** Supabase-based user authentication and protected access.

The application is built around distinct training concepts:

- **Program:** A reusable training plan.
- **Workout day:** A collection of exercises within a program.
- **Workout session:** An actual training session performed by a user.
- **Sets:** Individual performance records associated with a workout session.
- **History:** A record of completed training sessions.

## Getting Started

### Prerequisites

- Node.js
- npm
- A Supabase project with PostgreSQL access

### 1. Clone the repository

```bash
git clone https://github.com/zeyadbadawyy/sinetr.git
cd sinetr
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
DATABASE_URL=your_supabase_postgres_connection_string
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Use your own Supabase project credentials. Never commit real credentials or secret keys to GitHub.

### 4. Apply database migrations

```bash
npx drizzle-kit migrate
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Create production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

## Roadmap

Sinetr is a long-term project. Development is planned across several areas:

- [x] Authentication foundation
- [x] Exercise library foundation
- [x] Training program management
- [x] Workout session creation and tracking
- [x] Set recording and performance persistence
- [x] Workout history foundation
- [ ] Active workout timer and pause/resume tracking
- [ ] Advanced exercise and muscle-group analytics
- [ ] Personal progress dashboards
- [ ] Expanded exercise library
- [ ] Training insights and intelligent tools
- [ ] Community and social features
- [ ] Further UI and experience improvements

The roadmap will evolve as the platform develops.

## Project Philosophy

Sinetr is being built around a simple idea:

**Fitness progress should be recorded, understood, and built upon over time.**

The focus is not simply on adding features. It is on creating a dependable platform that can support a person's training journey over the long term.

## Author

**Zeyad Badawy**

GitHub: [@zeyadbadawyy](https://github.com/zeyadbadawyy)

---

*Sinetr is an actively developed personal project.*