'use client'

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
}