import { db } from '@/db/database'
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
      .filter(task => {
        const titleMatch = task.title.toLowerCase().includes(query.toLowerCase());
        const descMatch = task.description ? task.description.toLowerCase().includes(query.toLowerCase()) : false;
        return titleMatch || descMatch;
      })
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
}