export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface Task {
   id: string;
   title: string;
   description: string;
   status: TaskStatus;
   trackedTime: number; // in seconds
}

export type CreateTaskInput = Pick<Task, 'title' | 'description'>;
export type ImproveTaskInput = Pick<Task, 'title' | 'description'>;
export type TaskSuggestion = Pick<Task, 'title' | 'description'>;
export type UpdateTaskInput = Partial<
   Pick<Task, 'title' | 'description' | 'status' | 'trackedTime'>
>;
