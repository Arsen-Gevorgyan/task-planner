import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, Clock } from 'lucide-react'
import type { GlobalTask } from '@/types/models'

interface GlobalTaskCardProps {
  task: GlobalTask
  onEdit: (task: GlobalTask) => void
  onDelete: (task: GlobalTask) => void
}

export const GlobalTaskCard: React.FC<GlobalTaskCardProps> = React.memo(({ task, onEdit, onDelete }) => {
  return (
    <Card className="p-4 hover:bg-secondary/50 transition-colors group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {task.icon && (
              <span className="text-lg">{task.icon}</span>
            )}
            <h3 className="font-medium truncate">{task.title}</h3>
          </div>
          
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            {task.duration > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {task.duration}min
              </span>
            )}
            {task.reminder && task.reminder > 0 && (
              <span>Reminder: {task.reminder}min before</span>
            )}
          </div>
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task)}
            aria-label="Edit task"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task)}
            aria-label="Delete task"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
})

GlobalTaskCard.displayName = 'GlobalTaskCard'