import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import type { Project } from "../types/projects";

function Dashboard() {
  const { user } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchProjects();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Your Projects</h1>
      {projects.map((project) => (
        <div key={project.id}>
          <h2>{project.project_name}</h2>
          <p>Status: {project.status}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
