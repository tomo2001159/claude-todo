export type Priority = 'high' | 'medium' | 'low';
export type Category = 'work' | 'personal' | 'shopping' | 'health' | 'other';
export type Filter = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  dueDate?: string;
  createdAt: string;
}
