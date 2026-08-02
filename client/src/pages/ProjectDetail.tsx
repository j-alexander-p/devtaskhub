import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Member, Project, Task } from "../types/projects";

function ProjectDetails() {
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams();

  useEffect(() => {
    async function getDetails() {
      try {
        const responseMembers = await fetch(
          `http://localhost:3000/projects/${id}/members`,
          {
            credentials: "include",
          },
        );
        const dataMembers = await responseMembers.json();
        setMembers(dataMembers.members);

        const responseProject = await fetch(
          `http://localhost:3000/projects/${id}`,
          {
            credentials: "include",
          },
        );
        const dataProject = await responseProject.json();
        setProject(dataProject.project);

        const responseTasks = await fetch(
          `http://localhost:3000/projects/${id}/tasks`,
          {
            credentials: "include",
          },
        );
        const dataTasks = await responseTasks.json();
        setTasks(dataTasks.tasks);

        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        setError("Failed to fetch project details.");
      }
    }
    getDetails();
  }, []);

  if (!project) {
    return <p>Project not found.</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <div>
        <h2>{project.project_name}</h2>
        {tasks.map((task) => (
          <div key={task.id}>
            <h3>{task.title}</h3>
            <h3>{task.description}</h3>
          </div>
        ))}
        {members.map((member) => (
          <div key={member.id}>
            <h3>{member.username}</h3>
            <h3>{member.role}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectDetails;
