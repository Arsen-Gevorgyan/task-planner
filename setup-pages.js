const fs = require('fs');
const path = require('path');

const files = {
  // Task Components
  'src/components/tasks/GlobalTaskCard.tsx': `import React from 'react'
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

GlobalTaskCard.displayName = 'GlobalTaskCard'`,

  'src/components/tasks/DailyTaskCard.tsx': `import React from 'react'
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

DailyTaskCard.displayName = 'DailyTaskCard'`,

  // Timer Component
  'src/components/timer/TimerDisplay.tsx': `import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Square } from 'lucide-react'
import type { DailyTask } from '@/types/models'
import { differenceInSeconds } from 'date-fns'

interface TimerDisplayProps {
  task: DailyTask
  onComplete: () => void
  onStop: () => void
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  task,
  onComplete,
  onStop,
}) => {
  const [elapsed, setElapsed] = useState(0)
  const [remaining, setRemaining] = useState(task.duration * 60)
  
  useEffect(() => {
    if (!task.actualStart) return

    const interval = setInterval(() => {
      const now = new Date()
      const start = new Date(task.actualStart!)
      const elapsedSeconds = differenceInSeconds(now, start)
      const remainingSeconds = Math.max(task.duration * 60 - elapsedSeconds, 0)
      
      setElapsed(elapsedSeconds)
      setRemaining(remainingSeconds)

      if (remainingSeconds <= 0) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [task])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return hours + ':' + String(minutes).padStart(2, '0') + ':' + String(secs).padStart(2, '0')
    }
    return String(minutes).padStart(2, '0') + ':' + String(secs).padStart(2, '0')
  }

  const progress = task.duration > 0 
    ? ((task.duration * 60 - remaining) / (task.duration * 60)) * 100 
    : 0

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <Card className="p-8 w-full max-w-lg text-center">
        <div className="mb-8">
          {task.icon && <span className="text-4xl mb-4 block">{task.icon}</span>}
          <h1 className="text-2xl font-bold mb-2">{task.title}</h1>
          {task.description && (
            <p className="text-muted-foreground">{task.description}</p>
          )}
        </div>

        <div className="relative mb-8">
          <svg className="w-48 h-48 mx-auto transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              className="stroke-current text-secondary"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              className="stroke-current text-primary"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 88}
              strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-mono font-bold">
                {formatTime(remaining)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">remaining</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-secondary rounded-lg">
            <div className="text-lg font-mono font-bold">{formatTime(elapsed)}</div>
            <div className="text-xs text-muted-foreground">Elapsed</div>
          </div>
          <div className="text-center p-3 bg-secondary rounded-lg">
            <div className="text-lg font-mono font-bold">{formatTime(remaining)}</div>
            <div className="text-xs text-muted-foreground">Remaining</div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={onComplete}
            size="lg"
            className="bg-green-500 hover:bg-green-600"
          >
            Finish
          </Button>
          <Button
            onClick={onStop}
            variant="outline"
            size="lg"
          >
            <Square className="h-5 w-5 mr-2" />
            Stop
          </Button>
        </div>
      </Card>
    </div>
  )
}`,

  // Layout Components
  'src/components/layout/Navigation.tsx': `'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ListTodo, Calendar, Timer } from 'lucide-react'

const navItems = [
  {
    href: '/',
    label: 'Global Tasks',
    icon: ListTodo,
  },
  {
    href: '/planner',
    label: "Today's Planner",
    icon: Calendar,
  },
  {
    href: '/timer',
    label: 'Timer',
    icon: Timer,
  },
]

export const Navigation: React.FC = () => {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border">
      <div className="container mx-auto max-w-4xl">
        <div className="flex h-14 items-center space-x-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}`,

  'src/components/layout/MainLayout.tsx': `'use client'

import React, { useEffect } from 'react'
import { Navigation } from './Navigation'
import { SchedulerService } from '@/services/scheduler.service'
import { NotificationService } from '@/services/notification.service'
import { DatabaseService } from '@/services/database.service'
import { useUIStore } from '@/stores/ui.store'
import { useTaskStore } from '@/stores/task.store'
import { DialogType } from '@/types/enums'
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog'

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeDialog, setActiveDialog, closeDialog } = useUIStore()

  useEffect(() => {
    NotificationService.requestPermission()
    SchedulerService.startMonitoring()
    DatabaseService.cleanupOldHistory()
    checkYesterdayTasks()
    
    return () => {
      SchedulerService.stopMonitoring()
    }
  }, [])

  const checkYesterdayTasks = async () => {
    const hasUnfinished = await useTaskStore.getState().checkYesterdayTasks()
    
    if (hasUnfinished) {
      setActiveDialog(DialogType.UNFINISHED_TASKS, {
        title: 'Unfinished Tasks',
        message: 'You had unfinished tasks yesterday.',
        onConfirm: () => closeDialog(),
        onCancel: () => closeDialog(),
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="min-h-[calc(100vh-3.5rem)]">
        {children}
      </main>
      
      {activeDialog === DialogType.UNFINISHED_TASKS && (
        <ConfirmDialog
          open={true}
          title="Unfinished Tasks"
          message="You had unfinished tasks yesterday."
          confirmLabel="I Know"
          onConfirm={() => closeDialog()}
          onCancel={() => closeDialog()}
        />
      )}
    </div>
  )
}`,

  // App Pages
  'src/app/layout.tsx': `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { MainLayout } from '@/components/layout/MainLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Task Planner',
  description: 'Personal task planner application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  )
}`,

  'src/app/page.tsx': `'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useTaskStore } from '@/stores/task.store'
import { useUIStore } from '@/stores/ui.store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import { GlobalTaskCard } from '@/components/tasks/GlobalTaskCard'
import { GlobalTaskDialog } from '@/components/dialogs/GlobalTaskDialog'
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog'
import type { GlobalTask } from '@/types/models'
import { DialogType } from '@/types/enums'

export default function GlobalTasksPage() {
  const { 
    globalTasks, 
    loading, 
    loadGlobalTasks, 
    createGlobalTask,
    updateGlobalTask,
    deleteGlobalTask 
  } = useTaskStore()
  
  const { 
    activeDialog, 
    dialogData, 
    setActiveDialog, 
    closeDialog,
    searchQuery,
    setSearchQuery 
  } = useUIStore()

  const [selectedTask, setSelectedTask] = useState<GlobalTask | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    loadGlobalTasks()
  }, [loadGlobalTasks])

  const handleCreateTask = useCallback(() => {
    setSelectedTask(null)
    setIsEditDialogOpen(true)
  }, [])

  const handleEditTask = useCallback((task: GlobalTask) => {
    setSelectedTask(task)
    setIsEditDialogOpen(true)
  }, [])

  const handleDeleteTask = useCallback((task: GlobalTask) => {
    setActiveDialog(DialogType.CONFIRM_DELETE_GLOBAL, {
      title: 'Delete Task',
      message: 'This task is used in your planner. Deleting it will also remove every scheduled instance. Continue?',
      taskId: task.id,
      onConfirm: async () => {
        await deleteGlobalTask(task.id!)
        closeDialog()
      },
      onCancel: () => closeDialog(),
    })
  }, [deleteGlobalTask, setActiveDialog, closeDialog])

  const handleSaveTask = useCallback(async (taskData: Partial<GlobalTask>) => {
    if (selectedTask) {
      await updateGlobalTask(selectedTask.id!, taskData)
    } else {
      await createGlobalTask(taskData as Omit<GlobalTask, 'id' | 'createdAt' | 'updatedAt'>)
    }
    setIsEditDialogOpen(false)
    setSelectedTask(null)
  }, [selectedTask, updateGlobalTask, createGlobalTask])

  const filteredTasks = globalTasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        handleCreateTask()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleCreateTask])

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Global Tasks</h1>
          <p className="text-muted-foreground mt-2">Manage your reusable task templates</p>
        </div>
        <Button onClick={handleCreateTask} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          New Task
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            {searchQuery ? 'No tasks match your search' : 'No global tasks yet'}
          </p>
          {!searchQuery && (
            <Button onClick={handleCreateTask} variant="outline" className="mt-4">
              Create your first task
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <GlobalTaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      <GlobalTaskDialog
        open={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false)
          setSelectedTask(null)
        }}
        onSave={handleSaveTask}
        task={selectedTask}
      />

      {activeDialog === DialogType.CONFIRM_DELETE_GLOBAL && dialogData && (
        <ConfirmDialog
          open={true}
          title={dialogData.title}
          message={dialogData.message}
          onConfirm={dialogData.onConfirm || (() => {})}
          onCancel={dialogData.onCancel || (() => {})}
          variant="destructive"
        />
      )}
    </div>
  )
}`,

  'src/app/planner/page.tsx': `'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useTaskStore } from '@/stores/task.store'
import { useUIStore } from '@/stores/ui.store'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { DailyTaskCard } from '@/components/tasks/DailyTaskCard'
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog'
import { SelectGlobalTaskDialog } from '@/components/dialogs/SelectGlobalTaskDialog'
import { EditDailyTaskDialog } from '@/components/dialogs/EditDailyTaskDialog'
import { ValidationService } from '@/services/validation.service'
import type { DailyTask, GlobalTask } from '@/types/models'
import { DialogType } from '@/types/enums'
import { format } from 'date-fns'

export default function PlannerPage() {
  const { 
    globalTasks,
    dailyTasks, 
    loading, 
    loadGlobalTasks,
    loadDailyTasks, 
    createDailyTask,
    updateDailyTask,
    deleteDailyTask,
    startTask,
    completeTask,
  } = useTaskStore()
  
  const { 
    activeDialog, 
    dialogData, 
    setActiveDialog, 
    closeDialog,
  } = useUIStore()

  const [showGlobalTaskSelect, setShowGlobalTaskSelect] = useState(false)
  const [editingTask, setEditingTask] = useState<DailyTask | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  useEffect(() => {
    loadGlobalTasks()
    loadDailyTasks()
  }, [loadGlobalTasks, loadDailyTasks])

  const handleAddTask = () => {
    setShowGlobalTaskSelect(true)
  }

  const handleSelectGlobalTask = async (globalTask: GlobalTask) => {
    const existingTasks = dailyTasks.filter(t => t.status !== 'completed' && t.status !== 'uncompleted')
    const earliestTime = ValidationService.getEarliestAvailableTime(new Date(), existingTasks)
    
    await createDailyTask({
      globalTaskId: globalTask.id,
      title: globalTask.title,
      description: globalTask.description,
      duration: globalTask.duration,
      reminder: globalTask.reminder,
      color: globalTask.color,
      icon: globalTask.icon,
      plannedStart: earliestTime,
      status: 'planned',
    })
    
    setShowGlobalTaskSelect(false)
  }

  const handleStartTask = useCallback(async (task: DailyTask) => {
    const now = new Date()
    const taskStart = new Date(task.plannedStart)
    
    if (now < taskStart) {
      setActiveDialog(DialogType.EARLY_START, {
        title: 'Early Start',
        message: 'This task is scheduled for ' + format(taskStart, 'HH:mm') + '. Start now?',
        onConfirm: async () => {
          await startTask(task)
          closeDialog()
        },
        onCancel: () => closeDialog(),
      })
      return
    }
    
    await startTask(task)
  }, [startTask, setActiveDialog, closeDialog])

  const handleCompleteTask = useCallback(async (task: DailyTask) => {
    await completeTask(task)
  }, [completeTask])

  const handleEditTask = useCallback((task: DailyTask) => {
    setEditingTask(task)
    setShowEditDialog(true)
  }, [])

  const handleSaveEdit = useCallback(async (taskData: Partial<DailyTask>) => {
    if (!editingTask) return
    
    const validation = await ValidationService.validateTaskTime(
      { ...editingTask, ...taskData } as DailyTask,
      editingTask.id
    )
    
    if (!validation.valid) {
      setActiveDialog(DialogType.OVERLAP_WARNING, {
        title: 'Schedule Conflict',
        message: validation.message || 'Invalid time',
        onConfirm: () => closeDialog(),
        onCancel: () => closeDialog(),
      })
      return
    }
    
    await updateDailyTask(editingTask.id!, taskData)
    setShowEditDialog(false)
    setEditingTask(null)
  }, [editingTask, updateDailyTask, setActiveDialog, closeDialog])

  const handleDeleteTask = useCallback(async (task: DailyTask) => {
    await deleteDailyTask(task.id!)
  }, [deleteDailyTask])

  const sortedTasks = [...dailyTasks].sort((a, b) => 
    new Date(a.plannedStart).getTime() - new Date(b.plannedStart).getTime()
  )

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Today's Planner</h1>
          <p className="text-muted-foreground mt-2">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <Button onClick={handleAddTask} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Add Task
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading tasks...</p>
        </div>
      ) : sortedTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            No tasks planned for today
          </p>
          <Button onClick={handleAddTask} variant="outline" className="mt-4">
            Plan your first task
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTasks.map(task => (
            <DailyTaskCard
              key={task.id}
              task={task}
              onStart={handleStartTask}
              onComplete={handleCompleteTask}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              isRunning={task.status === 'running'}
            />
          ))}
        </div>
      )}

      <SelectGlobalTaskDialog
        open={showGlobalTaskSelect}
        onClose={() => setShowGlobalTaskSelect(false)}
        onSelect={handleSelectGlobalTask}
        tasks={globalTasks}
      />

      {editingTask && (
        <EditDailyTaskDialog
          open={showEditDialog}
          onClose={() => {
            setShowEditDialog(false)
            setEditingTask(null)
          }}
          onSave={handleSaveEdit}
          task={editingTask}
        />
      )}

      {activeDialog === DialogType.EARLY_START && dialogData && (
        <ConfirmDialog
          open={true}
          title={dialogData.title}
          message={dialogData.message}
          onConfirm={dialogData.onConfirm || (() => {})}
          onCancel={dialogData.onCancel || (() => {})}
        />
      )}

      {activeDialog === DialogType.OVERLAP_WARNING && dialogData && (
        <ConfirmDialog
          open={true}
          title={dialogData.title}
          message={dialogData.message}
          confirmLabel="OK"
          onConfirm={dialogData.onConfirm || (() => {})}
          onCancel={dialogData.onCancel || (() => {})}
        />
      )}
    </div>
  )
}`,

  'src/app/timer/page.tsx': `'use client'

import React, { useEffect } from 'react'
import { useTaskStore } from '@/stores/task.store'
import { TimerDisplay } from '@/components/timer/TimerDisplay'
import { Timer as TimerIcon } from 'lucide-react'

export default function TimerPage() {
  const { runningTask, completeTask, setRunningTask, loadDailyTasks } = useTaskStore()

  useEffect(() => {
    loadDailyTasks()
  }, [loadDailyTasks])

  const handleComplete = async () => {
    if (runningTask) {
      await completeTask(runningTask)
    }
  }

  const handleStop = () => {
    setRunningTask(null)
  }

  if (!runningTask) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <TimerIcon className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Active Timer</h2>
          <p className="text-muted-foreground">
            Start a task from the planner to see the timer
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <TimerDisplay
        task={runningTask}
        onComplete={handleComplete}
        onStop={handleStop}
      />
    </div>
  )
}`,
};

// Create all files
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  const dir = path.dirname(fullPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('✓ Created: ' + filePath);
});

console.log('\n✅ ALL FILES CREATED SUCCESSFULLY!');
console.log('\n🚀 Ready to start! Run: npm run dev');
console.log('Then open: http://localhost:3000');