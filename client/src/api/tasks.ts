import type { NewTaskBody } from "../types/projects";

export async function createTask(projectId: number, body: NewTaskBody) {
  const response = await fetch(
    `http://localhost:3000/projects/${projectId}/tasks`,
    {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || data.message || "Failed to create task.");
  }

  return response.json();
}

export async function deleteTask(taskId: number) {
  const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
    credentials: "include",
    method: "DELETE",
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || data.message || "Failed to delete task.");
  }

  return taskId;
}

export async function updateTaskStatus(taskId: number, status: string) {
  const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
    credentials: "include",
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(
      data.error || data.message || "Failed to update task status.",
    );
  }

  return response.json();
}

export async function reassignTask(taskId: number, assignedTo: number) {
  const response = await fetch(`http://localhost:3000/tasks/${taskId}/assign`, {
    credentials: "include",
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ assigned_to: assignedTo }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || data.message || "Failed to reassign task.");
  }

  return response.json();
}
