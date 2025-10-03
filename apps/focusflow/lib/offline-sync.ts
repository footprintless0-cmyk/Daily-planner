// Service for offline task synchronization in apps/focusflow/lib/offline-sync.ts

// Interface for offline tasks
interface OfflineTask {
  id: string;
  action: 'create' | 'update' | 'delete';
  data?: any;
  timestamp: number;
  synced: boolean;
}

// Function to save offline tasks to local storage
export function saveOfflineTask(task: OfflineTask): Promise<void> {
  return new Promise((resolve) => {
    try {
      // Get existing offline tasks from localStorage
      const existingTasks = JSON.parse(localStorage.getItem('offlineTasks') || '[]');
      // Add the new task
      existingTasks.push(task);
      // Save back to localStorage
      localStorage.setItem('offlineTasks', JSON.stringify(existingTasks));
      resolve();
    } catch (error) {
      console.error('Error saving offline task:', error);
      resolve(); // Still resolve to avoid blocking the UI
    }
  });
}

// Function to get all pending offline tasks
export function getPendingOfflineTasks(): Promise<OfflineTask[]> {
  return new Promise((resolve) => {
    try {
      const tasks = JSON.parse(localStorage.getItem('offlineTasks') || '[]');
      resolve(tasks.filter((task: OfflineTask) => !task.synced));
    } catch (error) {
      console.error('Error getting offline tasks:', error);
      resolve([]);
    }
  });
}

// Function to mark a task as synced
export function markTaskAsSynced(taskId: string): Promise<void> {
  return new Promise((resolve) => {
    try {
      const tasks = JSON.parse(localStorage.getItem('offlineTasks') || '[]');
      const updatedTasks = tasks.map((task: OfflineTask) => 
        task.id === taskId ? { ...task, synced: true } : task
      );
      localStorage.setItem('offlineTasks', JSON.stringify(updatedTasks));
      resolve();
    } catch (error) {
      console.error('Error marking task as synced:', error);
      resolve();
    }
  });
}

// Function to sync offline tasks with the server
export async function syncOfflineTasks(): Promise<void> {
  try {
    const pendingTasks = await getPendingOfflineTasks();
    
    // Process each pending task
    for (const task of pendingTasks) {
      try {
        // In a real implementation, we would make API calls based on the task action
        // For example:
        // if (task.action === 'create') {
        //   await api.createTask(task.data);
        // } else if (task.action === 'update') {
        //   await api.updateTask(task.data.id, task.data);
        // } else if (task.action === 'delete') {
        //   await api.deleteTask(task.data.id);
        // }
        
        // For now, we'll just mark the task as synced
        await markTaskAsSynced(task.id);
      } catch (error) {
        console.error(`Error syncing task ${task.id}:`, error);
        // In a real implementation, you might want to handle sync errors differently
        // e.g., implement retry logic, error reporting, etc.
      }
    }
  } catch (error) {
    console.error('Error during sync:', error);
  }
}

// Function to check if the application is online
export function isOnline(): boolean {
  return navigator.onLine;
}

// Function to initialize offline sync
export function initOfflineSync(): void {
  // Listen for online/offline events
  window.addEventListener('online', () => {
    console.log('Back online, syncing...');
    syncOfflineTasks();
  });

  // Periodically check for tasks to sync when online
  setInterval(() => {
    if (isOnline()) {
      syncOfflineTasks();
    }
  }, 30000); // Check every 30 seconds
}