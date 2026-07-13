import type { DailyTask, TaskValidation } from '@/types/models'
import { DatabaseService } from './database.service'
import { addMinutes, isAfter, isBefore, isEqual } from 'date-fns'

export class ValidationService {
  static async validateTaskTime(
    task: Omit<DailyTask, 'id' | 'createdAt'>,
    excludeTaskId?: number
  ): Promise<TaskValidation> {
    if (!task.plannedStart) {
      return { valid: false, message: 'Start time is required' }
    }

    if (!task.duration || task.duration <= 0) {
      return { valid: false, message: 'Duration must be positive' }
    }

    const dailyTasks = await DatabaseService.getDailyTasks(task.plannedStart)
    const otherTasks = dailyTasks.filter(t => t.id !== excludeTaskId)

    const taskEnd = addMinutes(task.plannedStart, task.duration)
    
    for (const other of otherTasks) {
      const otherEnd = addMinutes(other.plannedStart, other.duration)
      
      const overlaps = 
        isBefore(task.plannedStart, otherEnd) && 
        isAfter(taskEnd, other.plannedStart)
      
      if (overlaps) {
        const suggestedTime = await this.findNextAvailableTime(
          task.duration,
          task.plannedStart,
          otherTasks
        )
        
        return {
          valid: false,
          message: `Overlap with task "${other.title}"`,
          suggestedTime
        }
      }
    }

    return { valid: true }
  }

  private static async findNextAvailableTime(
    duration: number,
    fromTime: Date,
    existingTasks: DailyTask[]
  ): Promise<Date> {
    const sortedTasks = [...existingTasks].sort((a, b) => 
      a.plannedStart.getTime() - b.plannedStart.getTime()
    )

    let currentTime = fromTime
    
    for (const task of sortedTasks) {
      const taskEnd = addMinutes(task.plannedStart, task.duration)
      const proposedEnd = addMinutes(currentTime, duration)
      
      if (isAfter(currentTime, taskEnd) || isEqual(currentTime, taskEnd)) {
        continue
      }
      
      if (isBefore(proposedEnd, task.plannedStart) || isEqual(proposedEnd, task.plannedStart)) {
        return currentTime
      }
      
      currentTime = taskEnd
    }
    
    return currentTime
  }

  static formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  static getEarliestAvailableTime(
    date: Date,
    existingTasks: DailyTask[]
  ): Date {
    if (existingTasks.length === 0) {
      const now = new Date()
      return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 
        now.getHours(), now.getMinutes())
    }
    
    const sortedTasks = [...existingTasks].sort((a, b) => 
      a.plannedStart.getTime() - b.plannedStart.getTime()
    )
    
    const lastTask = sortedTasks[sortedTasks.length - 1]
    return addMinutes(lastTask.plannedStart, lastTask.duration)
  }
}