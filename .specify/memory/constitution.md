<!-- 
SYNC IMPACT REPORT
Version change: N/A (initial version) → 1.0.0
Modified principles: N/A
Added sections: FocusFlow Core Principles, Constraints, Success Metrics, Risks & Mitigations
Removed sections: N/A
Templates requiring updates: 
  - .specify/templates/plan-template.md ⚠ pending
  - .specify/templates/spec-template.md ⚠ pending  
  - .specify/templates/tasks-template.md ⚠ pending
  - .qwen/commands/*.toml ⚠ pending
  - README.md ⚠ pending
Follow-up TODOs: 
  - RATIFICATION_DATE: needs to be set to actual adoption date
-->
# FocusFlow Constitution

## Core Principles

### Friction-Free Design First
Every feature must be immediately usable without configuration or setup; All views and workflows must be pre-configured out-of-the-box; Focus on opinionated defaults that eliminate decision fatigue for users

### User Experience Priority
Every interaction must feel intuitive and responsive; All user actions should provide immediate feedback; Aim for <45 second first-run experience to first task creation

### Full-Stack Integration (NON-NEGOTIABLE)
All features must work seamlessly across frontend (Next.js/React), backend (Next.js API routes), and database (Prisma/SQLite-Postgres) layers; Frontend drag-and-drop must sync with backend in real-time; Cross-layer integration tests are required for all user-facing workflows

### Progressive Web App Standards
All core functionality must work offline or with limited connectivity; Implement installable PWA with service worker caching; Support offline quick-add with sync-on-connect capability

### Data Privacy and Control
Users must have full control over their data including export and deletion capabilities; No data hoarding - implement data minimization practices; Clear privacy policy and transparent data handling practices

## Technical Constraints

FocusFlow development must adhere to the specified technology stack: Next.js 15 (App Router, TS), React 18, Tailwind, shadcn/ui, dnd-kit, FullCalendar, Prisma, with SQLite for development and Postgres for production. Authentication must use NextAuth with email/password and optional Google OAuth. All code must follow TypeScript best practices and shadcn/ui component patterns.

## Performance and Quality Standards

All features must achieve Lighthouse Performance/PWA scores ≥ 90. Focus session times must maintain accuracy and reliability. Calendar synchronization must handle timezone changes correctly. Drag-and-drop interactions must feel smooth with <100ms response time. All user-facing changes must pass accessibility standards (WCAG AA minimum).

## Governance

All PRs and development activities must verify compliance with these principles; Any changes to user experience must maintain the friction-free design philosophy; Use project documentation for runtime development guidance and decision-making process

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): Set to actual adoption date | **Last Amended**: 2025-10-01