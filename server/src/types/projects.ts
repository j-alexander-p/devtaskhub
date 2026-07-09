export interface CreateProjectBody {
  project_name: string;
}

export interface UpdateProjectBody {
  status: string;
}

export interface addMemberBody {
  id: string;
  role: string;
}
