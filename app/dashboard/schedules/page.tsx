'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Plus,
  Search,
  Calendar,
  User,
  Building,
  FileText,
  MoreHorizontal,
  Edit,
  Trash2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  mockSchedules as initialMockSchedules,
  mockUsers,
  mockSites,
} from '@/lib/data/mock-schedules'
import { mockTemplates } from '@/lib/data/mock-templates'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { CreateScheduleForm } from './components/create-schedule-form'
import { EditScheduleForm } from './components/edit-schedule-form'
import { ScheduleDetails } from './components/schedule-details'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Schedule, Frequency } from '@/lib/types/schedule-types'
import { v4 as uuidv4 } from 'uuid'
import { calculateNextAuditDate } from '@/utils/data-utils'

export default function SchedulesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null,
  )
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load schedules from localStorage or use mock data
  useEffect(() => {
    setIsLoading(true)
    try {
      const savedSchedules = localStorage.getItem('auditSchedules')
      if (savedSchedules) {
        const parsedSchedules = JSON.parse(savedSchedules)
        setSchedules(parsedSchedules)
      } else {
        // Initialize with mock data
        setSchedules(initialMockSchedules)
        localStorage.setItem(
          'auditSchedules',
          JSON.stringify(initialMockSchedules),
        )
      }
    } catch (error) {
      console.error('Error loading schedules:', error)
      setSchedules(initialMockSchedules)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save schedules to loxcalStorage whenever they change
  useEffect(() => {
    if (!isLoading && schedules.length > 0) {
      localStorage.setItem('auditSchedules', JSON.stringify(schedules))
    }
  }, [schedules, isLoading])

  // Filter schedules based on search query
  const filteredSchedules = schedules.filter((schedule) => {
    if (!searchQuery.trim()) return true

    const query = searchQuery.toLowerCase().trim()

    // Check title
    if (schedule.title.toLowerCase().includes(query)) return true

    // Check site name
    if (schedule.site?.name?.toLowerCase().includes(query)) return true

    // Check assignee name
    if (schedule.assignee?.name?.toLowerCase().includes(query)) return true

    // Check template title
    if (schedule.template?.title?.toLowerCase().includes(query)) return true

    // Check frequency
    if (schedule.frequency.toLowerCase().includes(query)) return true

    return false
  })

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
      case 'weekly':
        return 'bg-green-100 text-green-800 hover:bg-green-100'
      case 'monthly':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100'
      case 'yearly':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    }
  }

  // Create a new schedule
  const handleCreateSchedule = (formData: {
    title: string
    template_id: string
    site_id: string
    assignee_id: string
    frequency: Frequency
  }) => {
    try {
      // Find the selected template, site, and assignee
      const template = mockTemplates.find((t) => t.id === formData.template_id)
      const site = mockSites.find((s) => s.id === formData.site_id)
      const assignee = mockUsers.find((u) => u.id === formData.assignee_id)

      if (!template || !site || !assignee) {
        throw new Error('Required references not found')
      }

      // Create a new schedule object
      const newSchedule: Schedule = {
        id: uuidv4(),
        ...formData,
        template,
        site,
        assignee,
        nextAuditDate: calculateNextAuditDate(formData.frequency),
        createdAt: new Date().toISOString(),
      }

      // Add the new schedule to the list
      setSchedules((prev) => [...prev, newSchedule])
      setIsCreateDialogOpen(false)

      toast.success('Schedule created successfully')
    } catch (error) {
      console.error('Error creating schedule:', error)
      toast.error('Failed to create schedule. Please try again.')
    }
  }

  // Edit an existing schedule
  const handleEditSchedule = (formData: {
    id: string
    title: string
    template_id: string
    site_id: string
    assignee_id: string
    frequency: Frequency
  }) => {
    try {
      // Find the selected template, site, and assignee
      const template = mockTemplates.find((t) => t.id === formData.template_id)
      const site = mockSites.find((s) => s.id === formData.site_id)
      const assignee = mockUsers.find((u) => u.id === formData.assignee_id)

      if (!template || !site || !assignee) {
        throw new Error('Required references not found')
      }

      // Find the existing schedule
      const existingSchedule = schedules.find((s) => s.id === formData.id)

      if (!existingSchedule) {
        throw new Error('Schedule not found')
      }

      // Create an updated schedule object
      const updatedSchedule: Schedule = {
        ...existingSchedule,
        title: formData.title,
        template_id: formData.template_id,
        site_id: formData.site_id,
        assignee_id: formData.assignee_id,
        frequency: formData.frequency,
        template,
        site,
        assignee,
        nextAuditDate:
          formData.frequency !== existingSchedule.frequency
            ? calculateNextAuditDate(formData.frequency)
            : existingSchedule.nextAuditDate,
        // updatedAt: new Date().toISOString(),
      }

      // Update the schedule in the list
      setSchedules((prev) =>
        prev.map((schedule) =>
          schedule.id === formData.id ? updatedSchedule : schedule,
        ),
      )

      setIsEditDialogOpen(false)
      setSelectedSchedule(null)

      toast.success('Schedule updated successfully')
    } catch (error) {
      console.error('Error updating schedule:', error)
      toast.error('Failed to update schedule. Please try again.')
    }
  }

  // Delete a schedule
  const handleDeleteSchedule = () => {
    if (selectedSchedule) {
      try {
        setSchedules((prev) =>
          prev.filter((schedule) => schedule.id !== selectedSchedule.id),
        )
        setIsDeleteDialogOpen(false)
        setSelectedSchedule(null)

        toast.success('Schedule deleted successfully')
      } catch (error) {
        console.error('Error deleting schedule:', error)
        toast.error('Failed to delete schedule. Please try again.')
      }
    }
  }

  // Open the edit dialog
  const openEditDialog = (schedule: Schedule) => {
    setSelectedSchedule(schedule)
    setIsEditDialogOpen(true)
  }

  // Open the details dialog
  const openDetailsDialog = (schedule: Schedule) => {
    setSelectedSchedule(schedule)
    setIsDetailsDialogOpen(true)
  }

  // Open the delete dialog
  const openDeleteDialog = (schedule: Schedule) => {
    setSelectedSchedule(schedule)
    setIsDeleteDialogOpen(true)
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Schedules</h1>
            <p className="text-muted-foreground">
              Manage audit schedules and timelines
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Schedule
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search schedules by title, site, assignee, template or frequency..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery('')}
              className="h-9 px-2"
            >
              Clear
            </Button>
          )}
        </div>

        {searchQuery && filteredSchedules.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Found {filteredSchedules.length}{' '}
            {filteredSchedules.length === 1 ? 'result' : 'results'} for &quot;
            {searchQuery}&quot;
          </p>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <p>Loading schedules...</p>
          </div>
        ) : filteredSchedules.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Schedules Found</CardTitle>
              <CardDescription>
                {searchQuery
                  ? 'No schedules match your search criteria. Try a different search term.'
                  : 'No schedules have been created yet. Create your first schedule to get started.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Schedule
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredSchedules.map((schedule) => (
              <Card key={schedule.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{schedule.title}</CardTitle>
                      <CardDescription>
                        Next audit:{' '}
                        {new Date(
                          schedule.nextAuditDate || '',
                        ).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => openEditDialog(schedule)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Schedule
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => openDeleteDialog(schedule)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Schedule
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Frequency</p>
                        <Badge
                          className={getFrequencyColor(schedule.frequency)}
                          variant="secondary"
                        >
                          {schedule.frequency.charAt(0).toUpperCase() +
                            schedule.frequency.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Assignee</p>
                        <p className="text-sm text-muted-foreground">
                          {schedule.assignee?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Site</p>
                        <p className="text-sm text-muted-foreground">
                          {schedule.site?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/50 p-3">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Template: {schedule.template?.title}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDetailsDialog(schedule)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Schedule Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Schedule</DialogTitle>
            <DialogDescription>
              Set up a recurring audit schedule by filling out the form below.
            </DialogDescription>
          </DialogHeader>
          <CreateScheduleForm
            onSubmit={handleCreateSchedule}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Schedule Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Schedule</DialogTitle>
            <DialogDescription>
              Update the schedule details below.
            </DialogDescription>
          </DialogHeader>
          {selectedSchedule && (
            <EditScheduleForm
              schedule={selectedSchedule}
              onSubmit={handleEditSchedule}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Schedule Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Schedule Details</DialogTitle>
          </DialogHeader>
          {selectedSchedule && <ScheduleDetails schedule={selectedSchedule} />}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailsDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the schedule{' '}
              {selectedSchedule?.title}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSchedule}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
