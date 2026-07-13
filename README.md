# 📋 Task Planner

A minimalist, dark-themed personal task planner web application. Plan your day, track tasks, and stay productive with a built-in focus timer.

**🌐 Live Demo:** [arsen-gevorgyan.github.io/task-planner](https://arsen-gevorgyan.github.io/task-planner)

![Task Planner Screenshot](public/next.svg)

---

## ✨ Features

### 📝 Global Task Templates
- Create reusable task templates with custom durations, reminders, emoji icons, and descriptions
- Edit or delete templates anytime
- Search and sort your task templates alphabetically
- **Deleting a template removes all scheduled instances** (with confirmation dialog)

### 📅 Today's Planner
- Schedule tasks for today from your global templates
- Tasks are **automatically assigned the earliest available time**
- **No overlapping tasks allowed** - built-in validation
- Edit daily tasks independently (changes don't affect templates)
- Start tasks early with confirmation, or mark as uncompleted if late
- Tasks sorted strictly by start time

### ⏱️ Focus Timer
- Dedicated timer page with large countdown display
- Visual circular progress indicator
- Shows elapsed and remaining time
- Finish or stop tasks directly from the timer

### 🎨 Visual Status Indicators
- 🟢 **Green** - Completed tasks
- 🔴 **Red** - Uncompleted/overdue tasks
- 🔵 **Blue** - Currently running task
- ⚫ **Neutral** - Planned tasks

### 🔔 Browser Notifications
- Get notified when a task should start
- Alert when task duration ends
- Warning for overdue tasks
- Works even when the browser tab is not focused

### ⌨️ Keyboard Shortcuts (Desktop)
| Shortcut | Action |
|----------|--------|
| `Ctrl + N` | Create new global task |
| `Ctrl + S` | Save task |
| `Space` | Start/Pause timer |
| `Enter` | Confirm dialog |
| `Escape` | Close dialog |
| `Delete` | Delete selected task |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS v4** | Utility-first CSS framework |
| **shadcn/ui (Radix UI)** | Accessible UI components |
| **Zustand** | State management |
| **Dexie.js** | IndexedDB wrapper for local storage |
| **date-fns** | Date manipulation library |
| **Lucide React** | Icon library |
| **Browser Notifications API** | Push notifications |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18+ 
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/Arsen-Gevorgyan/task-planner.git

# Navigate to the project
cd task-planner

# Install dependencies
npm install

# Start the development server
npm run dev