# Quickstart Guide: FocusFlow - Task Management and Focus Features

## Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm or yarn package manager
- Git

### Initial Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd focusflow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. Set up the database:
   ```bash
   npx prisma db push
   # or for initial setup
   npx prisma migrate dev --name init
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## First Task Creation

### 1. Create Account or Login
- Navigate to `/auth/signin` if you have an account
- Navigate to `/auth/signup` if you're a new user
- Complete the authentication process

### 2. Access Templates (Optional)
- On first login, you'll see template options
- Select "Student Planner" for academic planning
- Select "Business Sprint" for project management
- Or click "Skip" to start fresh

### 3. Create Your First Task
1. Click the "+ New Task" button in the header
2. Fill in the task details:
   - Title: "My First Task" (required)
   - Description: "This is my first task in FocusFlow" (optional)
   - Type: Select from "task", "exam", or "meeting" (required)
   - Due Date: Select when the task is due (optional)
   - Estimated Hours: How long you think it will take (optional)
3. Click "Create Task"

### 4. View Your Task
- Your new task will appear in the List view
- You'll see the automatically calculated ETA and timeLeft
- Switch to Kanban view to drag-and-drop task status
- Switch to Calendar view to see when the task is due

## Using Focus Room

### 1. Access Focus Room
- Click "Focus Room" in the main navigation
- Select background: choose from scenic images or videos

### 2. Start a Timer
- Click "Pomodoro" for a 25/5 minute timer
- Or set custom minutes and break time
- Click "Start" to begin focusing

### 3. Track Your Session
- When timer completes, a session record is automatically created
- View your session history in the "Sessions" tab

## Testing the Core Features

### Test Task Creation with ETA/TimeLeft Calculation
**Given**: I am a logged-in user
**When**: I create a "Math Revision" task with due date and time estimate
**Then**: I immediately see the calculated ETA and timeLeft displayed on the task

1. Create a task with title "Math Revision"
2. Set due date to tomorrow
3. Set estimated hours to 3
4. Observe the calculated ETA and timeLeft values

### Test Kanban Drag-and-Drop
**Given**: I am viewing the Kanban board
**When**: I drag and drop a task card to change its status
**Then**: The UI updates immediately (optimistic update) and the change persists after page refresh

1. Navigate to Kanban view
2. Drag a task from "To Do" to "Doing"
3. Verify the UI updates immediately
4. Refresh the page and verify the change persisted

### Test Calendar View
**Given**: I am on the calendar view
**When**: I click on a task/event
**Then**: An editor opens allowing me to modify the task details

1. Navigate to Calendar view
2. Click on a task with a due date
3. Verify the task editor modal opens
4. Make changes and save to confirm functionality

### Test Offline Quick-Add
**Given**: I am in offline mode on a PWA-enabled device
**When**: I use the quick-add feature to create a task
**Then**: The task is saved locally and automatically syncs when connectivity is restored

1. Enable offline mode in browser dev tools
2. Use the quick-add feature to create a task
3. Re-enable connectivity
4. Verify the task syncs to the server

## API Endpoints for Testing

### Task Management
- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Session Management
- `GET /api/sessions` - Get all user sessions
- `POST /api/sessions` - Create a new session
- `PUT /api/sessions/:id` - Update a session

### User Data Export/Deletion
- `GET /api/user/export` - Export all user data as JSON
- `DELETE /api/user` - Delete user account and all data

## Troubleshooting

### Issues with Authentication
- Ensure you have a valid session
- Check that your email is verified if required
- Clear browser cache if experiencing auth issues

### Database Connection Issues
- Verify your database connection string in .env.local
- Confirm that your database server is running
- Run `npx prisma db pull` if schema has changed

### PWA Features Not Working
- Ensure you're using HTTPS (required for service workers)
- Check that your browser supports service workers
- Verify that next.config.js has PWA settings enabled