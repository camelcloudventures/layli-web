'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAuth } from '@/lib/context/auth-provider'
import { createInspection } from '../../actions/actions'
import { UserOption } from '@/app/dashboard/schedules/types/schedule-form-types'
import { MultiSelect } from '@/components/ui/multi-select'
import { AuditTemplate, Page, Section } from '@/lib/types/audit-types'
import { PagesManager } from '../../../templates/components/pages-manager'
import { toast } from 'sonner'
import { omit } from 'lodash'
import { PlusCircle, Check } from 'lucide-react'
import SubmitBtn from '@/components/custom/submit-btn'
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'

interface Props {
  sites: { id: string; name: string }[]
  users: UserOption[]
  templates: AuditTemplate[]
}

export function CreateInspectionForm({ sites, users, templates }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [isCreating, setIsCreating] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState('')
  const [assignedTo, setAssignedTo] = useState<string[]>([])
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [
    selectedTemplate,
    setSelectedTemplate,
  ] = useState<AuditTemplate | null>(null)
  const [participateInInspection, setParticipateInInspection] = useState(false)
  const mode = searchParams.get('mode') || 'scratch'
  const isSupervisor = user?.role === 'supervisor'

  const [
    createdInspection,
    setCreatedInspection,
  ] = useState<AuditTemplate | null>(null)

  // Generate unique IDs for the cover page and section
  const coverPageId = Date.now()
  const coverSectionId = Date.now() + 1

  // Create the cover section
  const coverSection: Section = {
    id: coverSectionId,
    page_id: coverPageId,
    title: 'General Information',
    ordinal: 1,
    questions: [],
    created_at: new Date().toISOString(),
  }

  // Create the first page with the cover section
  const firstPage: Page = {
    id: coverPageId,
    template_id: coverPageId,
    title: 'Inspection Details',
    description: 'Add inspection details here',
    ordinal: 1,
    sections: [coverSection],
    created_at: new Date().toISOString(),
    photo: '',
  }

  const [template, setTemplate] = useState<AuditTemplate>({
    id: Date.now(),
    title: '',
    description: '',
    pages: [firstPage],
    created_at: new Date().toISOString(),
    photo: '',
    created_by: user?.id || null,
  })

  useEffect(() => {
    if (selectedTemplate) {
      setTemplate((prev) => ({
        ...prev,
        title: selectedTemplate.title,
      }))
    }
  }, [selectedTemplate])

  const addSection = () => {
    const newSection: Section = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      page_id: template.pages[0].id,
      title: `Section ${template.pages.flatMap((p) => p.sections).length + 1}`,
      ordinal: template.pages.flatMap((p) => p.sections).length + 1,
      questions: [],
      created_at: new Date().toISOString(),
    }

    setTemplate((prev) => ({
      ...prev,
      pages: [
        {
          ...prev.pages[0],
          sections: [...prev.pages[0].sections, newSection],
        },
        ...prev.pages.slice(1),
      ],
    }))
  }

  async function handleSubmit(formData: FormData) {
    setIsCreating(true)
    try {
      // Add current user to assignees if participating
      const finalAssignees = [...assignedTo]
      if (participateInInspection && user?.id) {
        if (!finalAssignees.includes(user.id)) {
          finalAssignees.push(user.id)
        }
      }

      const inspectionData = {
        title:
          mode === 'template' && selectedTemplate
            ? selectedTemplate.title
            : (formData.get('inspection-name') as string),
        description: `Inspection for ${
          sites.find((s) => s.id === selectedLocation)?.name
        }`,
        assignee_ids: finalAssignees,
        site_id: selectedLocation,
        prepared_by: user?.id || '',
        due_date: formData.get('scheduled-date'),
      }

      if (mode === 'template' && selectedTemplate) {
        // If using template, just send template_id
        Object.assign(inspectionData, {
          template_id: selectedTemplate.id,
        })
      } else {
        // If creating from scratch, send pages data
        const updatePages = template.pages.map((page) => ({
          ...omit(page, ['id', 'template_id']),
          sections: page.sections.map((section) => ({
            ...omit(section, ['id']),
            questions: section.questions.map((question) => ({
              ...omit(question, ['id']),
              response_options:
                question.response_options?.map((option) =>
                  omit(option, ['id', 'question_id']),
                ) ?? [],
            })),
          })),
        }))
        Object.assign(inspectionData, {
          pages: updatePages,
        })
      }

      const result = await createInspection(inspectionData)

      if (result && 'error' in result) {
        toast.error(String(result.error))
        return
      }

      // Set the created inspection for the success dialog
      setCreatedInspection(result.data)
      setShowSuccessDialog(true)
    } catch (error) {
      console.error('Error creating inspection:', error)
      toast.error('Failed to create inspection')
    } finally {
      setIsCreating(false)
    }
  }

  const handleViewInspection = () => {
    if (createdInspection) {
      router.push(`/dashboard/inspections/${createdInspection.id}/report`)
    }
    setShowSuccessDialog(false)
  }

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
                value={template.title}
                onChange={(e) =>
                  setTemplate((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter inspection name"
                disabled={mode === 'template' && !!selectedTemplate}
              />
            </div>

            <div className="flex items-center justify-between gap-8 mb-6">
              <span className="w-full">
                <Label htmlFor="location">Location</Label>
                <Select
                  name="location"
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                  required
                >
                  <SelectTrigger className="w-full" id="location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {sites.map((location) => (
                      <SelectItem key={location.id} value={String(location.id)}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </span>

              <span className="w-full">
                <Label htmlFor="assigned-to">Assign To</Label>
                <MultiSelect
                  name="assignee_ids"
                  required
                  value={assignedTo}
                  onValueChange={setAssignedTo}
                  placeholder="Select assignees"
                  options={users.map((user) => ({
                    value: user.user.id,
                    label: user.user.full_name,
                  }))}
                />
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
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>

            {isSupervisor && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="participate"
                  checked={participateInInspection}
                  onCheckedChange={(checked) =>
                    setParticipateInInspection(checked as boolean)
                  }
                />
                <label
                  htmlFor="participate"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Participate in inspection
                </label>
              </div>
            )}
          </CardContent>
        </Card>

        {mode === 'template' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Select Template</CardTitle>
              <CardDescription>
                Choose a template to use for this inspection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {templates.map((t) => (
                  <div
                    key={t.id}
                    className={`flex items-center space-x-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate?.id === t.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedTemplate(t)}
                  >
                    {t.photo && (
                      <div className="relative w-24 h-24">
                        <Image
                          src={t.photo}
                          alt={t.title}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{t.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t.description}
                      </p>
                    </div>
                    {selectedTemplate?.id === t.id && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {mode === 'scratch' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pages & Questions</CardTitle>
            </CardHeader>
            <CardContent>
              {template.pages.map((page, pageIndex) => (
                <div
                  key={page.id}
                  className="mb-8 pb-8 border-b border-dashed border-gray-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-xs text-gray-400 font-medium">
                      Page {pageIndex + 1}
                    </div>
                  </div>
                  <PagesManager template={template} setTemplate={setTemplate} />
                </div>
              ))}

              {template.pages.flatMap((p) => p.sections).length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-12">
                  <div className="text-muted-foreground mb-4">
                    <PlusCircle className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    No Sections Added
                  </h3>
                  <p className="text-center text-muted-foreground mb-4">
                    Add sections to organize your inspection questions
                  </p>
                  <Button
                    onClick={addSection}
                    className="flex items-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add First Section
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end space-x-2 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/inspections')}
          >
            Cancel
          </Button>
          <SubmitBtn
            label="Create Inspection"
            className=""
            variant="default"
            isDisabled={
              isCreating ||
              !template.title ||
              !selectedLocation ||
              !assignedTo.length ||
              (mode === 'template' && !selectedTemplate)
            }
          />
        </div>
      </form>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inspection Created</DialogTitle>
            <DialogDescription>
              Your inspection &quot;{createdInspection?.title}&quot; has been
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
            {participateInInspection && (
              <Button onClick={handleStartInspection} className="sm:flex-1">
                Start Inspection
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
