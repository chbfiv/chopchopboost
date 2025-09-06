export interface Task {
  title: string;
  details: string[];
  imageUrl: string;
}

export interface Milestone {
  title: string;
  description: string;
  imageUrl: string;
  tasks?: Task[];
  isCompleted?: boolean;
}