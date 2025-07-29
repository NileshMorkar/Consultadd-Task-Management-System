import { useState, useMemo, useEffect, useCallback } from "react";
import type { Task, Column as ColumnType } from "./types";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Column as TaskColumn } from "./Column";
import axiosInstance from "../../axiosInstance";
import CircularProgress from "@mui/material/CircularProgress";
const COLUMNS: ColumnType[] = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "DONE", title: "Done" },
];

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"priority" | "deadline" | "">("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [isDataLoading, setIsDataLoading] = useState(false);

  // Use Effect To load Initial data
  useEffect(() => {
    setIsDataLoading(true);
    const getAllTasks = async () => {
      try {
        const response = await axiosInstance.get("/tasks/with-status");
        setTasks(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      } finally {
        setIsDataLoading(false);
      }
    };

    getAllTasks();
  }, []);

  // handle drag And Drop Event Of DND Kit
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const taskId = active.id;
      console.log(taskId);

      const newStatus = over.id as Task["status"];
      console.log(newStatus);

      try {
        const data = {
          statusId:
            newStatus === "TODO" ? 1 : newStatus === "IN_PROGRESS" ? 2 : 3,
        };
        axiosInstance.post(`tasks/${taskId}/status`, data);

        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status: newStatus,
                }
              : task
          )
        );
      } catch (error) {
        console.log(error);
      }
    },
    [setTasks]
  );

  // Tasks Filter Function
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Search By Flter
    const searchString = search.trim().toLowerCase();
    if (searchString) {
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchString) ||
          task.description.toLowerCase().includes(searchString) ||
          task.tagNames.includes(searchString)
      );
    }
    // Filter by status
    if (statusFilter) {
      result = result.filter((task) => task.status === statusFilter);
    }

    // Sort By Filter
    if (sortBy === "priority") {
      const priorityOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };
      result.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    } else if (sortBy === "deadline") {
      result.sort(
        (a, b) =>
          new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      );
    }

    return result;
  }, [search, sortBy, statusFilter, tasks]);

  // Create Task

  const [isLoading, setIsLoading] = useState(false);

  async function handleCreateTask(e) {
    setIsLoading(true);
    e.preventDefault();

    const form = e.currentTarget;
    const title = form.title.value;
    const description = form.description.value;
    const priority = form.priority.value;
    const deadline = form.deadline.value;

    const newTask = {
      title,
      description,
      priority,
      deadline,
      tagNames: [],
    };

    try {
      const response = await axiosInstance.post("/tasks", newTask);
      const createdTask = response.data;
      setTasks((prev) => [...prev, createdTask]);
      setShowForm(false);
      form.reset();
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isDataLoading ? (
        <div className="flex justify-center mt-50 mb-70">
          <CircularProgress />
        </div>
      ) : (
        <div className="p-4">
          {/* Controls */}
          <div className="text-white flex flex-wrap items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-white border px-3 py-1 rounded"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border px-2 py-1 rounded"
            >
              <option value="">Sort by</option>
              <option value="priority">Priority</option>
              <option value="deadline">Deadline</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="">All Status</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>

            <button
              onClick={() => setShowForm(true)}
              className="bg-gray-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
            >
              + Create Task
            </button>
          </div>

          {/* Task Columns */}
          <DndContext onDragEnd={handleDragEnd}>
            <div className="flex gap-8 overflow-x-auto">
              {COLUMNS.map((column) => (
                <TaskColumn
                  key={column.id}
                  column={column}
                  setTasks={setTasks}
                  tasks={filteredTasks.filter(
                    (task) => task.status === column.id
                  )}
                />
              ))}
            </div>
          </DndContext>

          {/* Task Creation Form Modal */}
          {showForm && (
            <div className="fixed inset-0  backdrop-blur-sm flex items-center justify-center z-50">
              <form
                onSubmit={handleCreateTask}
                className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg"
              >
                <h2 className="text-xl font-bold mb-4">Create New Task</h2>
                <input
                  name="title"
                  required
                  placeholder="Title"
                  className="w-full mb-3 px-3 py-2 border rounded"
                />
                <textarea
                  name="description"
                  required
                  placeholder="Description"
                  className="w-full mb-3 px-3 py-2 border rounded"
                />
                <select
                  name="priority"
                  className="w-full mb-3 px-3 py-2 border rounded"
                  required
                >
                  <option value="">Priority</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
                <input
                  type="datetime-local"
                  name="deadline"
                  required
                  className="w-full mb-4 px-3 py-2 border rounded"
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="cursor-pointer px-3 py-1.5 border rounded hover:bg-red-500"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 rounded-md font-semibold transition-all ${
                      isLoading
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "cursor-pointer  bg-cyan-500 hover:bg-cyan-600 text-white"
                    }`}
                  >
                    {isLoading ? "Please wait..." : "Create Task"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Dashboard;
