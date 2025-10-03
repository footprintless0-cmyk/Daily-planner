'use client';

import React from 'react';
import { Task } from '@prisma/client';
import { formatTimeLeft, calculateTimeLeft } from '@/lib/time';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = React.memo(({ task, onClick, onEdit, onDelete }) => {
  const timeLeft = calculateTimeLeft(task.dueAt || undefined);
  const formattedTimeLeft = formatTimeLeft(timeLeft);

  // Determine the color based on priority
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'Urgent':
        return 'border-l-red-500';
      case 'High':
        return 'border-l-orange-500';
      case 'Medium':
        return 'border-l-yellow-500';
      case 'Low':
      default:
        return 'border-l-green-500';
    }
  };

  // Format the due date
  const formattedDueDate = task.dueAt ? new Date(task.dueAt).toLocaleDateString() : 'No due date';

  // Accessibility: Generate an ARIA label for the card
  const cardAriaLabel = `${task.title}, Status: ${task.status}, Priority: ${task.priority}, Due: ${formattedDueDate}`;

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${getPriorityColor()} cursor-pointer hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-500`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={cardAriaLabel}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 truncate">{task.title}</h3>
          {task.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2" aria-label={`Description: ${task.description}`}>{task.description}</p>
          )}
        </div>
        
        {onEdit && onDelete && (
          <div className="flex space-x-2 ml-2" aria-label="Task actions">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="text-gray-400 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
              aria-label={`Edit task: ${task.title}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
              aria-label={`Delete task: ${task.title}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-3 flex flex-wrap gap-2">
        {task.type && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800" aria-label={`Type: ${task.type}`}>
            {task.type}
          </span>
        )}
        
        {task.status && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800" aria-label={`Status: ${task.status}`}>
            {task.status}
          </span>
        )}
        
        {task.priority && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800" aria-label={`Priority: ${task.priority}`}>
            {task.priority}
          </span>
        )}
        
        {task.tags && task.tags.length > 0 && task.tags.map((tag, index) => (
          <span 
            key={index} 
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
            aria-label={`Tag: ${tag}`}
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        {formattedDueDate}
        {formattedTimeLeft && (
          <span className="ml-2" aria-label={`Time left: ${formattedTimeLeft}`}>
            ({formattedTimeLeft})
          </span>
        )}
      </div>
      
      {task.estimateHrs !== null && task.estimateHrs !== undefined && (
        <div className="mt-2 text-xs text-gray-500">
          Estimated: {task.estimateHrs}h
          {task.spentHrs !== null && task.spentHrs !== undefined && (
            <span>, Spent: {task.spentHrs}h</span>
          )}
        </div>
      )}
    </div>
  );
});

export default TaskCard;