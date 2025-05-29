
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: 'personal' | 'work' | 'shopping' | 'health' | 'other';
  createdAt: Date;
  updatedAt: Date;
}

export interface FilterOptions {
  search: string;
  category: string;
  priority: string;
  status: 'all' | 'completed' | 'pending';
}
