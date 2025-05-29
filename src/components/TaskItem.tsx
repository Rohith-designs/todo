
import React, { useState } from 'react';
import { Task } from '@/types/todo';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Trash2, Calendar, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const priorityColors = {
  high: 'bg-red-500/10 text-red-700 border-red-200',
  medium: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
  low: 'bg-green-500/10 text-green-700 border-green-200',
};

const categoryColors = {
  personal: 'bg-blue-500/10 text-blue-700',
  work: 'bg-purple-500/10 text-purple-700',
  shopping: 'bg-pink-500/10 text-pink-700',
  health: 'bg-emerald-500/10 text-emerald-700',
  other: 'bg-gray-500/10 text-gray-700',
};

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={cn(
        "p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer",
        task.completed && "opacity-60"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={cn(
              "font-medium text-gray-900 transition-all duration-200",
              task.completed && "line-through text-gray-500"
            )}>
              {task.title}
            </h3>
            
            <div className={cn(
              "flex gap-1 opacity-0 transition-opacity duration-200",
              isHovered && "opacity-100"
            )}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(task)}
                className="h-8 w-8 p-0 hover:bg-blue-100"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.id)}
                className="h-8 w-8 p-0 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {task.description && (
            <p className={cn(
              "text-sm text-gray-600 mt-1",
              task.completed && "line-through text-gray-400"
            )}>
              {task.description}
            </p>
          )}
          
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="outline" className={priorityColors[task.priority]}>
              <Flag className="h-3 w-3 mr-1" />
              {task.priority}
            </Badge>
            
            <Badge variant="outline" className={categoryColors[task.category]}>
              {task.category}
            </Badge>
            
            <div className="flex items-center text-xs text-gray-500 ml-auto">
              <Calendar className="h-3 w-3 mr-1" />
              {task.createdAt.toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
