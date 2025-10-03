'use client';

import { useState, useEffect } from 'react';
import { Task } from '@prisma/client';
import Calendar from '@/components/calendar/Calendar';
import TaskForm from '@/components/tasks/TaskForm';
import { getTasksByUserId } from '@/lib/tasks';

const CalendarPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
  };

  const handleDateClick = (date: Date) => {
    // Pre-populate form with the selected date
    setEditingTask({
      id: '',
      userId: userId,
      title: '',
      description: '',
      type: 'task',
      status: 'Todo',
      priority: 'Medium',
      tags: [],
      dueAt: date,
      estimateHrs: 0,
      spentHrs: 0,
      attachments: null,
      reminders: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Task);
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
    if (editingTask && editingTask.id) {
      // Update existing task
      try {
        // In a real implementation, we would call the API to update the task
        setTasks(tasks.map(task => task.id === editingTask.id ? { ...task, ...taskData } : task));
        setShowForm(false);
        setEditingTask(null);
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
        setEditingTask(null);
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
        <h1 className="text-2xl font-bold text-gray-900">Calendar View</h1>
        <button
          onClick={handleCreateTask}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          + New Task
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {showForm ? (
            <div className="mb-8">
              <TaskForm 
                task={editingTask || undefined} 
                onSubmit={handleSubmitTask} 
                onCancel={() => setShowForm(false)} 
              />
            </div>
          ) : null}

          <Calendar 
            tasks={tasks} 
            timezone="UTC" // This would come from user settings in a real app
            onTaskSelect={handleSelectTask}
            onDateClick={handleDateClick}
          />
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Task Details</h2>
            {selectedTask ? (
              <div>
                <h3 className="font-medium text-gray-900">{selectedTask.title}</h3>
                {selectedTask.description && (
                  <p className="mt-1 text-sm text-gray-500">{selectedTask.description}</p>
                )}
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Type:</span>
                    <span className="text-sm text-gray-900">{selectedTask.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <span className="text-sm text-gray-900">{selectedTask.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Priority:</span>
                    <span className="text-sm text-gray-900">{selectedTask.priority}</span>
                  </div>
                  {selectedTask.dueAt && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Due:</span>
                      <span className="text-sm text-gray-900">
                        {new Date(selectedTask.dueAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {selectedTask.estimateHrs !== null && selectedTask.estimateHrs !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Est. Hours:</span>
                      <span className="text-sm text-gray-900">{selectedTask.estimateHrs}h</span>
                    </div>
                  )}
                </div>
                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => handleEditTask(selectedTask)}
                    className="flex-1 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(selectedTask.id)}
                    className="flex-1 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Select a task to view details</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;