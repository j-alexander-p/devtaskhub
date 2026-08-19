import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import type { NewProjectBody } from "../types/projects";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject, getProjects } from "../api/projects";

function Dashboard() {
  const { user } = useAuth();

  const [newProject, setNewProject] = useState<NewProjectBody>({
    project_name: "",
  });

  const {
    data: projects,
    isPending,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setNewProject({ project_name: "" });
    },
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewProject({
      ...newProject,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    createProjectMutation.mutate(newProject);
  }

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error.message}</p>;
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
        <div>
          {createProjectMutation.error && (
            <p>{createProjectMutation.error.message}</p>
          )}
        </div>
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
