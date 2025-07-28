import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import {
  CalendarDays,
  Clock,
  Pencil,
  RefreshCw,
  Trash2,
  UserCircle2,
} from "lucide-react";
import AddCommentIcon from "@mui/icons-material/AddComment";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Comment, Task } from "./types";
import axiosInstance from "../../axiosInstance";
import CircularProgress from "@mui/material/CircularProgress";

export function TaskCard({
  task,
  setTasks,
}: {
  task: Task;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  suggestedTags?: string[];
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  const statusColors: Record<Task["status"], string> = {
    TODO: "bg-yellow-500",
    IN_PROGRESS: "bg-blue-500",
    DONE: "bg-green-500",
  };

  const [showEdit, setShowEdit] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });
  const [isTagAddClick, setIsTagAddClick] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isAllCommentsAreLoading, setIsAllCommentsAreLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isCommentIconClick, setIsCommentIconClick] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState(task.assigneeEmails);
  const [selectedTags, setSelectedTags] = useState(task.tagNames);

  const handleUpdate = () => {
    try {
      console.log(selectedUsers);
      console.log(selectedTags);

      const data = {
        title: editedTask.title,
        description: editedTask.description,
        priority: editedTask.priority,
        deadline: editedTask.deadline,
        tagNames: selectedTags,
        assigneeEmails: selectedUsers,
      };
      const response = axiosInstance.put(`tasks/${task.id}`, data);
      console.log(response);
      editedTask.assigneeEmails = selectedUsers;
      editedTask.tagNames = selectedTags;
      setTasks((prev) => prev.map((t) => (t.id === task.id ? editedTask : t)));
    } catch (error) {
      console.log(error);
    }

    setShowEdit(false);
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to DELETE this task?\nTask Id: ${task.id}\nTask Title: ${task.title}`
    );
    if (confirmed) {
      try {
        const response = axiosInstance.delete(`tasks/${task.id}`);
        setTasks((prevTasks) => prevTasks.filter((t) => t.id !== task.id));
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Task Comments
  const getAllComments = async () => {
    setIsAllCommentsAreLoading(true);
    try {
      const response = await axiosInstance.get(`/tasks/${task.id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setIsAllCommentsAreLoading(false);
    }
  };
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(`/tasks/${task.id}/comments`, {
        content: newComment,
      });

      const commentResonse: Comment = {
        id: response.data.id,
        content: response.data.content,
        author: response.data.author,
        createdAt: response.data.createdAt,
      };

      console.log(commentResonse);

      setComments((prev) => [...prev, commentResonse]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="cursor-grab rounded-xl bg-white/10 border border-white/10 p-5 backdrop-blur-md shadow-lg hover:shadow-xl transition-transform duration-150 relative"
      >
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

        <h3 className="text-lg font-bold text-white mb-1">{task.title}</h3>
        <p className="text-sm text-gray-300 mb-2">{task.description}</p>

        <div className="mt-4 space-y-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-blue-500" />

            <span>
              <strong>Created:</strong>{" "}
              {new Date(task.createdAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
                hour12: true,
              })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-green-600" />
            <span>
              <strong>Deadline:</strong>{" "}
              {new Date(task.deadline).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
                hour12: true,
              })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-orange-500" />
            <span>
              <strong>Updated:</strong>{" "}
              {new Date(task.updatedAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
                hour12: true,
              })}
            </span>
          </div>
        </div>

        <small className="mt-4 underline text-white rounded-full text-xs font-semibold">
          Priority : {task.priority}
        </small>

        {/* Tags */}
        <p className="text-white mt-4">Tags :</p>
        {task.tagNames.length === 0 && (
          <small className="text-white"> No Tags Are Present.</small>
        )}
        <div className="mt-2 flex flex-wrap gap-2 items-center">
          {task.tagNames.map((tag, index) => (
            <div
              key={index}
              className="flex bg-gray-500 text-white text-xs px-2 py-1 rounded-full items-center"
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Assignees */}
        <div className="mt-3 flex flex-wrap gap-2">
          {task.assigneeEmails.map((assignee, index) => (
            <div
              key={index}
              className="bg-blue-800 text-white text-xs px-2 py-1 rounded-full flex items-center"
            >
              <UserCircle2 className="mr-1" size={16} />
              {assignee}
            </div>
          ))}
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
            onClick={handleDelete}
            className="cursor-pointer p-2 rounded-4xl border text-red-400 hover:text-red-200 transition"
            title="Delete Task"
          >
            <Trash2 size={20} />
          </button>
          <button
            onClick={() => {
              setIsCommentIconClick(true);
              getAllComments();
            }}
            className="cursor-pointer p-2 rounded-4xl border text-white hover:text-gray-300 transition"
            title="View Comments"
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

            <label className="block  text-sm">Description</label>
            <textarea
              className="w-full p-2 border rounded mb-4"
              value={editedTask.description}
              onChange={(e) =>
                setEditedTask({ ...editedTask, description: e.target.value })
              }
            />

            <label className="block text-sm">Status</label>
            <select
              className="w-full p-2 border rounded mb-4"
              value={editedTask.status}
              onChange={(e) =>
                setEditedTask({
                  ...editedTask,
                  status: e.target.value as Task["status"],
                })
              }
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>

            <label className="block mb-2 text-sm">Deadline</label>
            <input
              type="datetime-local"
              name="deadline"
              required
              value={editedTask.deadline}
              onChange={(e) =>
                setEditedTask({ ...editedTask, deadline: e.target.value })
              }
              className="w-full mb-4 px-3 py-2 border rounded"
            />

            <Autocomplete
              multiple
              options={[
                "important",
                "office",
                "friends",
                "exam tasks",
                "today",
                "my tasks",
              ]}
              value={selectedTags}
              onChange={(e, value) => setSelectedTags(value)}
              renderInput={(params) => (
                <TextField {...params} label="Select Tags" size="small" />
              )}
              className="bg-white rounded mb-6"
            />

            <Autocomplete
              multiple
              options={[
                "ndmorkar@gmail.com",
                "chetan.p@gmail.com",
                "pratik.k@gmail.com",
                "shamu@gmail.com",
                "shital@consultadd.com",
                "abhishek.b@consultadd.com",
                "ashwing.k@gmail.com",
              ]}
              value={selectedUsers}
              onChange={(e, value) => setSelectedUsers(value)}
              renderInput={(params) => (
                <TextField {...params} label="Select Assignees" size="small" />
              )}
              className="bg-white rounded"
            />

            <div className="mt-4 flex justify-end gap-3">
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
      {isCommentIconClick && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Comments</h2>
            {isAllCommentsAreLoading ? (
              <CircularProgress />
            ) : (
              <div className="max-h-60 overflow-y-auto mb-4">
                {comments.length ? (
                  comments.map((comment, index) => (
                    <div
                      key={index}
                      className="mb-4 p-3 rounded-lg bg-gray-100 shadow-sm border border-gray-300"
                    >
                      <p className="text-sm text-gray-800 mb-2">
                        {comment.content}
                      </p>

                      <div className="flex justify-between text-xs text-gray-500">
                        <span>By: {comment.author}</span>
                        <span>
                          {new Date(comment.createdAt).toLocaleString(
                            undefined,
                            {
                              dateStyle: "medium",
                              timeStyle: "short",
                              hour12: true,
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No comments yet.</p>
                )}
              </div>
            )}
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment"
              className="w-full p-2 border rounded mb-3"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsCommentIconClick(false);
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
              <button
                disabled={isLoading}
                onClick={handleAddComment}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {isLoading ? "Please Wait..." : "Add Comment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
