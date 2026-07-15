export interface CreateTaskBody {
  title: string;
  description?: string;
  assigned_to?: number;
}

export interface UpdateTaskBody {
  title: string;
  description?: string;
  assigned_to?: number;
}
