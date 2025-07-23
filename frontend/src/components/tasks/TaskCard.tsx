import { useDraggable } from '@dnd-kit/core';
import { Task } from './types';

type TaskCardProps = {
  task: Task;
};

export function TaskCard({ task }: TaskCardProps) {
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

  const handleTaskClick = ()=>{
    console.log("hello World");
    
  }
  return (
    <div
      onClick={handleTaskClick}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="cursor-grab rounded-xl bg-white/10 border border-white/10 p-5 backdrop-blur-md shadow-lg hover:shadow-xl transition-transform duration-150"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-300">ID: {task.id}</span>
        <span className={`text-xs text-white px-2 py-1 rounded-full ${statusColors[task.status] || 'bg-gray-500'}`}>
          {task.status.replace('_', ' ')}
        </span>
      </div>

      <h3 className="text-lg font-bold text-white mb-2">{task.title}</h3>
      <p className="text-sm text-gray-300">{task.description}</p>
    </div>
  );
}
