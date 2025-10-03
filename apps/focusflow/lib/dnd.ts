// Drag and drop context in apps/focusflow/lib/dnd.ts
import { createContext } from 'react';

// Define the types for our drag and drop operations
export interface DragItem {
  id: string;
  type: string;
  index?: number;
}

export interface DropResult {
  draggableId: string;
  source: {
    index: number;
    droppableId: string;
  };
  destination?: {
    index: number;
    droppableId: string;
  };
}

// Context for drag and drop operations
export const DndContext = createContext<{
  onDragStart?: (item: DragItem) => void;
  onDragEnd?: (result: DropResult) => void;
}>({});