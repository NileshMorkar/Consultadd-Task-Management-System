import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Pencil, Trash2 } from "lucide-react";

export function TaskCard({ task, setTasks }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  const statusColors: Record<string, string> = {
    TODO: "bg-yellow-500",
    IN_PROGRESS: "bg-blue-500",
    DONE: "bg-green-500",
  };

  const [showEdit, setShowEdit] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  const handleUpdate = () => {
    console.log(editedTask);
    
    setShowEdit(false);
  };

  const handleDelete = () => {
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id));
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="cursor-grab rounded-xl bg-white/10 border border-white/10 p-5 backdrop-blur-md shadow-lg hover:shadow-xl transition-transform duration-150 relative"
      >
        {/* Header (Drag handle) */}
        <div
          className="flex items-center justify-between mb-2"
          {...listeners}
          {...attributes}
        >
          <span className="text-xs font-semibold text-gray-300">
            ID: {task.id}
          </span>
          <span
            className={`text-xs text-white px-2 py-1 rounded-full ${
              statusColors[task.status] || "bg-gray-500"
            }`}
          >
            {task.status.replace("_", " ")}
          </span>
        </div>

        {/* Title + Description */}
        <h3 className="text-lg font-bold text-white mb-2">{task.title}</h3>
        <p className="text-sm text-gray-300">{task.description}</p>

        {/* Buttons */}
        <div className="mt-4 flex gap-4">
          <button
            className="p-2 rounded-4xl border text-blue-400 hover:text-blue-200 transition"
            title="Edit Task"
            onClick={() => {
              setEditedTask({ ...task }); // Reset form values
              setShowEdit(true);
            }}
          >
            <Pencil size={20} />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="p-2 rounded-4xl border text-red-400 hover:text-red-200 transition"
            title="Delete Task"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>

            <label className="block mb-2 text-sm">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded mb-4"
              value={editedTask.title}
              onChange={(e) =>
                setEditedTask({ ...editedTask, title: e.target.value })
              }
            />

            <label className="block mb-2 text-sm">Description</label>
            <textarea
              className="w-full p-2 border rounded mb-4"
              value={editedTask.description}
              onChange={(e) =>
                setEditedTask({ ...editedTask, description: e.target.value })
              }
            />

            <label className="block mb-2 text-sm">Status</label>
            <select
              className="w-full p-2 border rounded mb-4"
              value={editedTask.status}
              onChange={(e) =>
                setEditedTask({
                  ...editedTask,
                  status: e.target.value as typeof task.status,
                })
              }
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEdit(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
