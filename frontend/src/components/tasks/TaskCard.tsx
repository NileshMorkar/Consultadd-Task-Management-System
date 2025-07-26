import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import AddCommentIcon from "@mui/icons-material/AddComment";
import { comment } from "./types";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
export function TaskCard({
  task,
  setTasks,
  suggestedTags = ["p1", "2D", "p3", "p4", "p5", "p6"],
}) {
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
  const [isTagAddClick, setIsTagAddClick] = useState(false);
  //
  const [isTagEditClick, setIsTagEditClick] = useState(false);

  const [comments, setComments] = useState<comment[]>([]);
  const [isCommentIconClick, setIsCommentIconClick] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleUpdate = () => {
    console.log(editedTask);
    setComments([
      { id: 1, msg: "123", msgby: "123dfg" },
      { id: 2, msg: "123", msgby: "abcd" },
      { id: 3, msg: "123", msgby: "dkljsdjkl" },
      { id: 33, msg: "123", msgby: "dkljsdjkl" },
    ]);
    setShowEdit(false);
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to DELETE this task? \nTask Id : ${task.id}\nTask Name : ${task.title}`
    );
    if (confirmed) {
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id));
    }
  };

  const getAllComments = (id) => {
    console.log("get Comments For ", id);

    setIsCommentIconClick(true);
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

        {/* Tag List */}
        <div className="mt-2 flex  gap-2">
          {task.tags?.map(
            (tag, index) =>
              !isTagEditClick && (
                <div
                  key={index}
                  className="flex bg-gray-500 text-white text-xs px-2 py-1 rounded-full"
                >
                  {tag}

                  <Pencil
                    onClick={() => {
                      setIsTagEditClick(true);
                    }}
                    className="ml-2 cursor-pointer  hover:text-blue-800 transition"
                    size={18}
                  />
                </div>
              )
          )}
          <Tooltip title="Add Tag">
            <PlusCircle
              onClick={() => {
                setIsTagAddClick(true);
              }}
              className="cursor-pointer text-gray-300 "
            />
          </Tooltip>

          {isTagAddClick && (
            <div>
              <Autocomplete
                disablePortal
                options={suggestedTags}
                renderInput={(params) => <TextField {...params} label="Tag" />}
              />
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-4 flex gap-4">
          <button
            className="cursor-pointer p-2 rounded-4xl border text-blue-400 hover:text-blue-200 transition"
            title="Edit Task"
            onClick={() => {
              setEditedTask({ ...task });
              setShowEdit(true);
            }}
          >
            <Pencil size={20} />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="cursor-pointer p-2 rounded-4xl border text-red-400 hover:text-red-200 transition"
            title="Delete Task"
          >
            <Trash2 size={20} />
          </button>

          <button
            type="button"
            onClick={() => {
              getAllComments(task.id);
            }}
            className="cursor-pointer p-2 rounded-4xl border text-white hover:text-grey transition"
            title="Delete Task"
          >
            <AddCommentIcon />
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
