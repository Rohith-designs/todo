
import React, { useState, useMemo } from 'react';
import { Task, FilterOptions } from '@/types/todo';
import { TaskForm } from './TaskForm';
import { TaskItem } from './TaskItem';
import { FilterBar } from './FilterBar';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';
import { CheckCircle, Clock, ListTodo, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const TodoApp: React.FC = () => {
  const { user, signOut } = useAuth();
  const { tasks, isLoading, addTask, updateTask, deleteTask, toggleTask } = useTasks();
  const navigate = useNavigate();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: '',
    priority: '',
    status: 'all',
  });

  // Redirect to auth if not logged in
  React.useEffect(() => {
    if (!user && !isLoading) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    addTask(taskData);
  };

  const handleUpdateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingTask) return;
    updateTask({ id: editingTask.id, ...taskData });
    setEditingTask(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = !filters.search || 
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description?.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesCategory = !filters.category || task.category === filters.category;
      const matchesPriority = !filters.priority || task.priority === filters.priority;
      const matchesStatus = filters.status === 'all' || 
        (filters.status === 'completed' && task.completed) ||
        (filters.status === 'pending' && !task.completed);

      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });
  }, [tasks, filters]);

  const taskCounts = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    pending: tasks.filter(task => !task.completed).length,
  }), [tasks]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                <ListTodo className="h-8 w-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold text-gray-900">Todo Manager</h1>
                <p className="text-sm text-gray-600">Welcome back, {user.email}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
          <p className="text-lg text-gray-600">Organize your tasks and boost your productivity</p>
        </div>

        <TaskForm
          onSubmit={editingTask ? handleUpdateTask : handleAddTask}
          editingTask={editingTask}
          onCancel={() => setEditingTask(null)}
        />

        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          taskCounts={taskCounts}
        />

        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                {tasks.length === 0 ? (
                  <ListTodo className="h-12 w-12 text-gray-400" />
                ) : (
                  <Clock className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
              </h3>
              <p className="text-gray-600">
                {tasks.length === 0 
                  ? 'Create your first task to get started!'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onEdit={setEditingTask}
              />
            ))
          )}
        </div>

        {filteredTasks.length > 0 && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600">
                {taskCounts.completed} of {taskCounts.total} tasks completed
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
