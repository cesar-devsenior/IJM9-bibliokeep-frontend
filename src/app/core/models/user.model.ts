export interface User {
  id: string; // UUID
  email: string;
  password: string; // BCrypt encoded (backend)
  preferences: string[]; // Set<String>
  annualGoal: number; // Integer (Default: 12)
}

