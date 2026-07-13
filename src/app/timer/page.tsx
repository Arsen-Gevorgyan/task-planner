'use client'

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
}