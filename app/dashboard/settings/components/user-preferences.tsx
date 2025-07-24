'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export function UserPreferences() {
  const [isLoading, setIsLoading] = useState(false)
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    dashboardView: 'card',
    autoSave: true,
    language: 'en',
  })

  const handleSwitchChange = (name: string) => {
    setPreferences((prev) => ({
      ...prev,
      [name]: !prev[name as keyof typeof prev],
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setPreferences((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success('Preferences saved')
    } catch (error) {
      console.error(error)
      toast.error('Failed to save preferences. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="emailNotifications">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive email notifications for important events
            </p>
          </div>
          <Switch
            id="emailNotifications"
            checked={preferences.emailNotifications}
            onCheckedChange={() => handleSwitchChange('emailNotifications')}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="autoSave">Auto Save</Label>
            <p className="text-sm text-muted-foreground">
              Automatically save changes while editing
            </p>
          </div>
          <Switch
            id="autoSave"
            checked={preferences.autoSave}
            onCheckedChange={() => handleSwitchChange('autoSave')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dashboardView">Default Dashboard View</Label>
          <Select
            value={preferences.dashboardView}
            onValueChange={(value) =>
              handleSelectChange('dashboardView', value)
            }
          >
            <SelectTrigger id="dashboardView" className="w-full">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="card">Card View</SelectItem>
              <SelectItem value="list">List View</SelectItem>
              <SelectItem value="table">Table View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Preferences
      </Button>
    </form>
  )
}
