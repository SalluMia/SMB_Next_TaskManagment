export interface Task {
    _id: string;
    title: string;
    description: string;
    dueDate: string; // Change this to Date
    completed: boolean;
    user: string;
  }
