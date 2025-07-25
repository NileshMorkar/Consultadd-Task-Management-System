import React from 'react'

function CreateTask({ setShowForm, setTasks }) {

    function handleCreateTask(e) {
        e.preventDefault();
        const form = e.currentTarget;
        // const title = form.title.value;
        const description = form.description.value;
        const priority = form.priority.value;
        const deadline = form.deadline.value;

        const newTask = {
            id: "2",
            title: "Nilesh",
            description,
            status: 'TODO',
            priority,
            deadline,
            tags: [],
        };

        setTasks((prev) => [...prev, newTask]);
        setShowForm(false);
        form.reset();
    }
    return (
        <>
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
                    <select name="priority" className="w-full mb-3 px-3 py-2 border rounded" required>
                        <option value="">Priority</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                    <input
                        type="date"
                        name="deadline"
                        required
                        className="w-full mb-4 px-3 py-2 border rounded"
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-3 py-1.5 border rounded hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default CreateTask