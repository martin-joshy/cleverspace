export interface Task {
  id: string;
  title: string;
  description: string;
  is_completed: boolean;
  scheduled_on: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  scheduled_on: string;
}
