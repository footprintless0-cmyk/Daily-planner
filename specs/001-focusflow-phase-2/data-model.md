# Data Model: FocusFlow - Task Management and Focus Features

## Core Entities

### User
- **id**: string (Primary Key, UUID)
- **email**: string (Required, Unique, Email format validation)
- **name**: string (Required, Max 100 characters)
- **timezone**: string (Required, e.g., "America/New_York", from IANA timezone database)
- **settings**: JSON (Optional, key-value pairs for user preferences)
- **createdAt**: DateTime (Required, Auto-generated)
- **updatedAt**: DateTime (Required, Auto-generated)

### Task
- **id**: string (Primary Key, UUID)
- **userId**: string (Foreign Key to User.id, Required)
- **title**: string (Required, Max 200 characters)
- **description**: string (Optional, Max 5000 characters)
- **type**: string (Required, Enum: 'task' | 'exam' | 'meeting')
- **status**: string (Required, Enum: 'Backlog' | 'Todo' | 'Doing' | 'Done')
- **priority**: string (Required, Enum: 'Low' | 'Medium' | 'High' | 'Urgent')
- **tags**: string[] (Optional, Array of tag names)
- **dueAt**: DateTime (Optional, When task is due)
- **estimateHrs**: float (Optional, Estimated hours to complete)
- **spentHrs**: float (Optional, Hours already spent on task, default: 0)
- **attachments**: JSON[] (Optional, Array of attachment objects with URL and name)
- **reminders**: DateTime[] (Optional, Array of reminder timestamps)
- **createdAt**: DateTime (Required, Auto-generated)
- **updatedAt**: DateTime (Required, Auto-generated)
- **derived.eta**: DateTime (Computed: now + (estimateHrs - spentHrs))
- **derived.timeLeft**: Duration (Computed: dueAt - now)

### Session
- **id**: string (Primary Key, UUID)
- **userId**: string (Foreign Key to User.id, Required)
- **taskId**: string (Foreign Key to Task.id, Optional, null if not tied to specific task)
- **startAt**: DateTime (Required, When session started)
- **endAt**: DateTime (Optional, When session ended, null if ongoing)
- **type**: string (Required, Enum: 'Pomodoro' | 'Custom')
- **plannedMins**: int (Required, Planned minutes for session)
- **actualMins**: int (Optional, Actual minutes spent, null if ongoing)
- **notes**: string (Optional, Max 1000 characters)
- **createdAt**: DateTime (Required, Auto-generated)
- **updatedAt**: DateTime (Required, Auto-generated)

### Reminder
- **id**: string (Primary Key, UUID)
- **userId**: string (Foreign Key to User.id, Required)
- **taskId**: string (Foreign Key to Task.id, Required)
- **channel**: string (Required, Enum: 'push' | 'email')
- **whenAt**: DateTime (Required, When reminder should be sent)
- **sentAt**: DateTime (Optional, When reminder was actually sent, null if not sent yet)
- **createdAt**: DateTime (Required, Auto-generated)
- **updatedAt**: DateTime (Required, Auto-generated)

## Relationships
- User (1) → Task (Many): User can have many tasks
- User (1) → Session (Many): User can have many sessions
- User (1) → Reminder (Many): User can have many reminders
- Task (1) → Reminder (Many): Task can have many reminders
- Task (1) → Session (Many): Task can have many sessions (optional)

## Validation Rules
- Task.title: Required, max 200 characters
- Task.type: Must be one of 'task', 'exam', 'meeting'
- Task.status: Must be one of 'Backlog', 'Todo', 'Doing', 'Done'
- Task.priority: Must be one of 'Low', 'Medium', 'High', 'Urgent'
- Task.estimateHrs: If provided, must be a positive number
- Task.spentHrs: If provided, must be a positive number, cannot exceed estimateHrs
- User.email: Must be a valid email format and unique
- Session.type: Must be one of 'Pomodoro', 'Custom'
- Reminder.channel: Must be one of 'push', 'email'
- dueAt must be in the future when creating/updating tasks

## Indexes
- User.email: Unique index for authentication
- Task.userId: Index for user-specific task queries
- Task.dueAt: Index for date-based sorting and filtering
- Task.status: Index for status-based filtering
- Reminder.userId + Reminder.whenAt: Composite index for scheduling queries
- Session.userId + Session.startAt: Composite index for session history queries