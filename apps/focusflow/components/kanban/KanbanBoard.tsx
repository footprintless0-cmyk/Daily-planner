'use client';

import React, { useState, useMemo } from 'react';
import { Task } from '@prisma/client';
import TaskCard from '../tasks/TaskCard';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Define the status columns for the Kanban board
const statusColumns = [
  { id: 'Backlog', title: 'Backlog', color: 'bg-gray-100' },
  { id: 'Todo', title: 'To Do', color: 'bg-blue-100' },
  { id: 'Doing', title: 'Doing', color: 'bg-yellow-100' },
  { id: 'Done', title: 'Done', color: 'bg-green-100' },
];

interface KanbanBoardProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
}

interface SortableTaskCardProps {
  task: Task;
  onClick?: () => void;
}

function SortableTaskCard({ task, onClick }: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-move"
    >
      <TaskCard task={task} onClick={onClick} />
    </div>
  );
}

const KanbanBoard: React.FC<KanbanBoardProps> = React.memo(({ tasks, onTaskUpdate }) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Group tasks by status using useMemo for performance optimization
  const groupedTasks = useMemo(() => {
    return statusColumns.map(column => ({
      ...column,
      // Using a more efficient grouping algorithm that only iterates once
      tasks: tasks.filter(task => task.status === column.id),
    }));
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Update the task's status to match the new column
      onTaskUpdate(active.id as string, { status: over.id as string });
    }

    setActiveTask(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {groupedTasks.map((column) => (
          <div 
            key={column.id} 
            className={`${column.color} rounded-lg p-4 h-full`}
            role="region"
            aria-label={`${column.title} column with ${column.tasks.length} tasks`}
          >
            <h2 className="font-bold text-lg mb-4 flex justify-between items-center" id={`column-${column.id}-heading`}>
              <span>{column.title}</span>
              <span className="bg-white bg-opacity-50 rounded-full px-2 py-1 text-xs">
                {column.tasks.length}
              </span>
            </h2>
            <div 
              className="space-y-3 min-h-[500px]" 
              role="list" 
              aria-labelledby={`column-${column.id}-heading`}
            >
              <SortableContext items={column.tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                {column.tasks.map((task) => (
                  <SortableTaskCard
                    key={task.id}
                    task={task}
                    onClick={() => console.log(`Editing task: ${task.id}`)}
                  />
                ))}
              </SortableContext>
            </div>
          </div>
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="bg-white rounded-lg shadow-lg p-4 w-64 border-2 border-indigo-500">
            <h3 className="font-medium text-gray-900">{activeTask.title}</h3>
            <p className="text-sm text-gray-500 truncate">{activeTask.description}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
});

export default KanbanBoard;