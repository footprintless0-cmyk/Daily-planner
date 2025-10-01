# User Management and Data Export API Contract

## Overview
API endpoints for user management, data export, and account deletion in FocusFlow application.

## Endpoints

### GET /api/user/profile
**Description**: Retrieve the authenticated user's profile information

**Authentication**: Required (JWT/Bearer token)

**Response (200 OK)**:
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "name": "User Name",
  "timezone": "America/New_York",
  "settings": {
    "theme": "dark",
    "notifications": {
      "email": true,
      "push": true
    }
  },
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### PUT /api/user/profile
**Description**: Update the authenticated user's profile information

**Authentication**: Required (JWT/Bearer token)

**Request Body** (all fields optional):
```json
{
  "name": "Updated User Name",
  "timezone": "Europe/London",
  "settings": {
    "theme": "light",
    "notifications": {
      "email": false,
      "push": true
    }
  }
}
```

**Response (200 OK)**:
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "name": "Updated User Name",
  "timezone": "Europe/London",
  "settings": {
    "theme": "light",
    "notifications": {
      "email": false,
      "push": true
    }
  },
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### GET /api/user/export
**Description**: Export all user data as JSON

**Authentication**: Required (JWT/Bearer token)

**Response (200 OK)**:
```json
{
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "User Name",
    "timezone": "America/New_York",
    "settings": {
      "theme": "dark"
    },
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  },
  "tasks": [
    {
      "id": "task-uuid",
      "title": "Task title",
      "description": "Task description",
      "type": "task|exam|meeting",
      "status": "Backlog|Todo|Doing|Done",
      "priority": "Low|Medium|High|Urgent",
      "tags": ["tag1", "tag2"],
      "dueAt": "2025-12-31T23:59:59.000Z",
      "estimateHrs": 2.5,
      "spentHrs": 1.0,
      "attachments": [
        {
          "name": "attachment name",
          "url": "https://example.com/file.pdf"
        }
      ],
      "reminders": ["2025-12-30T09:00:00.000Z"],
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "sessions": [
    {
      "id": "session-uuid",
      "taskId": "task-uuid",
      "startAt": "2025-01-01T09:00:00.000Z",
      "endAt": "2025-01-01T09:25:00.000Z",
      "type": "Pomodoro|Custom",
      "plannedMins": 25,
      "actualMins": 25,
      "notes": "Focused well, completed most of the task",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "reminders": [
    {
      "id": "reminder-uuid",
      "taskId": "task-uuid",
      "channel": "push|email",
      "whenAt": "2025-12-30T09:00:00.000Z",
      "sentAt": "2025-12-30T09:00:00.000Z",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### DELETE /api/user
**Description**: Delete the authenticated user account and all related data

**Authentication**: Required (JWT/Bearer token)

**Response (204 No Content)**: User account and all related data successfully deleted

**Note**: This operation cascades deletion of all related tasks, sessions, reminders, and any other user data.

### POST /api/user/templates
**Description**: Apply a template to initialize user data

**Authentication**: Required (JWT/Bearer token)

**Request Body**:
```json
{
  "templateName": "Student Planner|Business Sprint"
}
```

**Response (200 OK)**:
```json
{
  "message": "Template applied successfully",
  "createdTasksCount": 5,
  "createdTags": ["homework", "meeting", "project"]
}
```

## Error Responses
All endpoints may return the following error responses:

**400 Bad Request**: Invalid request body or parameters
```json
{
  "error": "Invalid request",
  "details": "Description of validation errors"
}
```

**401 Unauthorized**: Invalid or missing authentication
```json
{
  "error": "Unauthorized",
  "details": "Authentication required"
}
```

**403 Forbidden**: User does not have permission to access resource
```json
{
  "error": "Forbidden",
  "details": "User does not have permission to access this resource"
}
```

**404 Not Found**: Resource does not exist
```json
{
  "error": "Not found",
  "details": "The requested resource could not be found"
}
```

**500 Internal Server Error**: Unexpected server error
```json
{
  "error": "Internal server error",
  "details": "An unexpected error occurred"
}
```