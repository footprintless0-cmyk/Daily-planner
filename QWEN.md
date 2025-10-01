# FocusFlow Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-10-01

## Active Technologies
- Runtime: Node 20, TypeScript
- Frameworks: Next.js 15 (App Router), React 18, Tailwind CSS, shadcn/ui, dnd-kit, FullCalendar 6, Prisma 5, next-pwa
- Authentication: NextAuth v5
- Database: SQLite (development), Postgres (production - Neon or Vercel PG)
- Testing: Vitest/Jest, Cypress (e2e)
- Security: Syft/Grype for SBOM/SCA, ZAP baseline (pre-GA)
- Hosting: Vercel

## Project Structure
```
apps/
└── focusflow/
    ├── app/
    │   ├── (auth)/
    │   ├── (dashboard)/
    │   │   ├── kanban/
    │   │   ├── list/
    │   │   ├── calendar/
    │   │   ├── focus/
    │   │   └── settings/
    │   ├── api/
    │   ├── components/
    │   │   ├── ui/           # shadcn/ui components
    │   │   ├── tasks/
    │   │   ├── kanban/
    │   │   ├── calendar/
    │   │   └── focus-room/
    │   ├── lib/
    │   │   ├── prisma/
    │   │   ├── utils/
    │   │   └── hooks/
    │   ├── styles/
    │   └── types/
    ├── public/
    │   ├── backgrounds/
    │   └── icons/
    ├── package.json
    ├── tsconfig.json
    └── next.config.js

backend/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── lib/
│   ├── middleware/
│   └── services/
└── tests/
    ├── contract/
    ├── integration/
    └── unit/

shared/
├── constants/
├── utils/
└── types/

tests/
├── contract/
├── integration/
└── e2e/
```

## Commands
npm run dev          # Start development server
npm run build        # Build the application
npm run start        # Start production server
npm test             # Run unit tests
npm run test:e2e     # Run end-to-end tests
npx prisma db push   # Push schema changes to database
npx prisma studio    # Open Prisma Studio to view database

## Code Style
- Use TypeScript for type safety throughout the application
- Follow Next.js conventions for file-based routing with App Router
- Use shadcn/ui components for consistent UI elements
- Follow accessibility best practices (WCAG AA minimum)
- Use Tailwind CSS utility classes with consistent naming conventions
- Implement error boundaries for graceful error handling
- Follow constitutional principles: friction-free design, user experience priority, full-stack integration, PWA standards, data privacy

## Recent Changes
- 001-focusflow-phase-2: Added Next.js 15 with App Router, React 18, Tailwind CSS, shadcn/ui, dnd-kit, FullCalendar 6, Prisma 5, next-pwa stack for building the FocusFlow task management application

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->