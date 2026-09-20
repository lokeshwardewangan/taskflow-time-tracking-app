export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface Task {
   id: string;
   title: string;
   description: string;
   status: TaskStatus;
   trackedTime: number; // in seconds
}
