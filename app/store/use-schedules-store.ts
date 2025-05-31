import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  getActiveUsers,
  getTemplates,
  getSites,
} from '@/app/dashboard/schedules/actions/actions'

interface User {
  id: string
  full_name: string
  email: string
  role: string
  phone_number?: string
  image?: string
}

interface Template {
  id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

interface Site {
  id: string
  name: string
  address?: string
  created_at: string
  updated_at: string
}

interface ApiResponse<T> {
  data: T
  success?: boolean
  error?: string
}

interface SchedulesStore {
  users: User[]
  templates: Template[]
  sites: Site[]
  isLoadingUsers: boolean
  isLoadingTemplates: boolean
  isLoadingSites: boolean
  error: string | null
  fetchUsers: () => Promise<void>
  fetchTemplates: () => Promise<void>
  fetchSites: () => Promise<void>
  reset: () => void
}

export const useSchedulesStore = create<SchedulesStore>()(
  persist(
    (set) => ({
      users: [],
      templates: [],
      sites: [],
      isLoadingUsers: false,
      isLoadingTemplates: false,
      isLoadingSites: false,
      error: null,

      fetchUsers: async () => {
        try {
          set({ isLoadingUsers: true, error: null })
          const response = (await getActiveUsers()) as ApiResponse<User[]>
          console.log('res from fetchUsers', response)
          if (response?.data) {
            set({ users: response.data, isLoadingUsers: false })
          }
        } catch {
          set({ error: 'Failed to fetch users', isLoadingUsers: false })
        }
      },

      fetchTemplates: async () => {
        try {
          set({ isLoadingTemplates: true, error: null })
          const response = (await getTemplates()) as ApiResponse<Template[]>
          if (response?.data) {
            set({ templates: response.data, isLoadingTemplates: false })
          }
        } catch {
          set({ error: 'Failed to fetch templates', isLoadingTemplates: false })
        }
      },

      fetchSites: async () => {
        try {
          set({ isLoadingSites: true, error: null })
          const sites = await getSites()
          set({ sites, isLoadingSites: false })
        } catch {
          set({ error: 'Failed to fetch sites', isLoadingSites: false })
        }
      },

      reset: () => {
        set({
          users: [],
          templates: [],
          sites: [],
          isLoadingUsers: false,
          isLoadingTemplates: false,
          isLoadingSites: false,
          error: null,
        })
      },
    }),
    {
      name: 'schedules-store', // unique name for localStorage
      partialize: (state) => ({
        users: state.users,
        templates: state.templates,
        sites: state.sites,
      }), // only persist these fields
    },
  ),
)
