import Dexie, { type Table } from 'dexie'
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

export const db = new TaskPlannerDB()