
import React, { useState, useEffect, useMemo } from 'react';
import { Task, FilterOptions } from '@/types/todo';
import { TaskForm } from './TaskForm';
import { TaskItem } from './TaskItem';
import { FilterBar } from './FilterBar';
import { saveTasks, loadTasks } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Clock, ListTodo } from 'lucide-react';

export const TodoApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: '',
    priority: '',
    status: 'all',
  });
  const { toast } = useToast();

  useEffect(() => {
    const loadedTasks = loadTasks();
    setTasks(loadedTasks);
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prev => [newTask, ...prev]);
    toast({
      title: "Task Added",
      description: "Your new task has been created successfully.",
    });
  };

  const updateTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingTask) return;
    
    setTasks(prev => prev.map(task =>
      task.id === editingTask.id
        ? { ...task, ...taskData, updatedAt: new Date() }
        : task
    ));
    setEditingTask(null);
    toast({
      title: "Task Updated",
      description: "Your task has been updated successfully.",
    });
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed, updatedAt: new Date() }
        : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast({
      title: "Task Deleted",
      description: "The task has been removed successfully.",
    });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
              <ListTodo className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Todo Manager</h1>
          </div>
          <p className="text-lg text-gray-600">Organize your tasks and boost your productivity</p>
        </div>

        <TaskForm
          onSubmit={editingTask ? updateTask : addTask}
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
