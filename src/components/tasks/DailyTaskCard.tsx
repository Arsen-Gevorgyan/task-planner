import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, CheckCircle2, Clock, AlertCircle, Pencil, Trash2 } from 'lucide-react'
import type { DailyTask } from '@/types/models'
import { cn } from '@/lib/utils'
import { differenceInMinutes } from 'date-fns'

interface DailyTaskCardProps {
  task: DailyTask
  onStart: (task: DailyTask) => void
  onComplete: (task: DailyTask) => void
  onEdit: (task: DailyTask) => void
  onDelete: (task: DailyTask) => void
  isRunning: boolean
}

const statusConfig = {
  planned: {
    bg: 'bg-card',
    border: 'border-border',
    text: 'text-foreground',
    icon: Clock,
  },
  running: {
    bg: 'bg-primary/10',
    border: 'border-primary/50',
    text: 'text-primary',
    icon: Play,
  },
  completed: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/50',
    text: 'text-green-500',
    icon: CheckCircle2,
  },
  uncompleted: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/50',
    text: 'text-red-500',
    icon: AlertCircle,
  },
}

export const DailyTaskCard: React.FC<DailyTaskCardProps> = React.memo(({
  task,
  onStart,
  onComplete,
  onEdit,
  onDelete,
  isRunning,
}) => {
  const config = statusConfig[task.status]
  const StatusIcon = config.icon
  
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  const getTaskTime = () => {
    const start = new Date(task.plannedStart)
    const end = new Date(start.getTime() + task.duration * 60000)
    return formatTime(start) + ' - ' + formatTime(end)
  }

  const getProgress = () => {
    if (task.status !== 'running' || !task.actualStart) return 0
    
    const now = new Date()
    const elapsed = differenceInMinutes(now, task.actualStart)
    const total = task.duration
    return Math.min((elapsed / total) * 100, 100)
  }

  return (
    <Card className={cn(
      'p-4 transition-colors group',
      config.bg,
      config.border
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {task.icon && <span className="text-lg">{task.icon}</span>}
            <h3 className={cn('font-medium', config.text)}>{task.title}</h3>
          </div>
          
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <StatusIcon className="h-3 w-3" />
              {getTaskTime()}
            </span>
            <span>{task.duration}min</span>
          </div>

          {task.status === 'running' && (
            <div className="mt-2 w-full bg-secondary rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-1000"
                style={{ width: getProgress() + '%' }}
              />
            </div>
          )}
        </div>

        <div className="flex gap-1 ml-4">
          {task.status === 'planned' && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onStart(task)}
                aria-label="Start task"
                className="text-primary hover:text-primary"
              >
                <Play className="h-4 w-4" />
              </Button>
              <div className="hidden group-hover:flex gap-1">
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
            </>
          )}
          {task.status === 'running' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onComplete(task)}
              aria-label="Complete task"
              className="text-green-500 hover:text-green-500"
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
})

DailyTaskCard.displayName = 'DailyTaskCard'