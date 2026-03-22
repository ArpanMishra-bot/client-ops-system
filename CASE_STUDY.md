# Case Study: ClientOps — Full-Stack SaaS Platform

## Project Overview

ClientOps is a production-grade client operations platform built to solve a real problem: freelancers and agencies manage their entire business across 5-6 different tools — a spreadsheet for clients, Trello for projects, Wave for invoices, Google Calendar for reminders. ClientOps replaces all of them with one unified system.

Live: [phenomenal-empanada-101cf6.netlify.app](https://phenomenal-empanada-101cf6.netlify.app)  
Repository: [github.com/ArpanMishra-bot/client-ops-system](https://github.com/ArpanMishra-bot/client-ops-system)

---

## The Problem

Freelancers and small agencies waste hours every week switching between tools, losing context, and manually syncing information. A lead tracked in one place has no connection to the project it becomes, or the invoice that follows.

The core pain: No single tool connects the entire workflow — lead → client → project → invoice → payment.

---

## The Solution

A single platform that mirrors how a real service business operates:

1. Capture leads in a visual pipeline
2. Convert them to clients with one action
3. Create a project linked to that client
4. Manage tasks within the project
5. Generate an invoice when the work is done
6. Track payment status in real time

Every piece of data connects. Nothing gets lost.

---

## Technical Challenges & Solutions

### Challenge 1: Multi-tenancy at Scale
Problem: Every user must only see their own data — clients, leads, projects, invoices.

Solution: Instead of building a complex row-level security system, every database query filters by userId from Clerk's authentication. This is simple, fast, and scales to millions of records.

`typescript
// Every query is scoped to the authenticated user
const clients = await db.client.findMany({
  where: { userId }, // guaranteed isolation
  orderBy: { createdAt: "desc" },
})
Challenge 2: Real-time UI Without Complexity
Problem: When a user moves a lead to a new stage, the UI needs to update immediately without a full page reload.
Solution: Optimistic updates — the UI updates instantly on the client, then syncs with the server in the background. If the server call fails, the UI reverts.
Challenge 3: Mobile-first Kanban
Problem: Drag-and-drop doesn't work on mobile browsers.
Solution: Built two views — a kanban board for desktop and a filtered list with "Move to" buttons for mobile. Both share the same underlying data and server actions.
Challenge 4: Serverless Database Connections
Problem: Next.js on serverless platforms creates a new database connection on every request, quickly exhausting PostgreSQL's connection limit.
Solution: Prisma singleton pattern — one shared client instance across all serverless function invocations.
Architecture Highlights
Separation of Concerns
UI Layer          → /components/modules
Business Logic    → /modules (server actions)
Data Layer        → Prisma + PostgreSQL
Auth Layer        → Clerk middleware
Server Actions Pattern
All data mutations use Next.js Server Actions — no separate API layer needed. This reduces code by ~40% compared to a traditional REST API approach while maintaining full type safety end-to-end.
Route Protection
A single middleware file protects all dashboard routes. Public routes are explicitly allowlisted. Everything else requires authentication.
Key Metrics
Metric
Value
Total modules
7
Database models
9
API endpoints (Server Actions)
25+
TypeScript coverage
100%
Mobile responsive
Yes
Build time
~12 seconds
What This Demonstrates
For a $10,000+ client, this project proves:
System Design Thinking — The data model was designed upfront to support the full workflow, not retrofitted as features were added.

Production Patterns — Singleton DB connections, optimistic updates, proper error handling, TypeScript throughout — no shortcuts.
UX Thinking — Every module has empty states, loading states, error states, and mobile fallbacks. The kind of detail that separates junior from senior work.
Scalability — The architecture supports adding new modules, team collaboration, or white-labeling without structural changes.
Delivery Speed — A fully functional multi-module SaaS built and deployed to production.
Tech Stack
Next.js · TypeScript · PostgreSQL · Prisma · Clerk · Tailwind CSS · shadcn/ui · Netlify
Available for freelance projects. Contact: rheaarpan@gmail.com
