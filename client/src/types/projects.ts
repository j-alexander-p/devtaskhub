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
  created_by: number;
}

export interface CreateTaskForm {
  title: string;
  description?: string;
  assigned_to: string;
}

export interface NewProjectBody {
  project_name: string;
}

export interface NewTaskBody {
  title: string;
  description?: string;
  assigned_to: number | null;
}
