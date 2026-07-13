import { create } from 'zustand'
import { DatabaseService } from '@/services/database.service'
import type { GlobalTask, DailyTask } from '@/types/models'

interface TaskState {
  globalTasks: GlobalTask[]
  dailyTasks: DailyTask[]
  runningTask: DailyTask | null
  loading: boolean
  error: string | null
  
  loadGlobalTasks: () => Promise<void>
  loadDailyTasks: (date?: Date) => Promise<void>
  createGlobalTask: (task: Omit<GlobalTask, 'id' | 'createdAt' | 'updatedAt'>) => Promise<number>
  updateGlobalTask: (id: number, task: Partial<GlobalTask>) => Promise<void>
  deleteGlobalTask: (id: number) => Promise<void>
  createDailyTask: (task: Omit<DailyTask, 'id' | 'createdAt'>) => Promise<number>
  updateDailyTask: (id: number, task: Partial<DailyTask>) => Promise<void>
  deleteDailyTask: (id: number) => Promise<void>
  setRunningTask: (task: DailyTask | null) => void
  startTask: (task: DailyTask) => Promise<void>
  completeTask: (task: DailyTask) => Promise<void>
  checkYesterdayTasks: () => Promise<boolean>
}

export const useTaskStore = create<TaskState>((set, get) => ({
  globalTasks: [],
  dailyTasks: [],
  runningTask: null,
  loading: false,
  error: null,

  loadGlobalTasks: async () => {
    set({ loading: true })
    try {
      const tasks = await DatabaseService.getAllGlobalTasks()
      set({ globalTasks: tasks, loading: false })
    } catch (error) {
      set({ error: 'Failed to load global tasks', loading: false })
    }
  },

  loadDailyTasks: async (date?: Date) => {
    set({ loading: true })
    try {
      const tasks = await DatabaseService.getDailyTasks(date)
      set({ dailyTasks: tasks, loading: false })
      
      const running = tasks.find(t => t.status === 'running')
      if (running) {
        set({ runningTask: running })
      }
    } catch (error) {
      set({ error: 'Failed to load daily tasks', loading: false })
    }
  },

  createGlobalTask: async (task) => {
    try {
      const id = await DatabaseService.createGlobalTask(task)
      await get().loadGlobalTasks()
      return id
    } catch (error) {
      set({ error: 'Failed to create global task' })
      throw error
    }
  },

  updateGlobalTask: async (id, task) => {
    try {
      await DatabaseService.updateGlobalTask(id, task)
      await get().loadGlobalTasks()
    } catch (error) {
      set({ error: 'Failed to update global task' })
    }
  },

  deleteGlobalTask: async (id) => {
    try {
      await DatabaseService.deleteGlobalTask(id)
      await get().loadGlobalTasks()
    } catch (error) {
      set({ error: 'Failed to delete global task' })
    }
  },

  createDailyTask: async (task) => {
    try {
      const id = await DatabaseService.createDailyTask(task)
      await get().loadDailyTasks()
      return id
    } catch (error) {
      set({ error: 'Failed to create daily task' })
      throw error
    }
  },

  updateDailyTask: async (id, task) => {
    try {
      await DatabaseService.updateDailyTask(id, task)
      await get().loadDailyTasks()
    } catch (error) {
      set({ error: 'Failed to update daily task' })
    }
  },

  deleteDailyTask: async (id) => {
    try {
      await DatabaseService.deleteDailyTask(id)
      await get().loadDailyTasks()
    } catch (error) {
      set({ error: 'Failed to delete daily task' })
    }
  },

  setRunningTask: (task) => {
    set({ runningTask: task })
  },

  startTask: async (task) => {
    try {
      const now = new Date()
      await DatabaseService.updateDailyTask(task.id!, {
        status: 'running',
        actualStart: now,
      })
      
      const { runningTask } = get()
      if (runningTask && runningTask.id !== task.id) {
        await DatabaseService.updateDailyTask(runningTask.id!, {
          status: 'uncompleted'
        })
      }
      
      set({ runningTask: { ...task, status: 'running', actualStart: now } })
      await get().loadDailyTasks()
    } catch (error) {
      set({ error: 'Failed to start task' })
    }
  },

  completeTask: async (task) => {
    try {
      await DatabaseService.updateDailyTask(task.id!, {
        status: 'completed',
        actualFinish: new Date(),
      })
      
      set({ runningTask: null })
      await get().loadDailyTasks()
    } catch (error) {
      set({ error: 'Failed to complete task' })
    }
  },

  checkYesterdayTasks: async () => {
    try {
      const unfinishedTasks = await DatabaseService.getYesterdayUnfinishedTasks()
      return unfinishedTasks.length > 0
    } catch (error) {
      return false
    }
  },
}))