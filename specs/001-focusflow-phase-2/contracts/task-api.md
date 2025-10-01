# Task API Contract

## Overview
API endpoints for managing tasks in FocusFlow application.

## Endpoints

### GET /api/tasks
**Description**: Retrieve all tasks for the authenticated user

**Authentication**: Required (JWT/Bearer token)

**Query Parameters**:
- `status` (optional): Filter by status (Backlog, Todo, Doing, Done)
- `type` (optional): Filter by type (task, exam, meeting)
- `priority` (optional): Filter by priority (Low, Medium, High, Urgent)
- `dueAfter` (optional): Filter tasks due after this date (ISO 8601 format)
- `dueBefore` (optional): Filter tasks due before this date (ISO 8601 format)
- `tag` (optional): Filter by tag name

**Response (200 OK)**:
```json
{
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
      "updatedAt": "2025-01-01T00:00:00.000Z",
      "eta": "2025-01-01T00:00:00.000Z",
      "timeLeft": 86400000
    }
  ]
}
```

### POST /api/tasks
**Description**: Create a new task

**Authentication**: Required (JWT/Bearer token)

**Request Body**:
```json
{
  "title": "Task title",
  "description": "Task description",
  "type": "task|exam|meeting",
  "status": "Todo",
  "priority": "Medium",
  "tags": ["tag1", "tag2"],
  "dueAt": "2025-12-31T23:59:59.000Z",
  "estimateHrs": 2.5,
  "spentHrs": 0,
  "attachments": [
    {
      "name": "attachment name",
      "url": "https://example.com/file.pdf"
    }
  ],
  "reminders": ["2025-12-30T09:00:00.000Z"]
}
```

**Response (201 Created)**:
```json
{
  "id": "task-uuid",
  "title": "Task title",
  "description": "Task description",
  "type": "task|exam|meeting",
  "status": "Todo",
  "priority": "Medium",
  "tags": ["tag1", "tag2"],
  "dueAt": "2025-12-31T23:59:59.000Z",
  "estimateHrs": 2.5,
  "spentHrs": 0,
  "attachments": [
    {
      "name": "attachment name",
      "url": "https://example.com/file.pdf"
    }
  ],
  "reminders": ["2025-12-30T09:00:00.000Z"],
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "eta": "2025-01-01T00:00:00.000Z",
  "timeLeft": 86400000
}
```

### PUT /api/tasks/{id}
**Description**: Update an existing task

**Authentication**: Required (JWT/Bearer token)

**Path Parameters**:
- `id`: Task ID (string, required)

**Request Body** (all fields optional):
```json
{
  "title": "Updated task title",
  "description": "Updated task description",
  "type": "task|exam|meeting",
  "status": "Doing",
  "priority": "High",
  "tags": ["updated-tag1", "updated-tag2"],
  "dueAt": "2025-12-31T23:59:59.000Z",
  "estimateHrs": 3.0,
  "spentHrs": 1.0,
  "attachments": [
    {
      "name": "updated attachment name",
      "url": "https://example.com/updated-file.pdf"
    }
  ],
  "reminders": ["2025-12-30T09:00:00.000Z"]
}
```

**Response (200 OK)**:
```json
{
  "id": "task-uuid",
  "title": "Updated task title",
  "description": "Updated task description",
  "type": "task|exam|meeting",
  "status": "Doing",
  "priority": "High",
  "tags": ["updated-tag1", "updated-tag2"],
  "dueAt": "2025-12-31T23:59:59.000Z",
  "estimateHrs": 3.0,
  "spentHrs": 1.0,
  "attachments": [
    {
      "name": "updated attachment name",
      "url": "https://example.com/updated-file.pdf"
    }
  ],
  "reminders": ["2025-12-30T09:00:00.000Z"],
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "eta": "2025-01-01T00:00:00.000Z",
  "timeLeft": 86400000
}
```

### DELETE /api/tasks/{id}
**Description**: Delete a task

**Authentication**: Required (JWT/Bearer token)

**Path Parameters**:
- `id`: Task ID (string, required)

**Response (204 No Content)**: Task successfully deleted

### GET /api/tasks/{id}
**Description**: Get a specific task

**Authentication**: Required (JWT/Bearer token)

**Path Parameters**:
- `id`: Task ID (string, required)

**Response (200 OK)**:
```json
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
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "eta": "2025-01-01T00:00:00.000Z",
  "timeLeft": 86400000
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