'use client'

import type React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Site } from '@/lib/types/inspection-types'
import { PlusCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { InspectionQuestionsManager } from './inspections-question-manager'
import { useInspectionForm } from '../hooks/useInspectionForm'
import { useAuth } from '@/lib/context/auth-provider'
import { createInspection } from '../../actions/actions'

const mockUsers = [
  //create mock users
  {
    id: '0',
    name: 'Admin',
    email: 'admin@example.com',
  },
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
  },
  {
    id: '2',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
  },
]
export function CreateInspectionForm({ sites }: { sites: Site[] }) {
  const {
    sections,
    setSections,
    groupSectionsIntoPages,
    isCreating,
    inspectionName,
    locationId,
    scheduledDate,
    showSuccessDialog,
    setShowSuccessDialog,
    createdInspection,
    router,
    addSection,
    removeSection,
    moveSection,
    assignedTo,
    getPageName,
  } = useInspectionForm()

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()

  //   if (!inspectionName || !locationId) {
  //     toast.error('Please provide an inspection name and location.')
  //     return
  //   }

  //   // Validate that all sections have names and at least one question
  //   for (const section of sections) {
  //     if (!section.name) {
  //       toast.error('All sections must have a name.')
  //       return
  //     }

  //     if (section.questions.length === 0) {
  //       toast.error(
  //         `Section "${section.name}" must have at least one question.`,
  //       )
  //       return
  //     }

  //     // Validate that all questions have names
  //     for (const question of section.questions) {
  //       if (!question.name) {
  //         toast.error(
  //           `A question in section "${section.name}" is missing text.`,
  //         )
  //         return
  //       }
  //     }
  //   }

  //   setIsCreating(true)

  //   try {
  //     const location = mockLocations.find((loc) => loc.id === locationId)

  //     if (!location) {
  //       throw new Error('Selected location not found')
  //     }

  //     const inspectionId = `inspection-${Date.now()}`
  //     const newInspection: Inspection = {
  //       id: inspectionId,
  //       name: inspectionName,
  //       conducted_on: scheduledDate ? new Date(scheduledDate) : new Date(),
  //       location: location,
  //       sections: sections,
  //       user_name: user?.full_name as string,
  //       status: 'draft',
  //       last_modified: new Date(),
  //       score: null,
  //     }

  //     // Save to localStorage
  //     await saveInspection(newInspection)

  //     // Store the created inspection for the success dialog
  //     setCreatedInspection(newInspection)
  //     setShowSuccessDialog(true)
  //   } catch (error) {
  //     console.error('Error creating inspection:', error)
  //     toast.error('Failed to create inspection.')
  //     setIsCreating(false)
  //   }
  // }

  async function handleSubmit(formData: FormData) {
    await createInspection(formData)
  }

  const handleViewInspection = () => {
    if (createdInspection) {
      router.push(`/dashboard/inspections/${createdInspection.id}/report`)
    }
    setShowSuccessDialog(false)
  }
  const { user } = useAuth()

  const handleStartInspection = () => {
    if (createdInspection) {
      router.push(`/dashboard/inspections/${createdInspection.id}/edit`)
    }
    setShowSuccessDialog(false)
  }

  return (
    <>
      <form action={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>New Inspection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inspection-name">Inspection Name</Label>
              <Input
                id="inspection-name"
                name="inspection-name"
                defaultValue={inspectionName}
                placeholder="Enter inspection name"
              />
            </div>

            <div className="flex items-center justify-between gap-8">
              <span className="w-full">
                <Label htmlFor="location">Location</Label>
                <Select name="location" defaultValue={locationId}>
                  <SelectTrigger className="w-full" id="location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {sites.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </span>

              <span className="w-full">
                <Label htmlFor="assigned-to">Assign To</Label>
                <Select name="assigned-to" defaultValue={assignedTo}>
                  <SelectTrigger className="w-full" id="assigned-to">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prepared-by">Prepared By</Label>
              <Input
                id="prepared-by"
                name="prepared-by"
                value={user?.full_name}
                className="cursor-not-allowed bg-gray-100"
                disabled
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled-date">Scheduled Date</Label>
              <Input
                id="scheduled-date"
                name="scheduled-date"
                type="date"
                defaultValue={scheduledDate}
              />
            </div>
          </CardContent>
        </Card>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Sections and Questions</h2>
            <Button
              type="button"
              variant="outline"
              onClick={addSection}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add Section
            </Button>
          </div>

          {/* Automatic A4 Page Grouping */}
          {groupSectionsIntoPages(sections).map((pageSections, pageIndex) => (
            <div
              key={pageIndex}
              className="mb-8 pb-8 border-b border-dashed border-gray-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-xs text-gray-400 font-medium">
                  Page {pageIndex + 1}
                </div>
                <Input
                  type="text"
                  name={`page-name-${pageIndex}`}
                  defaultValue={getPageName(pageIndex)}
                  placeholder={`Page ${pageIndex + 1}`}
                  className="w-72  shadow-none text-sm"
                />
              </div>

              <div className="space-y-4">
                {pageSections.map((section) => {
                  const globalSectionIndex = sections.indexOf(section)
                  return (
                    <Card key={section.id} className="border border-gray-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex  items-center gap-2">
                            <Input
                              name={`section-name-${globalSectionIndex}`}
                              defaultValue={section.name}
                              placeholder="Section name"
                              className="w-full"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                moveSection(globalSectionIndex, 'up')
                              }
                              disabled={globalSectionIndex === 0}
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                moveSection(globalSectionIndex, 'down')
                              }
                              disabled={
                                globalSectionIndex === sections.length - 1
                              }
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeSection(globalSectionIndex)}
                              disabled={sections.length === 1}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <InspectionQuestionsManager
                          sections={sections}
                          setSections={setSections}
                          section={section}
                        />
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}

          {sections.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-12">
              <div className="text-muted-foreground mb-4">
                <PlusCircle className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Sections Added</h3>
              <p className="text-center text-muted-foreground mb-4">
                Add sections to organize your inspection questions
              </p>
              <Button onClick={addSection} className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Add First Section
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/inspections')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create Inspection'}
          </Button>
        </div>
      </form>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inspection Created</DialogTitle>
            <DialogDescription>
              Your inspection &quot;{createdInspection?.name}&quot; has been
              created successfully.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleViewInspection}
              className="sm:flex-1"
            >
              View Inspection
            </Button>
            <Button onClick={handleStartInspection} className="sm:flex-1">
              Start Inspection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
