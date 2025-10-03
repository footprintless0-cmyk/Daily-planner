'use client';

import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { Task } from '@prisma/client';

interface CalendarProps {
  tasks: Task[];
  timezone?: string; // User's timezone
  onTaskSelect: (task: Task) => void;
  onDateClick?: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ tasks, timezone, onTaskSelect, onDateClick }) => {
  const [currentView, setCurrentView] = useState('dayGridMonth'); // Default view

  // Convert tasks to calendar events with proper timezone handling
  const calendarEvents = tasks.map(task => ({
    id: task.id,
    title: task.title,
    // Use the user's timezone to properly display task due dates
    start: task.dueAt ? new Date(task.dueAt).toISOString() : undefined,
    allDay: true, // For tasks, we'll make them all-day events
    extendedProps: {
      task: task
    }
  })).filter(event => event.start); // Only include tasks with due dates

  // Handle date clicking
  const handleDateClick = (arg: any) => {
    if (onDateClick) {
      onDateClick(arg.date);
    }
  };

  // Handle event clicking (task selection)
  const handleEventClick = (arg: any) => {
    if (arg.event.extendedProps.task) {
      onTaskSelect(arg.event.extendedProps.task);
    }
  };

  // Handle view changes
  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-end mb-4">
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              currentView === 'dayGridMonth' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => handleViewChange('dayGridMonth')}
          >
            Month
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              currentView === 'timeGridWeek' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => handleViewChange('timeGridWeek')}
          >
            Week
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              currentView === 'timeGridDay' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => handleViewChange('timeGridDay')}
          >
            Day
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              currentView === 'listWeek' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => handleViewChange('listWeek')}
          >
            List
          </button>
        </div>
      </div>
      
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView={currentView}
        events={calendarEvents as any}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        headerToolbar={false} // We're providing our own custom header
        height="auto"
        editable={false}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        // Timezone handling - use the user's timezone or default to local
        timeZone={props.timezone || 'local'}
        // Accessibility attributes
        ariaTitle="Task Calendar - View and manage your scheduled tasks"
      />
    </div>
  );
};

export default Calendar;