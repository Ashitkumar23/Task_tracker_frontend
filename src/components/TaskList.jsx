import { useState, useEffect } from "react";
import API from "../utils/api";

const TaskList = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "Pending",
  });
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTask, setEditTask] = useState({
    title: "",
    description: "",
    status: "Pending",
  });

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks/${projectId}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error(err.response?.data?.message || "Error fetching tasks");
    }
  };

  useEffect(() => {
    if (projectId) fetchTasks();
  }, [projectId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/tasks/${projectId}/tasks`, newTask);
      setNewTask({ title: "", description: "", status: "To Do" });
      fetchTasks();
    } catch (err) {
      console.error(err.response?.data?.message || "Error creating task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await API.delete(`/tasks/${projectId}/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error(err.response?.data?.message || "Error deleting task");
    }
  };

  const handleUpdateTask = async (taskId) => {
    try {
      await API.put(`/tasks/${projectId}/tasks/${taskId}`, editTask);
      setEditTaskId(null);
      setEditTask({ title: '', description: '', status: 'Pending' });
      fetchTasks();
    } catch (err) {
      console.error(err.response?.data?.message || 'Error updating task');
    }
  };

  return (
    <div className="mt-4 p-3 bg-gray-100 rounded">
      <h4 className="font-semibold text-lg mb-4">Tasks</h4>

      {tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task._id}
            className="border p-3 mb-3 rounded bg-white shadow-sm"
          >
            {editTaskId === task._id ? (
              <div className="space-y-2">
                <input
                  value={editTask.title}
                  onChange={(e) =>
                    setEditTask({ ...editTask, title: e.target.value })
                  }
                  placeholder="Title"
                  className="w-full border px-2 py-1"
                />
                <textarea
                  value={editTask.description}
                  onChange={(e) =>
                    setEditTask({ ...editTask, description: e.target.value })
                  }
                  placeholder="Description"
                  className="w-full border px-2 py-1"
                />
                <select
                  value={editTask.status}
                  onChange={(e) =>
                    setEditTask({ ...editTask, status: e.target.value })
                  }
                  className="w-full border px-2 py-1"
                >
                  <option value="Pending">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <button
                  onClick={() => handleUpdateTask(task._id)}
                  className="bg-green-600 text-white px-2 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditTaskId(null)}
                  className="text-gray-500 ml-2"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <h5 className="font-bold">{task.title}</h5>
                <p className="text-sm text-gray-700">{task.description}</p>
                <p className="text-xs text-gray-500">Status: {task.status}</p>
                <p className="text-xs text-gray-400">
                  Created: {new Date(task.createdAt).toLocaleDateString()}
                  {task.completedAt &&
                    ` | Completed: ${new Date(
                      task.completedAt
                    ).toLocaleDateString()}`}
                </p>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => {
                      setEditTaskId(task._id);
                      setEditTask({
                        title: task.title || '',
                        description: task.description || '',
                        status: task.status || 'Pending'
                      });
                    }}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}

      {/* New Task Form */}
      <form
        onSubmit={handleCreateTask}
        className="mt-6 bg-white p-4 rounded shadow space-y-2"
      >
        <h5 className="font-semibold">Create New Task</h5>
        <input
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="Title"
          required
          className="w-full border px-2 py-1"
        />
        <textarea
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          placeholder="Description"
          required
          className="w-full border px-2 py-1"
        />
        <select
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          className="w-full border px-2 py-1"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Create Task
        </button>
      </form>
    </div>
  );
};

export default TaskList;
