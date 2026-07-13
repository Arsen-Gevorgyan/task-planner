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
      return hours + ':' + String(minutes).padStart(2, '0') + ':' + String(secs).padStart(2, '0')
    }
    return String(minutes).padStart(2, '0') + ':' + String(secs).padStart(2, '0')
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
              strokeDasharray={2 * Math.PI * 88}
              strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
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