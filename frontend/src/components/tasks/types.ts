export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  tags?: string[];
};


export type Column = {
  id: TaskStatus;
  title: string;
};