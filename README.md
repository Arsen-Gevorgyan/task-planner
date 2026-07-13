# Task Planner

A minimalist, dark-themed personal task planner web application built with Next.js. Plan your day, track tasks, and stay productive with a built-in timer.

![Task Planner](public/next.svg)

## Features

- 📝 **Global Task Templates** - Create reusable task templates with custom durations, reminders, and icons
- 📅 **Daily Planner** - Schedule tasks for today with automatic time management
- ⏱️ **Built-in Timer** - Focus timer with progress tracking and countdown
- 🔔 **Browser Notifications** - Get reminded when tasks should start or end
- 🎨 **Dark Theme** - Easy on the eyes, modern dark interface
- 💾 **Local-First** - All data stored locally in IndexedDB, no account needed
- ⌨️ **Keyboard Shortcuts** - Power user friendly with shortcuts
- 📱 **Responsive** - Works on desktop and mobile devices

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui (Radix UI)
- **State Management:** Zustand
- **Database:** Dexie.js (IndexedDB)
- **Icons:** Lucide React
- **Date Handling:** date-fns
- **Notifications:** Browser Notifications API

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/task-planner.git
cd task-planner