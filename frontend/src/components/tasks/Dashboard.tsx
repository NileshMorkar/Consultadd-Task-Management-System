import { useState, useMemo } from "react";
import type { Task, Column as ColumnType } from "./types";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import CreateTask from "./CreateTask";
import { Column as TaskColumn } from "./Column";
import { Plus } from "lucide-react";
const COLUMNS: ColumnType[] = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "DONE", title: "Done" },
];

const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    title: "Research Project",
    description: "Gather requirements and create initial documentation",
    status: "TODO",
    priority: "High",
    deadline: "2025-07-25",
    tags: ["research"],
  },
  {
    id: "2",
    title: "Design System",
    description: "Create component library and design tokens",
    status: "TODO",
    priority: "Medium",
    deadline: "2025-07-28",
    tags: ["design"],
  },
  {
    id: "3",
    title: "API Integration",
    description: "Implement REST API endpoints",
    status: "IN_PROGRESS",
    priority: "Low",
    deadline: "2025-07-23",
    tags: ["backend"],
  },
  {
    id: "4",
    title: "Testing",
    description: "Write unit tests for core functionality",
    status: "DONE",
    priority: "Medium",
    deadline: "2025-07-21",
    tags: ["testing"],
  },
  {
    id: "5",
    title: "Testing 1",
    description: "Write unit tests for core functionality",
    status: "DONE",
    priority: "Medium",
    deadline: "2025-07-21",
    tags: ["testing"],
  },
  {
    id: "6",
    title: "Testing 2",
    description: "Write unit tests for core functionality",
    status: "DONE",
    priority: "Medium",
    deadline: "2025-07-21",
    tags: ["testing"],
  },
];

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"priority" | "deadline" | "">("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);

  // const handleOnTaskDelete = (id) => {
  //   console.log("task Is Deleted ", id);
  // };

  // const handleOnTaskEdit = (id) => {
  //   console.log("Task Is Edited ", id);
  // };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as Task["status"];

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
  }

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Search
    if (search.trim()) {
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter) {
      result = result.filter((task) => task.status === statusFilter);
    }

    // Sort
    if (sortBy === "priority") {
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
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

  return (
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
          className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
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
              // onUpdate={handleOnTaskEdit}
              tasks={filteredTasks.filter((task) => task.status === column.id)}
            />
          ))}
        </div>
      </DndContext>

      {/* Task Creation Form Modal */}
      {showForm && <CreateTask setShowForm={setShowForm} setTasks={setTasks} />}
    </div>
  );
}

export default Dashboard;
