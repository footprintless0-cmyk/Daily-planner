'use client';

import { useState, useEffect } from 'react';
import { Task } from '@prisma/client';
import TaskCard from '@/components/tasks/TaskCard';
import TaskForm from '@/components/tasks/TaskForm';
import { getTasksByUserId } from '@/lib/tasks';

const TaskListView = () => {
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

  if (loading) {
    return <div className="p-6">Loading tasks...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Task List</h1>
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

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
          <div className="mt-6">
            <button
              onClick={handleCreateTask}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Task
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => handleEditTask(task)}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskListView;