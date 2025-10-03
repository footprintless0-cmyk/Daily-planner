# Tasks: FocusFlow - Task Management and Focus Features

**Input**: Design documents from `/workspaces/Daily-planner/specs/001-focusflow-phase-2/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/
**Feature**: FocusFlow - Task Management and Focus Features

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: tech stack, libraries, structure
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks
   → contracts/: Each file → contract test task
   → research.md: Extract decisions → setup tasks
   → quickstart.md: Extract scenarios → integration tests
3. Generate tasks by category:
   → Setup: project init, dependencies, linting
   → Tests: contract tests, integration tests
   → Core: models, services, CLI commands
   → Integration: DB, middleware, logging
   → Polish: unit tests, performance, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests?
   → All entities have models?
   → All endpoints implemented?
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume web application structure based on plan.md

## Phase 3.1: Setup
- [X] [T001] Create project structure with Next.js 15, TypeScript, Tailwind CSS, shadcn/ui setup in apps/focusflow/
- [X] [T002] Initialize package.json with dependencies: next@15, react@18, react-dom, typescript, tailwindcss, @types/react, @types/node, prisma, @prisma/client, next-auth, dnd-kit, @fullcalendar/react, next-pwa
- [X] [T003] [P] Configure ESLint, Prettier, and TypeScript settings in apps/focusflow/

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [X] [T004] [P] Contract test for task endpoints in tests/contract/task-api.test.ts
- [X] [T005] [P] Contract test for session endpoints in tests/contract/session-api.test.ts
- [X] [T006] [P] Contract test for user endpoints in tests/contract/user-api.test.ts
- [X] [T007] [P] Integration test for task creation workflow in tests/integration/task-creation.test.ts
- [X] [T008] [P] Integration test for Kanban drag-and-drop workflow in tests/integration/kanban-dnd.test.ts
- [X] [T009] [P] Integration test for focus timer workflow in tests/integration/focus-timer.test.ts
- [X] [T010] [P] Integration test for user data export workflow in tests/integration/user-export.test.ts
- [X] [T011] [P] Cross-layer integration test for drag-and-drop real-time sync in tests/integration/kanban-sync.test.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [X] [T011] [P] User model in prisma/schema.prisma and generated client
- [X] [T012] [P] Task model in prisma/schema.prisma and generated client
- [X] [T013] [P] Session model in prisma/schema.prisma and generated client
- [X] [T014] [P] Reminder model in prisma/schema.prisma and generated client
- [X] [T015] Create Prisma client service in apps/focusflow/lib/prisma.ts
- [X] [T016] Create authentication service with NextAuth in apps/focusflow/lib/auth.ts
- [X] [T017] Create task service with CRUD operations in apps/focusflow/lib/tasks.ts
- [X] [T018] Create time calculation utilities for ETA and timeLeft in apps/focusflow/lib/time.ts
- [X] [T019] Create session service with CRUD operations in apps/focusflow/lib/sessions.ts
- [X] [T020] Create user service with CRUD operations in apps/focusflow/lib/users.ts
- [X] [T021] POST /api/tasks endpoint implementation in apps/focusflow/app/api/tasks/route.ts
- [X] [T022] GET /api/tasks endpoint implementation in apps/focusflow/app/api/tasks/route.ts
- [X] [T023] PUT /api/tasks/[id] endpoint implementation in apps/focusflow/app/api/tasks/[id]/route.ts
- [X] [T024] DELETE /api/tasks/[id] endpoint implementation in apps/focusflow/app/api/tasks/[id]/route.ts
- [X] [T025] GET /api/tasks/[id] endpoint implementation in apps/focusflow/app/api/tasks/[id]/route.ts
- [X] [T026] POST /api/sessions endpoint implementation in apps/focusflow/app/api/sessions/route.ts
- [X] [T027] GET /api/sessions endpoint implementation in apps/focusflow/app/api/sessions/route.ts
- [X] [T028] PUT /api/sessions/[id] endpoint implementation in apps/focusflow/app/api/sessions/[id]/route.ts
- [X] [T029] DELETE /api/sessions/[id] endpoint implementation in apps/focusflow/app/api/sessions/[id]/route.ts
- [X] [T030] GET /api/sessions/[id] endpoint implementation in apps/focusflow/app/api/sessions/[id]/route.ts
- [X] [T031] GET /api/user/profile endpoint implementation in apps/focusflow/app/api/user/profile/route.ts
- [X] [T032] PUT /api/user/profile endpoint implementation in apps/focusflow/app/api/user/profile/route.ts
- [X] [T033] GET /api/user/export endpoint implementation in apps/focusflow/app/api/user/route.ts
- [X] [T034] DELETE /api/user endpoint implementation in apps/focusflow/app/api/user/route.ts
- [X] [T035] POST /api/user/templates endpoint implementation in apps/focusflow/app/api/user/templates/route.ts
- [X] [T036] Configure NextAuth sessions with secure settings in apps/focusflow/lib/auth.ts
- [X] [T037] Implement security headers (CSP, HSTS, XFO) in apps/focusflow/next.config.js
- [X] [T038] Add CSRF protection for mutating actions in apps/focusflow/middleware.ts

## Phase 3.4: UI Implementation
- [X] [T039] [P] Create base layout and navigation components in apps/focusflow/components/layout/
- [X] [T040] [P] Create task form component in apps/focusflow/components/tasks/
- [X] [T041] [P] Create task card component in apps/focusflow/components/tasks/
- [X] [T042] Create task list view in apps/focusflow/app/list/page.tsx
- [X] [T043] Create kanban board component with dnd-kit in apps/focusflow/components/kanban/
- [X] [T044] Create drag and drop context in apps/focusflow/lib/dnd.ts
- [X] [T045] Create kanban view page in apps/focusflow/app/kanban/page.tsx
- [X] [T046] Create calendar component with FullCalendar in apps/focusflow/components/calendar/
- [X] [T047] Create calendar view page in apps/focusflow/app/calendar/page.tsx
- [X] [T048] Create focus room timer component in apps/focusflow/components/focus/
- [X] [T049] Create focus room page with session tracking in apps/focusflow/app/focus/page.tsx
- [X] [T050] Create reminder configuration UI in apps/focusflow/components/notifications/
- [X] [T051] Create user profile settings page in apps/focusflow/app/settings/page.tsx
- [X] [T052] Create user data export/delete UI in apps/focusflow/components/settings/ExportDeleteUI.tsx
- [X] [T053] Create template selection UI for onboarding in apps/focusflow/app/onboarding/
- [X] [T054] Implement accessibility features for WCAG AA compliance in components
- [X] [T055] Add keyboard navigation support for all interactive elements
- [X] [T056] Add screen reader support with proper ARIA attributes

## Phase 3.5: PWA & Offline Functionality
- [X] [T054] Configure next-pwa for offline capabilities in apps/focusflow/next.config.js
- [X] [T055] Implement service worker for offline task read operations
- [X] [T056] Implement background sync for offline task creation in apps/focusflow/lib/offline-sync.ts
- [X] [T057] Create PWA manifest in apps/focusflow/public/manifest.json

## Phase 3.6: Performance & Optimization
- [X] [T058] Implement performance optimizations for drag-and-drop with 200+ cards <100ms response time
- [T059] Implement Lighthouse performance optimization to achieve ≥90 scores
- [T060] Add performance monitoring and measurement tools
- [X] [T061] Optimize calendar timezone synchronization

## Phase 3.7: Polish & Testing
- [T062] [P] Unit tests for time calculation utilities in apps/focusflow/__tests__/time.test.ts
- [T063] [P] Unit tests for task service in apps/focusflow/__tests__/tasks.test.ts
- [T064] [P] Unit tests for session service in apps/focusflow/__tests__/sessions.test.ts
- [T065] [P] Unit tests for user service in apps/focusflow/__tests__/users.test.ts
- [T066] Update docs/api.md with API documentation
- [T067] Add handling for edge cases: timezone differences, push notification blocks, large background images
- [T068] Run end-to-end tests with Cypress in cypress/e2e/

## Dependencies
- Tests (T004-T011) before implementation (T012-T057)
- T012, T013, T014, T015 (models) before T018, T020, T021 (services)
- T018 (task service) before T022-T026 (task endpoints)
- T020 (session service) before T027-T031 (session endpoints)
- T021 (user service) before T032-T036 (user endpoints)
- T016 (auth service) before security tasks T037-T038
- T039-T053 (UI components) before accessibility tasks T054-T056
- Implementation before performance (T058-T061)
- Performance before polish (T062-T068)

## Parallel Example
```
# Launch T004-T006 together:
Task: "Contract test for task endpoints in tests/contract/task-api.test.ts"
Task: "Contract test for session endpoints in tests/contract/session-api.test.ts"
Task: "Contract test for user endpoints in tests/contract/user-api.test.ts"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task
- Avoid: vague tasks, same file conflicts

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - Each contract file → contract test task [P]
   - Each endpoint → implementation task
   
2. **From Data Model**:
   - Each entity → model creation task [P]
   - Relationships → service layer tasks
   
3. **From User Stories**:
   - Each story → integration test [P]
   - Quickstart scenarios → validation tasks

4. **From Constitution**:
   - Security requirements → security implementation tasks
   - Performance standards → performance optimization tasks
   - Accessibility standards → accessibility implementation tasks
   - Cross-layer integration → integration test tasks
   
5. **Ordering**:
   - Setup → Tests → Models → Services → Security → Endpoints → UI → PWA → Performance → Polish
   - Dependencies block parallel execution

## Validation Checklist
*GATE: Checked by main() before returning*

- [ ] All contracts have corresponding tests
- [ ] All entities have model tasks
- [ ] All constitutional requirements have tasks (security, accessibility, performance)
- [ ] All tests come before implementation
- [ ] Parallel tasks truly independent
- [ ] Each task specifies exact file path
- [ ] No task modifies same file as another [P] task