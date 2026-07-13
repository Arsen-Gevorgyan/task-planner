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
}