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