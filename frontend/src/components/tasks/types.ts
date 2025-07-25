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
export type comment ={
  id: number;
  msg:string  
  msgby:string
}


export type Column = {
  id: string;
  title: string;
};