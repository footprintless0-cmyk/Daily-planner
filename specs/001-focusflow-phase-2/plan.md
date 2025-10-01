
# Implementation Plan: FocusFlow - Task Management and Focus Features

**Branch**: `001-focusflow-phase-2` | **Date**: 2025-10-01 | **Spec**: `/workspaces/Daily-planner/specs/001-focusflow-phase-2/spec.md`
**Input**: Feature specification from `/workspaces/Daily-planner/specs/001-focusflow-phase-2/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Implementation of FocusFlow, an opinionated task management and focus application featuring task management (with types like task, exam, meeting), multiple views (Kanban, List, Calendar), focus room with Pomodoro timers, and PWA capabilities. The application will use Next.js 15 with App Router, React 18, Tailwind, shadcn/ui, dnd-kit for drag-and-drop, FullCalendar for calendar views, and Prisma ORM with SQLite/Postgres. The approach follows constitutional principles of friction-free design, user experience priority, full-stack integration, PWA standards, and data privacy.

## Technical Context
**Language/Version**: Node 20, TypeScript (Next.js 15)  
**Primary Dependencies**: Next.js 15, React 18, Tailwind CSS, shadcn/ui, dnd-kit, FullCalendar 6, Prisma 5, next-pwa  
**Storage**: SQLite (development), Postgres (production - Neon or Vercel PG)  
**Testing**: Vitest/Jest, Cypress (e2e)  
**Target Platform**: Web application (Next.js) with PWA capabilities
**Project Type**: web (frontend + backend)  
**Performance Goals**: Lighthouse Performance/PWA scores ≥ 90; TTFB < 500ms avg; TTI < 3s on mid-range Android; smooth DnD at 200+ cards  
**Constraints**: <45 second first-run experience to first task creation; offline quick-add with background sync; web push notifications via VAPID  
**Scale/Scope**: Individual users, single-team focus initially, targeting up to 10,000 tasks per user

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Friction-Free Design First**: All views and workflows must be pre-configured out-of-the-box; focus on opinionated defaults that eliminate decision fatigue for users - implemented via templates and onboarding flow
- **User Experience Priority**: All interactions must feel intuitive and responsive; <45 second first-run experience to first task creation - validated through onboarding design
- **Full-Stack Integration**: Features must work seamlessly across frontend (Next.js/React), backend (Next.js API routes), and database (Prisma/SQLite-Postgres) - implemented through Next.js App Router with server actions
- **Progressive Web App Standards**: Core functionality must work offline or with limited connectivity; installable PWA with service worker caching - implemented via next-pwa
- **Data Privacy and Control**: Users must have full control over their data including export and deletion capabilities - implemented via data export API and user data deletion endpoint

## Project Structure

### Documentation (this feature)
```
specs/001-focusflow-phase-2/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
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
    │   ├── api/              # Next.js API routes serving as backend functionality
    │   ├── components/
    │   │   ├── ui/           # shadcn/ui components
    │   │   ├── tasks/
    │   │   ├── kanban/
    │   │   ├── calendar/
    │   │   └── focus-room/
    │   ├── lib/
    │   │   ├── prisma/       # Prisma database access
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

prisma/
├── schema.prisma
└── seed.ts

tests/
├── contract/
├── integration/
└── unit/
```

**Structure Decision**: Web application with Next.js App Router; frontend and backend are combined in the Next.js application, with database access via Prisma. Next.js API routes serve as backend functionality. The structure separates UI components, business logic, and data access layers according to Next.js conventions.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh qwen`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P] 
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:
- TDD order: Tests before implementation 
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (None at this time) | | |

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---
*Based on Constitution v1.0.0 - See `/workspaces/Daily-planner/.specify/memory/constitution.md`*
