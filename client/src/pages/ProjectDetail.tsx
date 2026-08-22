import { useParams } from "react-router-dom";
import { useState } from "react";
import type { CreateTaskForm, NewTaskBody } from "../types/projects";
import { useAuth } from "../context/AuthContext";
import {
  getMembers,
  getProjectById,
  getTasksByProjectId,
} from "../api/projects";
import {
  createTask,
  deleteTask,
  reassignTask,
  updateTaskStatus,
} from "../api/tasks";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function ProjectDetails() {
  // project details display

  const [newTask, setNewTask] = useState<CreateTaskForm>({
    title: "",
    description: "",
    assigned_to: "",
  }); //task creation form details

  const { user } = useAuth();
  const { id } = useParams();

  const {
    data: members,
    isPending: membersPending,
    error: membersError,
  } = useQuery({
    queryKey: ["members", id],
    queryFn: () => getMembers(Number(id)),
  });

  const {
    data: project,
    isPending: projectPending,
    error: projectError,
  } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectById(Number(id)),
  });

  const {
    data: tasks,
    isPending: taskPending,
    error: taskError,
  } = useQuery({
    queryKey: ["tasks", id],
    queryFn: () => getTasksByProjectId(Number(id)),
  });

  const queryClient = useQueryClient();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setNewTask({
      ...newTask,
      [e.target.name]: e.target.value,
    });
  }

  const createTaskMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: NewTaskBody }) =>
      createTask(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: ({ taskId }: { taskId: number }) => deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: number; status: string }) =>
      updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
    },
  });

  const reassignTaskMutation = useMutation({
    mutationFn: ({
      taskId,
      assignedTo,
    }: {
      taskId: number;
      assignedTo: number;
    }) => reassignTask(taskId, assignedTo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", id] });
    },
  });

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    createTaskMutation.mutate({
      id: Number(id),
      body: {
        ...newTask,
        assigned_to: newTask.assigned_to ? Number(newTask.assigned_to) : null,
      },
    });
  }

  if (membersPending || projectPending || taskPending) {
    return <p>Loading...</p>;
  }

  if (!project) {
    return <p>Project not found.</p>;
  }

  if (membersError || projectError || taskError) {
    return <p>Something went wrong.</p>;
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
                  reassignTaskMutation.mutate({
                    taskId: task.id,
                    assignedTo: parseInt(e.target.value),
                  })
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
                updateStatusMutation.mutate({
                  taskId: task.id,
                  status: task.status === "pending" ? "complete" : "pending",
                })
              }
            >
              {task.status === "pending" ? "Mark complete" : "Mark pending"}
            </button>
            <button
              onClick={() => deleteTaskMutation.mutate({ taskId: task.id })}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectDetails;
