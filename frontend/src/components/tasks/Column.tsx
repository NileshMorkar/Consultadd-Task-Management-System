import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard';
import { Column as ColumnType, Task } from './types';

type ColumnProps = {
  column: ColumnType;
  tasks: Task[];
};

export function Column({ column, tasks }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex flex-col w-full sm:w-[300px] md:w-[340px] lg:w-[360px] rounded-2xl border-4 border-blue-800 bg-gradient-to-b from-sky-800 to-cyan-700 p-4 shadow-md mb-4 sm:mb-0">
      <h2 className="underline mb-4 text-lg font-semibold text-blue-100 tracking-wide text-center sm:text-left">
        {column.title}
      </h2>

      <div
        ref={setNodeRef}
        className="flex flex-1 flex-col gap-4 transition-all duration-200 ease-in-out"
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
