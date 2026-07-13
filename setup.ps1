# ============================================
# Task Planner - Complete Setup Script
# Run this script from the project root
# ============================================

Write-Host "🚀 Starting Task Planner Setup..." -ForegroundColor Cyan

# Step 1: Create directory structure
Write-Host "📁 Creating directory structure..." -ForegroundColor Yellow
$directories = @(
    "src\lib",
    "src\types",
    "src\db",
    "src\services",
    "src\stores",
    "src\components\ui",
    "src\components\dialogs",
    "src\components\tasks",
    "src\components\timer",
    "src\components\layout",
    "src\hooks",
    "src\app\planner",
    "src\app\timer"
)

foreach ($dir in $directories) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}
Write-Host "✓ Directory structure created" -ForegroundColor Green

# Step 2: Update tailwind.config.ts
Write-Host "⚙️ Creating tailwind.config.ts..." -ForegroundColor Yellow
@'
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}

export default config
'@ | Set-Content -Path "tailwind.config.ts" -Encoding UTF8
Write-Host "✓ tailwind.config.ts created" -ForegroundColor Green

# Step 3: Update globals.css
Write-Host "🎨 Creating globals.css..." -ForegroundColor Yellow
@'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 5.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 5.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
    --radius: 0.5rem;
  }

  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
  }
}
'@ | Set-Content -Path "src\app\globals.css" -Encoding UTF8
Write-Host "✓ globals.css created" -ForegroundColor Green

# Step 4: Create lib/utils.ts
Write-Host "🔧 Creating utility files..." -ForegroundColor Yellow
@'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
'@ | Set-Content -Path "src\lib\utils.ts" -Encoding UTF8

# Step 5: Create types/models.ts
@'
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
'@ | Set-Content -Path "src\types\models.ts" -Encoding UTF8

# Step 6: Create types/enums.ts
@'
export enum DialogType {
  CONFIRM_DELETE_GLOBAL = 'confirm_delete_global',
  OVERLAP_WARNING = 'overlap_warning',
  EARLY_START = 'early_start',
  NO_TIME_AVAILABLE = 'no_time_available',
  UNFINISHED_TASKS = 'unfinished_tasks',
  TASK_EDIT = 'task_edit',
  GLOBAL_TASK_EDIT = 'global_task_edit',
}
'@ | Set-Content -Path "src\types\enums.ts" -Encoding UTF8
Write-Host "✓ Type definitions created" -ForegroundColor Green

# Step 7: Create database
Write-Host "🗄️ Creating database layer..." -ForegroundColor Yellow
@'
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
'@ | Set-Content -Path "src\db\database.ts" -Encoding UTF8
Write-Host "✓ Database created" -ForegroundColor Green

# Step 8: Create services
Write-Host "🔨 Creating services..." -ForegroundColor Yellow

# database.service.ts
@'
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
}
'@ | Set-Content -Path "src\services\database.service.ts" -Encoding UTF8

# validation.service.ts
@'
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
'@ | Set-Content -Path "src\services\validation.service.ts" -Encoding UTF8

# notification.service.ts
@'
export class NotificationService {
  private static permission: NotificationPermission = 'default'

  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false
    }

    this.permission = await Notification.requestPermission()
    return this.permission === 'granted'
  }

  static async sendNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (!('Notification' in window)) return
    
    if (this.permission !== 'granted') {
      const granted = await this.requestPermission()
      if (!granted) return
    }

    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    })
  }

  static async notifyTaskShouldStart(taskTitle: string): Promise<void> {
    await this.sendNotification('Task Starting', {
      body: `"${taskTitle}" should start now`,
      tag: 'task-start',
    })
  }

  static async notifyTaskOverdue(taskTitle: string): Promise<void> {
    await this.sendNotification('Task Overdue', {
      body: `"${taskTitle}" was not started on time`,
      tag: 'task-overdue',
      requireInteraction: true,
    })
  }

  static async notifyTaskDurationEnded(taskTitle: string): Promise<void> {
    await this.sendNotification('Task Duration Ended', {
      body: `"${taskTitle}" - planned duration has ended`,
      tag: 'task-duration',
    })
  }
}
'@ | Set-Content -Path "src\services\notification.service.ts" -Encoding UTF8

# scheduler.service.ts
@'
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
'@ | Set-Content -Path "src\services\scheduler.service.ts" -Encoding UTF8
Write-Host "✓ Services created" -ForegroundColor Green

# Step 9: Create stores
Write-Host "📦 Creating stores..." -ForegroundColor Yellow

# task.store.ts
@'
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
      const dailyTasks = await DatabaseService.getDailyTasks()
      const usedTasks = dailyTasks.filter(t => t.globalTaskId === id)
      
      if (usedTasks.length > 0) {
        return
      }
      
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
'@ | Set-Content -Path "src\stores\task.store.ts" -Encoding UTF8

# ui.store.ts
@'
import { create } from 'zustand'
import { DialogType } from '@/types/enums'

interface DialogData {
  title: string
  message: string
  onConfirm?: () => void
  onCancel?: () => void
  taskId?: number
}

interface UIState {
  activeDialog: DialogType | null
  dialogData: DialogData | null
  searchQuery: string
  selectedDate: Date
  
  setActiveDialog: (dialog: DialogType | null, data?: DialogData) => void
  closeDialog: () => void
  setSearchQuery: (query: string) => void
  setSelectedDate: (date: Date) => void
}

export const useUIStore = create<UIState>((set) => ({
  activeDialog: null,
  dialogData: null,
  searchQuery: '',
  selectedDate: new Date(),

  setActiveDialog: (dialog, data) => {
    set({ activeDialog: dialog, dialogData: data || null })
  },

  closeDialog: () => {
    set({ activeDialog: null, dialogData: null })
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query })
  },

  setSelectedDate: (date) => {
    set({ selectedDate: date })
  },
}))
'@ | Set-Content -Path "src\stores\ui.store.ts" -Encoding UTF8
Write-Host "✓ Stores created" -ForegroundColor Green

# Step 10: Create UI components
Write-Host "🎨 Creating UI components..." -ForegroundColor Yellow

# button.tsx
@'
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
'@ | Set-Content -Path "src\components\ui\button.tsx" -Encoding UTF8

# input.tsx
@'
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
'@ | Set-Content -Path "src\components\ui\input.tsx" -Encoding UTF8

# label.tsx
@'
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
'@ | Set-Content -Path "src\components\ui\label.tsx" -Encoding UTF8

# card.tsx
@'
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
'@ | Set-Content -Path "src\components\ui\card.tsx" -Encoding UTF8

# dialog.tsx
@'
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
'@ | Set-Content -Path "src\components\ui\dialog.tsx" -Encoding UTF8
Write-Host "✓ UI components created" -ForegroundColor Green

# Step 11: Create dialog components
Write-Host "💬 Creating dialog components..." -ForegroundColor Yellow

# ConfirmDialog.tsx
@'
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'default' | 'destructive'
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onConfirm()
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button 
            variant={variant === 'destructive' ? 'destructive' : 'default'} 
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
'@ | Set-Content -Path "src\components\dialogs\ConfirmDialog.tsx" -Encoding UTF8

# GlobalTaskDialog.tsx
@'
import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { GlobalTask } from '@/types/models'

interface GlobalTaskDialogProps {
  open: boolean
  onClose: () => void
  onSave: (task: Partial<GlobalTask>) => void
  task?: GlobalTask | null
}

export const GlobalTaskDialog: React.FC<GlobalTaskDialogProps> = ({
  open,
  onClose,
  onSave,
  task,
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState(30)
  const [reminder, setReminder] = useState<number | undefined>(undefined)
  const [icon, setIcon] = useState('')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setDuration(task.duration)
      setReminder(task.reminder)
      setIcon(task.icon || '')
    } else {
      setTitle('')
      setDescription('')
      setDuration(30)
      setReminder(undefined)
      setIcon('')
    }
  }, [task, open])

  const handleSave = () => {
    if (!title.trim()) return

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      duration,
      reminder,
      icon: icon || undefined,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent onKeyDown={handleKeyDown} className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {task ? 'Edit Task Template' : 'New Task Template'}
          </DialogTitle>
          <DialogDescription>
            {task 
              ? 'Modify the task template. This won\'t affect existing scheduled tasks.' 
              : 'Create a reusable task template for your daily planner.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              autoFocus
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min={1}
                max={480}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reminder">Reminder (minutes before)</Label>
              <Input
                id="reminder"
                type="number"
                value={reminder || ''}
                onChange={(e) => setReminder(e.target.value ? Number(e.target.value) : undefined)}
                min={1}
                max={60}
                placeholder="No reminder"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="icon">Icon (emoji)</Label>
            <Input
              id="icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="Optional emoji"
              maxLength={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            {task ? 'Save Changes' : 'Create Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
'@ | Set-Content -Path "src\components\dialogs\GlobalTaskDialog.tsx" -Encoding UTF8

# SelectGlobalTaskDialog.tsx
@'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import type { GlobalTask } from '@/types/models'
import { Button } from '@/components/ui/button'

interface SelectGlobalTaskDialogProps {
  open: boolean
  onClose: () => void
  onSelect: (task: GlobalTask) => void
  tasks: GlobalTask[]
}

export const SelectGlobalTaskDialog: React.FC<SelectGlobalTaskDialogProps> = ({
  open,
  onClose,
  onSelect,
  tasks,
}) => {
  const [search, setSearch] = useState('')

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent onKeyDown={handleKeyDown} className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select Task Template</DialogTitle>
          <DialogDescription>
            Choose a global task to add to today's planner
          </DialogDescription>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            autoFocus
          />
        </div>

        <div className="max-h-60 overflow-y-auto space-y-2">
          {filteredTasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              {search ? 'No tasks found' : 'No global tasks available'}
            </p>
          ) : (
            filteredTasks.map(task => (
              <Button
                key={task.id}
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => onSelect(task)}
              >
                <div className="flex items-center gap-2">
                  {task.icon && <span>{task.icon}</span>}
                  <div>
                    <div className="font-medium">{task.title}</div>
                    {task.description && (
                      <div className="text-xs text-muted-foreground">{task.description}</div>
                    )}
                  </div>
                </div>
                <span className="ml-auto text-xs text-muted-foreground">
                  {task.duration}min
                </span>
              </Button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
'@ | Set-Content -Path "src\components\dialogs\SelectGlobalTaskDialog.tsx" -Encoding UTF8

# EditDailyTaskDialog.tsx
@'
import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { DailyTask } from '@/types/models'
import { format } from 'date-fns'

interface EditDailyTaskDialogProps {
  open: boolean
  onClose: () => void
  onSave: (task: Partial<DailyTask>) => void
  task: DailyTask
}

export const EditDailyTaskDialog: React.FC<EditDailyTaskDialogProps> = ({
  open,
  onClose,
  onSave,
  task,
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState(30)
  const [startTime, setStartTime] = useState('')
  const [icon, setIcon] = useState('')

  useEffect(() => {
    if (task && open) {
      setTitle(task.title)
      setDescription(task.description || '')
      setDuration(task.duration)
      setStartTime(format(new Date(task.plannedStart), 'HH:mm'))
      setIcon(task.icon || '')
    }
  }, [task, open])

  const handleSave = () => {
    if (!title.trim() || !startTime) return

    const [hours, minutes] = startTime.split(':')
    const plannedStart = new Date(task.plannedStart)
    plannedStart.setHours(Number(hours), Number(minutes), 0, 0)

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      duration,
      plannedStart,
      icon: icon || undefined,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent onKeyDown={handleKeyDown} className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Modify this task instance. Changes won't affect the global template.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              autoFocus
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min={1}
                max={480}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="icon">Icon (emoji)</Label>
            <Input
              id="icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="Optional emoji"
              maxLength={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim() || !startTime}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
'@ | Set-Content -Path "src\components\dialogs\EditDailyTaskDialog.tsx" -Encoding UTF8
Write-Host "✓ Dialog components created" -ForegroundColor Green

# Step 12: Create task components
Write-Host "📋 Creating task components..." -ForegroundColor Yellow

# GlobalTaskCard.tsx
@'
import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, Clock } from 'lucide-react'
import type { GlobalTask } from '@/types/models'

interface GlobalTaskCardProps {
  task: GlobalTask
  onEdit: (task: GlobalTask) => void
  onDelete: (task: GlobalTask) => void
}

export const GlobalTaskCard: React.FC<GlobalTaskCardProps> = React.memo(({ task, onEdit, onDelete }) => {
  return (
    <Card className="p-4 hover:bg-secondary/50 transition-colors group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {task.icon && (
              <span className="text-lg">{task.icon}</span>
            )}
            <h3 className="font-medium truncate">{task.title}</h3>
          </div>
          
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            {task.duration > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {task.duration}min
              </span>
            )}
            {task.reminder && task.reminder > 0 && (
              <span>Reminder: {task.reminder}min before</span>
            )}
          </div>
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task)}
            aria-label="Edit task"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task)}
            aria-label="Delete task"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
})

GlobalTaskCard.displayName = 'GlobalTaskCard'
'@ | Set-Content -Path "src\components\tasks\GlobalTaskCard.tsx" -Encoding UTF8

# DailyTaskCard.tsx
@'
import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, CheckCircle2, Clock, AlertCircle, Pencil, Trash2 } from 'lucide-react'
import type { DailyTask } from '@/types/models'
import { cn } from '@/lib/utils'
import { differenceInMinutes } from 'date-fns'

interface DailyTaskCardProps {
  task: DailyTask
  onStart: (task: DailyTask) => void
  onComplete: (task: DailyTask) => void
  onEdit: (task: DailyTask) => void
  onDelete: (task: DailyTask) => void
  isRunning: boolean
}

const statusConfig = {
  planned: {
    bg: 'bg-card',
    border: 'border-border',
    text: 'text-foreground',
    icon: Clock,
  },
  running: {
    bg: 'bg-primary/10',
    border: 'border-primary/50',
    text: 'text-primary',
    icon: Play,
  },
  completed: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/50',
    text: 'text-green-500',
    icon: CheckCircle2,
  },
  uncompleted: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/50',
    text: 'text-red-500',
    icon: AlertCircle,
  },
}

export const DailyTaskCard: React.FC<DailyTaskCardProps> = React.memo(({
  task,
  onStart,
  onComplete,
  onEdit,
  onDelete,
  isRunning,
}) => {
  const config = statusConfig[task.status]
  const StatusIcon = config.icon
  
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  const getTaskTime = () => {
    const start = new Date(task.plannedStart)
    const end = new Date(start.getTime() + task.duration * 60000)
    return `${formatTime(start)} - ${formatTime(end)}`
  }

  const getProgress = () => {
    if (task.status !== 'running' || !task.actualStart) return 0
    
    const now = new Date()
    const elapsed = differenceInMinutes(now, task.actualStart)
    const total = task.duration
    return Math.min((elapsed / total) * 100, 100)
  }

  return (
    <Card className={cn(
      'p-4 transition-colors group',
      config.bg,
      config.border
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {task.icon && <span className="text-lg">{task.icon}</span>}
            <h3 className={cn('font-medium', config.text)}>{task.title}</h3>
          </div>
          
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <StatusIcon className="h-3 w-3" />
              {getTaskTime()}
            </span>
            <span>{task.duration}min</span>
          </div>

          {task.status === 'running' && (
            <div className="mt-2 w-full bg-secondary rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-1000"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          )}
        </div>

        <div className="flex gap-1 ml-4">
          {task.status === 'planned' && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onStart(task)}
                aria-label="Start task"
                className="text-primary hover:text-primary"
              >
                <Play className="h-4 w-4" />
              </Button>
              <div className="hidden group-hover:flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(task)}
                  aria-label="Edit task"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(task)}
                  aria-label="Delete task"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
          {task.status === 'running' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onComplete(task)}
              aria-label="Complete task"
              className="text-green-500 hover:text-green-500"
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
})

DailyTaskCard.displayName = 'DailyTaskCard'
'@ | Set-Content -Path "src\components\tasks\DailyTaskCard.tsx" -Encoding UTF8
Write-Host "✓ Task components created" -ForegroundColor Green

# Step 13: Create timer component
Write-Host "⏱️ Creating timer component..." -ForegroundColor Yellow

# TimerDisplay.tsx
@'
import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Square } from 'lucide-react'
import type { DailyTask } from '@/types/models'
import { differenceInSeconds } from 'date-fns'

interface TimerDisplayProps {
  task: DailyTask
  onComplete: () => void
  onStop: () => void
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  task,
  onComplete,
  onStop,
}) => {
  const [elapsed, setElapsed] = useState(0)
  const [remaining, setRemaining] = useState(task.duration * 60)
  
  useEffect(() => {
    if (!task.actualStart) return

    const interval = setInterval(() => {
      const now = new Date()
      const start = new Date(task.actualStart!)
      const elapsedSeconds = differenceInSeconds(now, start)
      const remainingSeconds = Math.max(task.duration * 60 - elapsedSeconds, 0)
      
      setElapsed(elapsedSeconds)
      setRemaining(remainingSeconds)

      if (remainingSeconds <= 0) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [task])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const progress = task.duration > 0 
    ? ((task.duration * 60 - remaining) / (task.duration * 60)) * 100 
    : 0

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <Card className="p-8 w-full max-w-lg text-center">
        <div className="mb-8">
          {task.icon && <span className="text-4xl mb-4 block">{task.icon}</span>}
          <h1 className="text-2xl font-bold mb-2">{task.title}</h1>
          {task.description && (
            <p className="text-muted-foreground">{task.description}</p>
          )}
        </div>

        <div className="relative mb-8">
          <svg className="w-48 h-48 mx-auto transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              className="stroke-current text-secondary"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              className="stroke-current text-primary"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-mono font-bold">
                {formatTime(remaining)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">remaining</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-secondary rounded-lg">
            <div className="text-lg font-mono font-bold">{formatTime(elapsed)}</div>
            <div className="text-xs text-muted-foreground">Elapsed</div>
          </div>
          <div className="text-center p-3 bg-secondary rounded-lg">
            <div className="text-lg font-mono font-bold">{formatTime(remaining)}</div>
            <div className="text-xs text-muted-foreground">Remaining</div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={onComplete}
            size="lg"
            className="bg-green-500 hover:bg-green-600"
          >
            Finish
          </Button>
          <Button
            onClick={onStop}
            variant="outline"
            size="lg"
          >
            <Square className="h-5 w-5 mr-2" />
            Stop
          </Button>
        </div>
      </Card>
    </div>
  )
}
'@ | Set-Content -Path "src\components\timer\TimerDisplay.tsx" -Encoding UTF8
Write-Host "✓ Timer component created" -ForegroundColor Green

# Step 14: Create layout components
Write-Host "📐 Creating layout components..." -ForegroundColor Yellow

# Navigation.tsx
@'
'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ListTodo, Calendar, Timer } from 'lucide-react'

const navItems = [
  {
    href: '/',
    label: 'Global Tasks',
    icon: ListTodo,
  },
  {
    href: '/planner',
    label: "Today's Planner",
    icon: Calendar,
  },
  {
    href: '/timer',
    label: 'Timer',
    icon: Timer,
  },
]

export const Navigation: React.FC = () => {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border">
      <div className="container mx-auto max-w-4xl">
        <div className="flex h-14 items-center space-x-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
'@ | Set-Content -Path "src\components\layout\Navigation.tsx" -Encoding UTF8

# MainLayout.tsx
@'
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
'@ | Set-Content -Path "src\components\layout\MainLayout.tsx" -Encoding UTF8
Write-Host "✓ Layout components created" -ForegroundColor Green

# Step 15: Create pages
Write-Host "📄 Creating pages..." -ForegroundColor Yellow

# layout.tsx
@'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { MainLayout } from '@/components/layout/MainLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Task Planner',
  description: 'Personal task planner application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  )
}
'@ | Set-Content -Path "src\app\layout.tsx" -Encoding UTF8

# page.tsx (Global Tasks)
@'
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
'@ | Set-Content -Path "src\app\page.tsx" -Encoding UTF8

# planner/page.tsx
@'
'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useTaskStore } from '@/stores/task.store'
import { useUIStore } from '@/stores/ui.store'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { DailyTaskCard } from '@/components/tasks/DailyTaskCard'
import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog'
import { SelectGlobalTaskDialog } from '@/components/dialogs/SelectGlobalTaskDialog'
import { EditDailyTaskDialog } from '@/components/dialogs/EditDailyTaskDialog'
import { ValidationService } from '@/services/validation.service'
import type { DailyTask, GlobalTask } from '@/types/models'
import { DialogType } from '@/types/enums'
import { format } from 'date-fns'

export default function PlannerPage() {
  const { 
    globalTasks,
    dailyTasks, 
    loading, 
    loadGlobalTasks,
    loadDailyTasks, 
    createDailyTask,
    updateDailyTask,
    deleteDailyTask,
    startTask,
    completeTask,
  } = useTaskStore()
  
  const { 
    activeDialog, 
    dialogData, 
    setActiveDialog, 
    closeDialog,
  } = useUIStore()

  const [showGlobalTaskSelect, setShowGlobalTaskSelect] = useState(false)
  const [editingTask, setEditingTask] = useState<DailyTask | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  useEffect(() => {
    loadGlobalTasks()
    loadDailyTasks()
  }, [loadGlobalTasks, loadDailyTasks])

  const handleAddTask = () => {
    setShowGlobalTaskSelect(true)
  }

  const handleSelectGlobalTask = async (globalTask: GlobalTask) => {
    const existingTasks = dailyTasks.filter(t => t.status !== 'completed' && t.status !== 'uncompleted')
    const earliestTime = ValidationService.getEarliestAvailableTime(new Date(), existingTasks)
    
    await createDailyTask({
      globalTaskId: globalTask.id,
      title: globalTask.title,
      description: globalTask.description,
      duration: globalTask.duration,
      reminder: globalTask.reminder,
      color: globalTask.color,
      icon: globalTask.icon,
      plannedStart: earliestTime,
      status: 'planned',
    })
    
    setShowGlobalTaskSelect(false)
  }

  const handleStartTask = useCallback(async (task: DailyTask) => {
    const now = new Date()
    const taskStart = new Date(task.plannedStart)
    
    if (now < taskStart) {
      setActiveDialog(DialogType.EARLY_START, {
        title: 'Early Start',
        message: `This task is scheduled for ${format(taskStart, 'HH:mm')}. Start now?`,
        onConfirm: async () => {
          await startTask(task)
          closeDialog()
        },
        onCancel: () => closeDialog(),
      })
      return
    }
    
    await startTask(task)
  }, [startTask, setActiveDialog, closeDialog])

  const handleCompleteTask = useCallback(async (task: DailyTask) => {
    await completeTask(task)
  }, [completeTask])

  const handleEditTask = useCallback((task: DailyTask) => {
    setEditingTask(task)
    setShowEditDialog(true)
  }, [])

  const handleSaveEdit = useCallback(async (taskData: Partial<DailyTask>) => {
    if (!editingTask) return
    
    const validation = await ValidationService.validateTaskTime(
      { ...editingTask, ...taskData } as DailyTask,
      editingTask.id
    )
    
    if (!validation.valid) {
      setActiveDialog(DialogType.OVERLAP_WARNING, {
        title: 'Schedule Conflict',
        message: validation.message || 'Invalid time',
        onConfirm: () => closeDialog(),
        onCancel: () => closeDialog(),
      })
      return
    }
    
    await updateDailyTask(editingTask.id!, taskData)
    setShowEditDialog(false)
    setEditingTask(null)
  }, [editingTask, updateDailyTask, setActiveDialog, closeDialog])

  const handleDeleteTask = useCallback(async (task: DailyTask) => {
    await deleteDailyTask(task.id!)
  }, [deleteDailyTask])

  const sortedTasks = [...dailyTasks].sort((a, b) => 
    new Date(a.plannedStart).getTime() - new Date(b.plannedStart).getTime()
  )

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Today's Planner</h1>
          <p className="text-muted-foreground mt-2">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <Button onClick={handleAddTask} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Add Task
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading tasks...</p>
        </div>
      ) : sortedTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            No tasks planned for today
          </p>
          <Button onClick={handleAddTask} variant="outline" className="mt-4">
            Plan your first task
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedTasks.map(task => (
            <DailyTaskCard
              key={task.id}
              task={task}
              onStart={handleStartTask}
              onComplete={handleCompleteTask}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              isRunning={task.status === 'running'}
            />
          ))}
        </div>
      )}

      <SelectGlobalTaskDialog
        open={showGlobalTaskSelect}
        onClose={() => setShowGlobalTaskSelect(false)}
        onSelect={handleSelectGlobalTask}
        tasks={globalTasks}
      />

      {editingTask && (
        <EditDailyTaskDialog
          open={showEditDialog}
          onClose={() => {
            setShowEditDialog(false)
            setEditingTask(null)
          }}
          onSave={handleSaveEdit}
          task={editingTask}
        />
      )}

      {activeDialog === DialogType.EARLY_START && dialogData && (
        <ConfirmDialog
          open={true}
          title={dialogData.title}
          message={dialogData.message}
          onConfirm={dialogData.onConfirm || (() => {})}
          onCancel={dialogData.onCancel || (() => {})}
        />
      )}

      {activeDialog === DialogType.OVERLAP_WARNING && dialogData && (
        <ConfirmDialog
          open={true}
          title={dialogData.title}
          message={dialogData.message}
          confirmLabel="OK"
          onConfirm={dialogData.onConfirm || (() => {})}
          onCancel={dialogData.onCancel || (() => {})}
        />
      )}
    </div>
  )
}
'@ | Set-Content -Path "src\app\planner\page.tsx" -Encoding UTF8

# timer/page.tsx
@'
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
'@ | Set-Content -Path "src\app\timer\page.tsx" -Encoding UTF8
Write-Host "✓ Pages created" -ForegroundColor Green

Write-Host ""
Write-Host "✅ SETUP COMPLETE!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run: npm run dev" -ForegroundColor White
Write-Host "2. Open: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "The application includes:" -ForegroundColor Cyan
Write-Host "  • Global Tasks page (task templates)" -ForegroundColor White
Write-Host "  • Today's Planner (daily schedule)" -ForegroundColor White
Write-Host "  • Timer (active task countdown)" -ForegroundColor White
Write-Host "  • IndexedDB storage" -ForegroundColor White
Write-Host "  • Dark theme" -ForegroundColor White
Write-Host "  • Browser notifications" -ForegroundColor White
Write-Host "  • Keyboard shortcuts (Ctrl+N, Delete, Esc)" -ForegroundColor White
Write-Host ""