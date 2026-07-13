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