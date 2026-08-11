import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import type { Project, NewProjectBody } from "../types/projects";
import { Link } from "react-router-dom";

function Dashboard() {
  const { user } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newProject, setNewProject] = useState<NewProjectBody>({
    project_name: "",
  });
  const [newProjErr, setNewProjErr] = useState<string | null>(null);

  async function fetchProjects() {
    try {
      const response = await fetch(`http://localhost:3000/projects/`, {
        credentials: "include",
      });

      const data = await response.json();
      setProjects(data.projects);

      setLoading(false);
    } catch (err: any) {
      setError("Failed to load projects");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewProject({
      ...newProject,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProject),
      credentials: "include",
    });

    if (response.ok) {
      setNewProject({ project_name: "" });

      fetchProjects();
    } else {
      const data = await response.json();

      setNewProjErr(data.error);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Welcome, {user?.email}!</h1>
      <h1>Your Projects</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Project Name"
            name="project_name"
            value={newProject.project_name}
            onChange={handleChange}
          />
          <button type="submit">Create</button>
        </form>
        <div>{newProjErr && <p>{newProjErr}</p>}</div>
      </div>
      {projects.map((project) => (
        <div key={project.id}>
          <Link to={`/projects/${project.id}`}>{project.project_name}</Link>
          <p>Status: {project.status}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
