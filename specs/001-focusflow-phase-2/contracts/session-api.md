# Session API Contract

## Overview
API endpoints for managing focus sessions in FocusFlow application.

## Endpoints

### GET /api/sessions
**Description**: Retrieve all focus sessions for the authenticated user

**Authentication**: Required (JWT/Bearer token)

**Query Parameters**:
- `taskId` (optional): Filter by task ID
- `type` (optional): Filter by session type (Pomodoro, Custom)
- `from` (optional): Filter sessions created after this date (ISO 8601 format)
- `to` (optional): Filter sessions created before this date (ISO 8601 format)

**Response (200 OK)**:
```json
{
  "sessions": [
    {
      "id": "session-uuid",
      "taskId": "task-uuid", // Optional, null if not tied to specific task
      "startAt": "2025-01-01T09:00:00.000Z",
      "endAt": "2025-01-01T09:25:00.000Z", // Optional, null if ongoing
      "type": "Pomodoro|Custom",
      "plannedMins": 25,
      "actualMins": 25,
      "notes": "Focused well, completed most of the task",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST /api/sessions
**Description**: Create a new focus session

**Authentication**: Required (JWT/Bearer token)

**Request Body**:
```json
{
  "taskId": "task-uuid", // Optional, null if not tied to specific task
  "startAt": "2025-01-01T09:00:00.000Z",
  "endAt": "2025-01-01T09:25:00.000Z", // Optional for starting, required when ending
  "type": "Pomodoro|Custom",
  "plannedMins": 25,
  "actualMins": 25,
  "notes": "Session notes"
}
```

**Response (201 Created)**:
```json
{
  "id": "session-uuid",
  "taskId": "task-uuid", // Optional, null if not tied to specific task
  "startAt": "2025-01-01T09:00:00.000Z",
  "endAt": "2025-01-01T09:25:00.000Z", // Optional, null if ongoing
  "type": "Pomodoro|Custom",
  "plannedMins": 25,
  "actualMins": 25,
  "notes": "Session notes",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### PUT /api/sessions/{id}
**Description**: Update an existing session (typically to end an ongoing session)

**Authentication**: Required (JWT/Bearer token)

**Path Parameters**:
- `id`: Session ID (string, required)

**Request Body** (all fields optional):
```json
{
  "endAt": "2025-01-01T09:25:00.000Z",
  "actualMins": 27,
  "notes": "Session extended by a few minutes"
}
```

**Response (200 OK)**:
```json
{
  "id": "session-uuid",
  "taskId": "task-uuid", // Optional, null if not tied to specific task
  "startAt": "2025-01-01T09:00:00.000Z",
  "endAt": "2025-01-01T09:25:00.000Z", // Optional, null if ongoing
  "type": "Pomodoro|Custom",
  "plannedMins": 25,
  "actualMins": 27,
  "notes": "Session extended by a few minutes",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### DELETE /api/sessions/{id}
**Description**: Delete a session

**Authentication**: Required (JWT/Bearer token)

**Path Parameters**:
- `id`: Session ID (string, required)

**Response (204 No Content)**: Session successfully deleted

### GET /api/sessions/{id}
**Description**: Get a specific session

**Authentication**: Required (JWT/Bearer token)

**Path Parameters**:
- `id`: Session ID (string, required)

**Response (200 OK)**:
```json
{
  "id": "session-uuid",
  "taskId": "task-uuid", // Optional, null if not tied to specific task
  "startAt": "2025-01-01T09:00:00.000Z",
  "endAt": "2025-01-01T09:25:00.000Z", // Optional, null if ongoing
  "type": "Pomodoro|Custom",
  "plannedMins": 25,
  "actualMins": 25,
  "notes": "Focused well, completed most of the task",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
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