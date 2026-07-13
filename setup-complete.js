const fs = require('fs');
const path = require('path');

const files = {
  // Services
  'src/services/notification.service.ts': `export class NotificationService {
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
      body: \`"\${taskTitle}" should start now\`,
      tag: 'task-start',
    })
  }

  static async notifyTaskOverdue(taskTitle: string): Promise<void> {
    await this.sendNotification('Task Overdue', {
      body: \`"\${taskTitle}" was not started on time\`,
      tag: 'task-overdue',
      requireInteraction: true,
    })
  }

  static async notifyTaskDurationEnded(taskTitle: string): Promise<void> {
    await this.sendNotification('Task Duration Ended', {
      body: \`"\${taskTitle}" - planned duration has ended\`,
      tag: 'task-duration',
    })
  }
}`,

  'src/services/scheduler.service.ts': `import { DatabaseService } from './database.service'
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
}`,

  // Stores
  'src/stores/task.store.ts': `import { create } from 'zustand'
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
}))`,

  'src/stores/ui.store.ts': `import { create } from 'zustand'
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
}))`,

  // UI Components
  'src/components/ui/button.tsx': `import * as React from "react"
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

export { Button, buttonVariants }`,

  'src/components/ui/input.tsx': `import * as React from "react"
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

export { Input }`,

  'src/components/ui/label.tsx': `"use client"

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

export { Label }`,

  'src/components/ui/card.tsx': `import * as React from "react"
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

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }`,

  'src/components/ui/dialog.tsx': `"use client"

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
}`,
};

// Create all files
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  const dir = path.dirname(fullPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✓ Created: ${filePath}`);
});

console.log('\n✅ All files created successfully!');
console.log('\nNext steps:');
console.log('1. Run: node setup-dialogs.js   (for dialog components)');
console.log('2. Run: node setup-pages.js     (for page components)');
console.log('3. Run: npm run dev             (to start the app)');