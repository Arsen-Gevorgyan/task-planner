'use client'

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
}