import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Member, Project, Task, CreateTaskBody } from "../types/projects";
import { useAuth } from "../context/AuthContext";

function ProjectDetails() {
  // project details display
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTask, setNewTask] = useState<CreateTaskBody>({
    title: "",
    description: "",
    assigned_to: "",
  }); //task creation form details

  const { user } = useAuth();
  const { id } = useParams();

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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const response = await fetch(`http://localhost:3000/projects/${id}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title: newTask.title,
        description: newTask.description,
        assigned_to: newTask.assigned_to
          ? parseInt(newTask.assigned_to)
          : undefined,
      }),
    });

    if (response.ok) {
      setNewTask({
        title: "",
        description: "",
        assigned_to: "",
      });

      await getDetails();
    } else {
      const data = await response.json();

      setError(data.error);
    }
  }

  async function deleteTask(taskId: number) {
    const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (response.ok) {
      await getDetails();
    } else {
      const data = await response.json();

      setError(data.error);
    }
  }

  async function updateStatus(taskId: number, statusUpdate: string) {
    const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: statusUpdate }),
    });

    if (response.ok) {
      await getDetails();
    } else {
      const data = await response.json();
      setError(data.error);
    }
  }

  async function reassignTask(taskId: number, newAssigneeId: number) {
    const response = await fetch(
      `http://localhost:3000/tasks/${taskId}/assign`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ assigned_to: newAssigneeId }),
      },
    );

    if (response.ok) {
      await getDetails();
    } else {
      const data = await response.json();
      setError(data.error);
    }
  }

  useEffect(() => {
    getDetails();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!project) {
    return <p>Project not found.</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={newTask.title}
          onChange={handleChange}
        />

        <input
          type="text"
          name="description"
          placeholder="Task Description"
          value={newTask.description}
          onChange={handleChange}
        />

        <select
          name="assigned_to"
          value={newTask.assigned_to}
          onChange={handleChange}
        >
          <option value="">Unassigned</option>

          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.username}
            </option>
          ))}
        </select>

        <button type="submit">Create Task</button>
      </form>
      <div>
        <h2>{project.project_name}</h2>
        {members.map((member) => (
          <div key={member.id}>
            <h3>{member.username}</h3>
            <h3>{member.role}</h3>
          </div>
        ))}
        {tasks.map((task) => (
          <div key={task.id}>
            <h3>{task.title}</h3>
            <h3>{task.description}</h3>
            {user?.id === task.created_by && (
              <select
                name="reassign_to"
                value={task.assigned_to ?? ""}
                onChange={(e) =>
                  reassignTask(task.id, parseInt(e.target.value))
                }
              >
                <option value="">Unassigned</option>

                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.username}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={() =>
                updateStatus(
                  task.id,
                  task.status === "pending" ? "complete" : "pending",
                )
              }
            >
              {task.status === "pending" ? "Mark complete" : "Mark pending"}
            </button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectDetails;
