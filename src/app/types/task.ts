export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  userId: string;
}

export interface TaskSearch {
  search?: string;
  category?: string;
  date?: string;
}
