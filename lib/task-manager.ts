import { v4 as uuidv4 } from 'uuid';

export interface Task<T> {
  id: string;
  status: 'pending' | 'completed' | 'failed';
  result?: T;
  error?: string;
}

export const tasks: Map<string, Task<any>> = new Map();

export class TaskManager {
  static createTask(): string {
    const taskId = uuidv4();
    return taskId;
  }

  static completeTask<T>(taskId: string, result: T) {
    tasks.set(taskId, { id: taskId, status: 'completed', result });
  }

  static failTask(taskId: string, error: string) {
    tasks.set(taskId, { id: taskId, status: 'failed', error });
  }

  static getTask<T>(taskId: string): Task<T> | undefined {
    return tasks.get(taskId);
  }

  static removeTask(taskId: string) {
    tasks.delete(taskId);
  }
}
