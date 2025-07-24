import { useDraggable } from '@dnd-kit/core';
import { Task } from './types';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AlertMessage from '../AlerMessage';

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => {}
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  const statusColors: Record<string, string> = {
    TODO: 'bg-yellow-500',
    IN_PROGRESS: 'bg-blue-500',
    DONE: 'bg-green-500',
  };

  return (
    <>
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="cursor-grab rounded-xl bg-white/10 border border-white/10 p-5 backdrop-blur-md shadow-lg hover:shadow-xl transition-transform duration-150 relative"
      >
      {/* Status + ID */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-300">ID: {task.id}</span>
        <span
          className={`text-xs text-white px-2 py-1 rounded-full ${
            statusColors[task.status] || 'bg-gray-500'
          }`}
          >
          {task.status.replace('_', ' ')}
        </span>
      </div>

      {/* Title + Description */}
      <h3 className="text-lg font-bold text-white mb-2">{task.title}</h3>
      <p className="text-sm text-gray-300">{task.description}</p>

      {/* Buttons */}
      <div className="mt-4 flex gap-4">
        <button
          onClick={() => onEdit(task)}
          className="p-2 rounded-4xl border text-blue-400 hover:text-blue-200 transition"
          title="Edit Task"
          >
          <Pencil size={20} />
        </button>
        <button
          onClick={() => {
          }}
          className="p-2 rounded-4xl border cursor-pointer text-red-400 hover:text-red-200 transition"
          title="Delete Task"
          >
          <Trash2 size={20} />
        </button>
      </div>
    </div>

    </>

          

  );
}
