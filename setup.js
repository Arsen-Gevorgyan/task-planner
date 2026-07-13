const fs = require('fs');
const path = require('path');

const files = {
  'src/lib/utils.ts': `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`,

  'src/types/models.ts': `export type TaskStatus = 'planned' | 'running' | 'completed' | 'uncompleted'

export interface GlobalTask {
  id?: number
  title: string
  description?: string
  duration: number
  reminder?: number
  color?: string
  icon?: string
  createdAt: Date
  updatedAt: Date
}

export interface DailyTask {
  id?: number
  globalTaskId?: number
  title: string
  description?: string
  duration: number
  reminder?: number
  color?: string
  icon?: string
  plannedStart: Date
  actualStart?: Date
  actualFinish?: Date
  status: TaskStatus
  createdAt: Date
}

export interface TaskValidation {
  valid: boolean
  message?: string
  suggestedTime?: Date
}`,

  'src/types/enums.ts': `export enum DialogType {
  CONFIRM_DELETE_GLOBAL = 'confirm_delete_global',
  OVERLAP_WARNING = 'overlap_warning',
  EARLY_START = 'early_start',
  NO_TIME_AVAILABLE = 'no_time_available',
  UNFINISHED_TASKS = 'unfinished_tasks',
  TASK_EDIT = 'task_edit',
  GLOBAL_TASK_EDIT = 'global_task_edit',
}`,

  'src/db/database.ts': `import Dexie, { type Table } from 'dexie'
import type { GlobalTask, DailyTask } from '@/types/models'

export class TaskPlannerDB extends Dexie {
  globalTasks!: Table<GlobalTask, number>
  dailyTasks!: Table<DailyTask, number>

  constructor() {
    super('taskPlannerDB')
    
    this.version(1).stores({
      globalTasks: '++id, title, createdAt',
      dailyTasks: '++id, globalTaskId, plannedStart, status, createdAt'
    })
  }
}

export const db = new TaskPlannerDB()`,

  'src/services/database.service.ts': `import { db } from '@/db/database'
import type { GlobalTask, DailyTask } from '@/types/models'
import { startOfDay, endOfDay, subDays } from 'date-fns'

export class DatabaseService {
  static async getAllGlobalTasks(): Promise<GlobalTask[]> {
    return await db.globalTasks.orderBy('title').toArray()
  }

  static async getGlobalTask(id: number): Promise<GlobalTask | undefined> {
    return await db.globalTasks.get(id)
  }

  static async createGlobalTask(task: Omit<GlobalTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const now = new Date()
    return await db.globalTasks.add({
      ...task,
      createdAt: now,
      updatedAt: now,
    })
  }

  static async updateGlobalTask(id: number, task: Partial<GlobalTask>): Promise<void> {
    await db.globalTasks.update(id, {
      ...task,
      updatedAt: new Date()
    })
  }

  static async deleteGlobalTask(id: number): Promise<void> {
    const dailyTasks = await db.dailyTasks
      .where('globalTaskId')
      .equals(id)
      .toArray()
    
    if (dailyTasks.length > 0) {
      await db.dailyTasks.bulkDelete(dailyTasks.map(t => t.id!))
    }
    
    await db.globalTasks.delete(id)
  }

  static async searchGlobalTasks(query: string): Promise<GlobalTask[]> {
    return await db.globalTasks
      .filter(task => 
        task.title.toLowerCase().includes(query.toLowerCase()) ||
        task.description?.toLowerCase().includes(query.toLowerCase())
      )
      .toArray()
  }

  static async getDailyTasks(date: Date = new Date()): Promise<DailyTask[]> {
    const dayStart = startOfDay(date)
    const dayEnd = endOfDay(date)
    
    return await db.dailyTasks
      .where('plannedStart')
      .between(dayStart, dayEnd, true, true)
      .sortBy('plannedStart')
  }

  static async createDailyTask(task: Omit<DailyTask, 'id' | 'createdAt'>): Promise<number> {
    return await db.dailyTasks.add({
      ...task,
      createdAt: new Date()
    })
  }

  static async updateDailyTask(id: number, task: Partial<DailyTask>): Promise<void> {
    await db.dailyTasks.update(id, task)
  }

  static async deleteDailyTask(id: number): Promise<void> {
    await db.dailyTasks.delete(id)
  }

  static async getRunningTask(): Promise<DailyTask | undefined> {
    return await db.dailyTasks
      .where('status')
      .equals('running')
      .first()
  }

  static async cleanupOldHistory(): Promise<void> {
    const twoDaysAgo = endOfDay(subDays(new Date(), 2))
    
    const oldTasks = await db.dailyTasks
      .where('plannedStart')
      .below(twoDaysAgo)
      .toArray()
    
    if (oldTasks.length > 0) {
      await db.dailyTasks.bulkDelete(oldTasks.map(t => t.id!))
    }
  }

  static async getYesterdayUnfinishedTasks(): Promise<DailyTask[]> {
    const yesterday = subDays(new Date(), 1)
    const dayStart = startOfDay(yesterday)
    const dayEnd = endOfDay(yesterday)
    
    return await db.dailyTasks
      .where('plannedStart')
      .between(dayStart, dayEnd, true, true)
      .filter(task => task.status === 'planned' || task.status === 'running')
      .toArray()
  }
}`,

  'src/services/validation.service.ts': `import type { DailyTask, TaskValidation } from '@/types/models'
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
          message: \`Overlap with task "\${other.title}"\`,
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
}`,
};

// Create files
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  const dir = path.dirname(fullPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Created: ${filePath}`);
});

console.log('\n✓ Base files created successfully!');
console.log('Next: Run the remaining setup commands...');