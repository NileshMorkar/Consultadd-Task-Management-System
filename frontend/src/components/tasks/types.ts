export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  deadline: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tagNames: string[];
  assigneeEmails: string[];
};

export type Comment = {
  id: number;
  content: string;
  author: string;
  createdAt: string;
};

export type Column = {
  id: string;
  title: string;
};
