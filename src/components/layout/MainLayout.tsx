'use client'

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
}