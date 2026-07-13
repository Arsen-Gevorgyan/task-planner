import React, { useState, useEffect } from 'react'
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
}