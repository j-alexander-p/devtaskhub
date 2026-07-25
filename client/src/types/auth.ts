export interface RegisterBody {
  username: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface User {
  email: string;
  id: number;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}
