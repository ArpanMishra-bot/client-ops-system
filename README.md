# ClientOps — Client Operations System

> A full-stack SaaS platform for freelancers and agencies to manage clients, leads, projects, invoices, and reminders — all in one place.

**Live Demo:** [phenomenal-empanada-101cf6.netlify.app](https://phenomenal-empanada-101cf6.netlify.app)

---

## Overview

ClientOps is a production-grade client operations platform built to demonstrate real-world full-stack SaaS architecture. It covers the complete business workflow — from capturing a lead to delivering a project and getting paid.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Auth | Clerk |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Payments | Stripe (ready) |
| Email | Resend (ready) |
| Deployment | Netlify |

---

## Core Modules

### Dashboard
Real-time business overview with live stats pulled from the database — total clients, active leads, revenue, outstanding invoices, pending tasks, and upcoming reminders.

### Client Management
Full client profiles with contact details, company information, status tracking, and activity history. Searchable list with desktop table and mobile card views.

### Leads Pipeline
Kanban-style CRM pipeline with 7 stages: New → Contacted → Qualified → Proposal → Negotiation → Won → Lost. Drag-and-drop on desktop, tap-to-move on mobile. Deal value tracking and priority levels.

### Projects & Tasks
Project management with 4-stage task board (Todo → In Progress → In Review → Done). Progress tracking, budget management, due dates, and client linking.

### Invoicing
Professional invoice creation with line items, auto-numbering, tax/discount support, and status tracking (Draft → Sent → Viewed → Paid → Overdue).

### Reminders
Follow-up reminder system with types (Follow Up, Meeting, Deadline, Payment), overdue detection, and one-click completion.

### Settings
Account management with Clerk-powered profile, database status, and plan information.

---

## Business Workflow
Lead captured → Qualified → Converted to Client
↓
Project created → Tasks assigned → Progress tracked
↓
Invoice generated → Sent to client → Payment received
---

## Architecture Decisions

**Server Actions over API Routes**
Used Next.js Server Actions for all data mutations — eliminates the need for separate API endpoints, reduces boilerplate, and keeps data logic co-located with the UI.

**Prisma Singleton Pattern**
Single Prisma client instance across serverless functions prevents connection pool exhaustion — a common production issue with serverless databases.

**Route Groups for Layout Separation**
Next.js route groups `(auth)` and `(dashboard)` allow completely different layouts for public and protected routes without affecting the URL structure.

**Module-based Architecture**
Business logic separated into `/modules` — each module has its own `actions.ts`, `types.ts`, and `queries.ts`. UI components live in `/components/modules`. This makes the codebase easy to navigate and extend.

**Multi-tenancy via userId**
Every database record includes a `userId` from Clerk. All queries filter by the authenticated user's ID — complete data isolation between users with zero additional infrastructure.

---

## Database Schema

9 models: `Client`, `Lead`, `Project`, `Task`, `Invoice`, `InvoiceItem`, `Payment`, `Reminder`, `Activity`

All models include proper indexes on `userId`, foreign keys with cascade deletes, and timestamps.

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase recommended)
- Clerk account
- Netlify or Vercel account

### Installation

```bash
git clone https://github.com/ArpanMishra-bot/client-ops-system
cd client-ops-system
npm install
Environment Variables
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_APP_URL=
Database Setup
npx prisma db push
Run Development Server
npm run dev
Project Structure
├── app/
│   ├── (auth)/          # Sign in, sign up pages
│   └── (dashboard)/     # Protected app pages
├── components/
│   ├── shared/          # Sidebar, Logo
│   └── modules/         # Feature-specific components
├── modules/             # Business logic layer
│   ├── clients/
│   ├── leads/
│   ├── projects/
│   ├── invoices/
│   ├── reminders/
│   └── dashboard/
├── lib/
│   └── db.ts            # Prisma singleton
└── prisma/
    └── schema.prisma    # Full database schema
Features Roadmap
[ ] Stripe payment integration
[ ] Email notifications via Resend
[ ] PDF invoice export
[ ] Client portal (shareable invoice links)
[ ] Analytics charts
[ ] Team collaboration
Built By
Arpan Mishra — Full-stack developer building production SaaS applications.
Built as a portfolio demonstration of real-world SaaS architecture and development practices.
# test
