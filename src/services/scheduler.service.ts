import { DatabaseService } from './database.service'
import { NotificationService } from './notification.service'
import { addMinutes, isAfter, isBefore } from 'date-fns'
import type { DailyTask } from '@/types/models'

export class SchedulerService {
  private static checkInterval: NodeJS.Timeout | null = null

  static startMonitoring(): void {
    this.checkInterval = setInterval(() => this.checkTasks(), 30000)
    this.checkTasks()
  }

  static stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }
  }

  private static async checkTasks(): Promise<void> {
    const now = new Date()
    const dailyTasks = await DatabaseService.getDailyTasks()
    
    for (const task of dailyTasks) {
      if (task.status === 'completed' || task.status === 'uncompleted') continue
      
      if (task.status === 'running') {
        await this.checkRunningTask(task, now)
        continue
      }
      
      await this.checkPlannedTask(task, now)
    }
  }

  private static async checkPlannedTask(task: DailyTask, now: Date): Promise<void> {
    const taskStart = new Date(task.plannedStart)
    const taskEnd = addMinutes(taskStart, task.duration)
    
    if (task.reminder && task.reminder > 0) {
      const reminderTime = new Date(taskStart.getTime() - task.reminder * 60000)
      if (isAfter(now, reminderTime) && isBefore(now, taskStart)) {
        await NotificationService.notifyTaskShouldStart(task.title)
      }
    }
    
    if (isAfter(now, taskEnd)) {
      await DatabaseService.updateDailyTask(task.id!, {
        status: 'uncompleted'
      })
      await NotificationService.notifyTaskOverdue(task.title)
    }
  }

  private static async checkRunningTask(task: DailyTask, now: Date): Promise<void> {
    if (!task.actualStart) return
    
    const actualEnd = addMinutes(task.actualStart, task.duration)
    
    if (isAfter(now, actualEnd)) {
      await NotificationService.notifyTaskDurationEnded(task.title)
    }
  }
}