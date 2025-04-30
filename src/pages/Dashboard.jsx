import { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import TaskList from "../components/TaskList";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [view, setView] = useState(null);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects", { withCredentials: true });
      setProjects(res.data.data); // adjust if your API response wraps data
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        alert(err.response?.data?.message || "Error fetching projects");
      }
    }
  };
  

  const createProject = async (e) => {
    e.preventDefault();
    try {
      await API.post("/projects", { title }, { withCredentials: true });
      setTitle("");
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating project");
    }
  };

  const deleteProject = async (id) => {
    try {
      await API.delete(`/projects/${id}`, { withCredentials: true });
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting project");
    }
  };

  return (
    <div className="flex">
      <div className="sidebar p-4 bg-gray-900 text-white h-screen">
        <h2>Features</h2>
        <ul className="nav flex-column space-y-2">
          <li>
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
              >
                Project
              </button>
              <ul className="dropdown-menu show static">
                <li>
                  <a
                    className="dropdown-item cursor-pointer"
                    onClick={() => {
                      fetchProjects();
                      setView("view");
                    }}
                  >
                    View project
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item cursor-pointer"
                    onClick={() => setView("create")}
                  >
                    Create project
                  </a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>

      <div className="content p-6 flex-1 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h1>

        {view === "view" && (
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl mb-4 font-semibold">Your Projects</h2>
            {projects.length === 0 ? (
              <p>No projects found.</p>
            ) : (
              <ul className="space-y-2">
                {projects.map((project) => (
  <li key={project._id} className="border-b pb-2">
    <div className="flex justify-between items-center">
      <strong>{project.title}</strong>
      <div className="flex gap-3">
        <button
          onClick={() => setSelectedProjectId(project._id)}
          className="view-tasks"
        >
          View Tasks
        </button>
        <button
          onClick={() => deleteProject(project._id)}
          className="project-delete"
        >
          Delete
        </button>
      </div>
    </div>
    {selectedProjectId === project._id && (
      <div className="ml-4 mt-2">
        <TaskList projectId={project._id} />
      </div>
    )}
  </li>
))}

              </ul>
            )}
          </div>
        )}

        {view === "create" && (
          <div className="bg-white p-4 mt-6 rounded shadow-md">
            <h2 className="text-xl mb-4 font-semibold">Create a New Project</h2>
            <form onSubmit={createProject} className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Project title"
                required
                className="w-full px-3 py-2 rounded border border-gray-300"
              />
              <button
                type="submit"
                className="create-project"
              >
                Create
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
