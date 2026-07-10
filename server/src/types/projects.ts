export interface CreateProjectBody {
  project_name: string;
}

export interface UpdateProjectBody {
  status: string;
}

export interface addMemberBody {
  member_id: string;
  role: string;
}
