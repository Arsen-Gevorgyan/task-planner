const fs = require('fs');
const path = require('path');

const files = {
  'src/components/dialogs/ConfirmDialog.tsx': `import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'default' | 'destructive'
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onConfirm()
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button 
            variant={variant === 'destructive' ? 'destructive' : 'default'} 
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}`,

  'src/components/dialogs/GlobalTaskDialog.tsx': `import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { GlobalTask } from '@/types/models'

interface GlobalTaskDialogProps {
  open: boolean
  onClose: () => void
  onSave: (task: Partial<GlobalTask>) => void
  task?: GlobalTask | null
}

export const GlobalTaskDialog: React.FC<GlobalTaskDialogProps> = ({
  open,
  onClose,
  onSave,
  task,
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState(30)
  const [reminder, setReminder] = useState<number | undefined>(undefined)
  const [icon, setIcon] = useState('')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setDuration(task.duration)
      setReminder(task.reminder)
      setIcon(task.icon || '')
    } else {
      setTitle('')
      setDescription('')
      setDuration(30)
      setReminder(undefined)
      setIcon('')
    }
  }, [task, open])

  const handleSave = () => {
    if (!title.trim()) return

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      duration,
      reminder,
      icon: icon || undefined,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent onKeyDown={handleKeyDown} className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {task ? 'Edit Task Template' : 'New Task Template'}
          </DialogTitle>
          <DialogDescription>
            {task 
              ? "Modify the task template. This won't affect existing scheduled tasks." 
              : 'Create a reusable task template for your daily planner.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              autoFocus
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min={1}
                max={480}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reminder">Reminder (minutes before)</Label>
              <Input
                id="reminder"
                type="number"
                value={reminder || ''}
                onChange={(e) => setReminder(e.target.value ? Number(e.target.value) : undefined)}
                min={1}
                max={60}
                placeholder="No reminder"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="icon">Icon (emoji)</Label>
            <Input
              id="icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="Optional emoji"
              maxLength={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            {task ? 'Save Changes' : 'Create Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}`,

  'src/components/dialogs/SelectGlobalTaskDialog.tsx': `import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import type { GlobalTask } from '@/types/models'
import { Button } from '@/components/ui/button'

interface SelectGlobalTaskDialogProps {
  open: boolean
  onClose: () => void
  onSelect: (task: GlobalTask) => void
  tasks: GlobalTask[]
}

export const SelectGlobalTaskDialog: React.FC<SelectGlobalTaskDialogProps> = ({
  open,
  onClose,
  onSelect,
  tasks,
}) => {
  const [search, setSearch] = useState('')

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent onKeyDown={handleKeyDown} className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select Task Template</DialogTitle>
          <DialogDescription>
            Choose a global task to add to today's planner
          </DialogDescription>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            autoFocus
          />
        </div>

        <div className="max-h-60 overflow-y-auto space-y-2">
          {filteredTasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              {search ? 'No tasks found' : 'No global tasks available'}
            </p>
          ) : (
            filteredTasks.map(task => (
              <Button
                key={task.id}
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => onSelect(task)}
              >
                <div className="flex items-center gap-2">
                  {task.icon && <span>{task.icon}</span>}
                  <div>
                    <div className="font-medium">{task.title}</div>
                    {task.description && (
                      <div className="text-xs text-muted-foreground">{task.description}</div>
                    )}
                  </div>
                </div>
                <span className="ml-auto text-xs text-muted-foreground">
                  {task.duration}min
                </span>
              </Button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}`,

  'src/components/dialogs/EditDailyTaskDialog.tsx': `import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { DailyTask } from '@/types/models'
import { format } from 'date-fns'

interface EditDailyTaskDialogProps {
  open: boolean
  onClose: () => void
  onSave: (task: Partial<DailyTask>) => void
  task: DailyTask
}

export const EditDailyTaskDialog: React.FC<EditDailyTaskDialogProps> = ({
  open,
  onClose,
  onSave,
  task,
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState(30)
  const [startTime, setStartTime] = useState('')
  const [icon, setIcon] = useState('')

  useEffect(() => {
    if (task && open) {
      setTitle(task.title)
      setDescription(task.description || '')
      setDuration(task.duration)
      setStartTime(format(new Date(task.plannedStart), 'HH:mm'))
      setIcon(task.icon || '')
    }
  }, [task, open])

  const handleSave = () => {
    if (!title.trim() || !startTime) return

    const [hours, minutes] = startTime.split(':')
    const plannedStart = new Date(task.plannedStart)
    plannedStart.setHours(Number(hours), Number(minutes), 0, 0)

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      duration,
      plannedStart,
      icon: icon || undefined,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent onKeyDown={handleKeyDown} className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Modify this task instance. Changes won't affect the global template.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              autoFocus
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min={1}
                max={480}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="icon">Icon (emoji)</Label>
            <Input
              id="icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="Optional emoji"
              maxLength={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim() || !startTime}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
  console.log(`✓ Created: ${filePath}`);
});

console.log('\n✅ Dialog components created successfully!');