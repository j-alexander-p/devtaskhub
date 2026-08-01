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

  return <div></div>;
}

export default ProjectDetails;
