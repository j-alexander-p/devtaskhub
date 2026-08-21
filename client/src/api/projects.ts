import type { NewProjectBody } from "../types/projects";
import type { Project, Member } from "../types/projects";

export async function getProjects(): Promise<Project[]> {
  const response = await fetch(`http://localhost:3000/projects/`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Couldn't fetch projects.");
  }

  const data = await response.json();

  return data.projects;
}

export async function createProject(body: NewProjectBody) {
  const response = await fetch("http://localhost:3000/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error);
  }

  return response.json();
}

export async function getMembers(projectId: number): Promise<Member[]> {
  const response = await fetch(
    `http://localhost:3000/projects/${projectId}/members`,
    {
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Couldn't fetch members.");
  }

  const data = await response.json();

  return data.members;
}
