export type TaskStatus = 'planned' | 'running' | 'completed' | 'uncompleted'

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
}