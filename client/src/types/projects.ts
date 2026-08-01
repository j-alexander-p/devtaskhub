export interface Project {
  id: number;
  project_name: string;
  created_by: number;
  status: string;
  created_at: string;
}

export interface Member {
  id: number;
  username: string;
  role: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
  assigned_to: number;
}
