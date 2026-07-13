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