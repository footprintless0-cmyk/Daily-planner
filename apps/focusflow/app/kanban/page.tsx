'use client';

import { useState, useEffect } from 'react';
import { Task } from '@prisma/client';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import TaskForm from '@/components/tasks/TaskForm';
import { getTasksByUserId } from '@/lib/tasks';

const KanbanPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // In a real app, we would get the user ID from the session
  const userId = '1'; // Placeholder user ID

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // @ts-ignore - Will implement the actual function in the tasks service
      const tasksData = await getTasksByUserId(userId);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        // In a real implementation, we would call the API to delete the task
        setTasks(tasks.filter(task => task.id !== taskId));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleSubmitTask = async (taskData: any) => {
    if (editingTask) {
      // Update existing task
      try {
        // In a real implementation, we would call the API to update the task
        setTasks(tasks.map(task => task.id === editingTask.id ? { ...task, ...taskData } : task));
        setShowForm(false);
      } catch (error) {
        console.error('Error updating task:', error);
      }
    } else {
      // Create new task
      try {
        const newTask = {
          id: `task-${Date.now()}`, // Placeholder ID
          userId,
          ...taskData,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Task;
        
        // In a real implementation, we would call the API to create the task
        setTasks([newTask, ...tasks]);
        setShowForm(false);
      } catch (error) {
        console.error('Error creating task:', error);
      }
    }
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updates, updatedAt: new Date() } : task
    ));
  };

  if (loading) {
    return <div className="p-6">Loading tasks...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
        <button
          onClick={handleCreateTask}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          + New Task
        </button>
      </div>

      {showForm ? (
        <div className="mb-8">
          <TaskForm 
            task={editingTask || undefined} 
            onSubmit={handleSubmitTask} 
            onCancel={() => setShowForm(false)} 
          />
        </div>
      ) : null}

      <KanbanBoard 
        tasks={tasks} 
        onTaskUpdate={handleTaskUpdate} 
      />
    </div>
  );
};

export default KanbanPage;