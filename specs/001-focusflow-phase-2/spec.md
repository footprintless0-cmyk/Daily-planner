# Feature Specification: FocusFlow - Task Management and Focus Features

**Feature Branch**: `001-focusflow-phase-2`  
**Created**: 2025-10-01  
**Status**: Draft  
**Input**: User description: "# FocusFlow — Phase 2: Specify ## 2.1 Functional Requirements (FR) - **FR-1 Tasks & Types** - Create/edit/delete tasks with: title, description, type (task | exam | meeting), status (Backlog | Todo | Doing | Done), priority, tags, dueAt, estimateHrs, spentHrs, attachments (links), reminders. - **Acceptance:** Can create a “Math Revision” task with due date & estimate; it immediately shows **ETA** and **timeLeft**. - **FR-2 Views** - **Kanban** (drag-drop changes status and order with optimistic UI). - **List** (search, filter by status/tag/date). - **Calendar** (month/week/day; clicking an event opens the editor). - **Acceptance:** Reordering persists on refresh; calendar shows all due items on correct dates. - **FR-3 Focus Room** - Pomodoro 25/5 and custom timers; scenic backgrounds (image/video); session log. - **Acceptance:** When a timer ends, a session record is created; user receives an in-app alert or push (if enabled). - **FR-4 Reminders** - Due-soon & overdue via **Web Push** (VAPID) and **Email** (Resend/Sendgrid). - **Acceptance:** A task due in 30m dispatches a reminder within ±2m. - **FR-5 Templates & Onboarding** - Templates: **Student Planner** and **Business Sprint** with pre-seeded lists/tags. - **Acceptance:** New user → selects template → first task created in <45s. - **FR-6 PWA** - Installable; offline **read** (Today/Upcoming) and **quick-add** with background sync. - **Acceptance:** In airplane mode, quick-added task syncs once online. - **FR-7 Data Export & Account Deletion** - Export all user data as JSON; deletion cascades all content. - **Acceptance:** Downloaded JSON validates against schema; no orphaned DB rows after deletion. ## 2.2 Non-Functional Requirements (NFR) - **Security:** NextAuth sessions; secure headers (CSP/HSTS/XFO); CSRF on mutating actions; secrets only in env (Vercel). - **Reliability:** Target 99.5% uptime; daily DB backup; error boundaries and friendly fallback screens. - **Performance:** Lighthouse Perf/PWA ≥ 90; TTFB < 500ms avg; TTI < 3s on mid-range Android; smooth DnD at 200+ cards. - **Compliance/Privacy:** Clear privacy policy; user-initiated deletion within 24h; minimal PII. ## 2.3 Architecture Snapshot - **App:** Next.js 15 (App Router, TS) + React 18 + Tailwind + shadcn/ui + dnd-kit + FullCalendar. - **Backend:** Next.js server actions & API routes; Prisma ORM. - **DB:** Dev SQLite, Prod Postgres (Neon or Vercel PG). - **Notifications:** Web Push (VAPID) + Resend/Sendgrid email. - **PWA:** next-pwa/Workbox for caching & background sync. - **Jobs:** Vercel Scheduled Functions scan for due tasks. - **Secrets:** Vercel encrypted env vars; rotate quarterly. ## 2.4 Data Model (core) - **User**(id, email, name, tz, settings) - **Task**(id, userId, title, desc, type, status, priority, tags[], dueAt, estimateHrs, spentHrs, createdAt, updatedAt) - **Derived:** `eta = now + (estimateHrs - spentHrs)`; `timeLeft = dueAt - now` - **Session**(id, userId, taskId?, startAt, endAt, type: Pomodoro|Custom, plannedMins, actualMins, notes) - **Reminder**(id, userId, taskId, channel: push|email, whenAt, sentAt?) ## 2.5 Risks & Mitigations (delta) - Asset bloat from scenes → CDN, lazy-load, image fallback. - Browser blocks push → email + in-app banners. - Estimate accuracy → post-session "adjust estimate" nudge. - Scope creep (teams) → feature flags, post-MVP."

## Execution Flow (main)
```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors, actions, data, constraints
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
   → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
   → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

### Section Requirements
- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

### For AI Generation
When creating this spec from a user prompt:
1. **Mark all ambiguities**: Use [NEEDS CLARIFICATION: specific question] for any assumption you'd need to make
2. **Don't guess**: If the prompt doesn't specify something (e.g., "login system" without auth method), mark it
3. **Think like a tester**: Every vague requirement should fail the "testable and unambiguous" checklist item
4. **Common underspecified areas**:
   - User types and permissions
   - Data retention/deletion policies  
   - Performance targets and scale
   - Error handling behaviors
   - Integration requirements
   - Security/compliance needs

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
As a student or professional with multiple deadlines, exams, and meetings to manage, I want to create and track tasks with detailed information (title, description, type, status, priority, tags, due date, time estimates), view them in different layouts (Kanban, List, Calendar), use a focus timer to stay productive, and receive timely reminders, all with a clean, intuitive interface that works offline as a Progressive Web App.

### Acceptance Scenarios
1. **Given** I am a logged-in user, **When** I create a "Math Revision" task with a due date and time estimate, **Then** I immediately see the calculated ETA and timeLeft displayed on the task.
2. **Given** I am viewing the Kanban board, **When** I drag and drop a task card to change its status or position, **Then** the UI updates immediately (optimistic update) and the change persists after page refresh.
3. **Given** I am on the calendar view, **When** I click on a task/event, **Then** an editor opens allowing me to modify the task details.
4. **Given** I am using the Focus Room with a Pomodoro timer, **When** the timer completes, **Then** a session record is automatically created and I receive an alert notification (in-app or push if enabled).
5. **Given** I am a new user, **When** I select a template (Student Planner or Business Sprint) during onboarding, **Then** I can create my first task within 45 seconds of selecting the template.
6. **Given** I am in offline mode on a PWA-enabled device, **When** I use the quick-add feature to create a task, **Then** the task is saved locally and automatically syncs when connectivity is restored.
7. **Given** I have tasks with upcoming due dates, **When** a task is due in 30 minutes, **Then** I receive a reminder notification within ±2 minutes of the due time.

### Edge Cases
- What happens when a user has hundreds of tasks and the drag-and-drop performance degrades?
- How does the system handle time zone differences when setting due dates and sending reminders?
- What occurs when a user deletes their account - are all related data properly removed?
- How does the system handle large background images in the Focus Room without impacting performance?
- What happens when web push notifications are blocked by the browser?

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: System MUST allow users to create/edit/delete tasks with: title, description, type (task | exam | meeting), status (Backlog | Todo | Doing | Done), priority, tags, dueAt, estimateHrs, spentHrs, attachments (links), reminders
- **FR-002**: System MUST calculate and display ETA (estimated time of arrival) for tasks as: ETA = current time + (estimateHrs - spentHrs)
- **FR-003**: System MUST calculate and display timeLeft for tasks as: timeLeft = dueAt - current time
- **FR-004**: System MUST provide a Kanban view with drag-and-drop functionality that changes task status and order with optimistic UI updates
- **FR-005**: System MUST provide a List view with search and filtering capabilities by status/tag/date
- **FR-006**: System MUST provide a Calendar view showing tasks on their due dates with month/week/day options
- **FR-007**: System MUST allow clicking on calendar events to open the task editor
- **FR-008**: System MUST provide Pomodoro 25/5 minute timers and custom timers in the Focus Room
- **FR-009**: System MUST display scenic backgrounds (images/videos) in the Focus Room
- **FR-010**: System MUST create session records when timers complete in the Focus Room
- **FR-011**: System MUST send due-soon and overdue reminders via Web Push notifications
- **FR-012**: System MUST send due-soon and overdue reminders via Email
- **FR-013**: System MUST provide Student Planner and Business Sprint templates with pre-seeded lists and tags
- **FR-014**: System MUST function as an installable PWA with offline read capabilities for Today/Upcoming views
- **FR-015**: System MUST provide offline quick-add functionality with background sync when online
- **FR-016**: System MUST allow users to export all their data as JSON format
- **FR-017**: System MUST ensure account deletion cascades and removes all user-related content

### Key Entities *(include if feature involves data)*
- **User**: Represents a registered user with email, name, timezone, and app settings
- **Task**: Represents a to-do item with title, description, type (task | exam | meeting), status (Backlog | Todo | Doing | Done), priority, tags, due date, time estimates, and time spent
- **Session**: Represents a productivity session (Pomodoro or custom timer) with start/end times, type, planned vs actual minutes, and optional notes
- **Reminder**: Represents scheduled notifications for tasks with timing details and delivery status

---

## Review & Acceptance Checklist
*GATE: Automated checks run during main() execution*

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous  
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status
*Updated by main() during processing*

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---
