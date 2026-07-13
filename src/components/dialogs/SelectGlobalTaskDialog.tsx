import React, { useState } from 'react'
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
}