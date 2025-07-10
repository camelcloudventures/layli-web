'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createTemplate } from '../../actions/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { PagesManager } from '../../components/pages-manager'
import { toast } from 'sonner'
import { TemplatePreview } from '../../components/template-preview'
import Image from 'next/image'
import { useAuth } from '@/lib/context/auth-provider'
import { AuditTemplate } from '@/lib/types/audit-types'
import { omit } from 'lodash'
import SubmitBtn from '@/components/custom/submit-btn'
import { getPreloadedQuestions } from '@/components/template-cover-page/template-cover-page'

export default function CreateAuditForm() {
  const router = useRouter()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('details')

  // Generate unique IDs for the cover page and section
  const coverPageId = `cover-page-${Date.now()}`
  const coverSectionId = `cover-section-${Date.now()}`

  // Create the cover section
  const coverSection = {
    id: coverSectionId,
    page_id: coverPageId,
    title: 'Title section',
    ordinal: 1,
    questions: getPreloadedQuestions(coverPageId, coverSectionId),
  }

  // Create the first page with the cover section
  const firstPage = {
    id: coverPageId,
    template_id: `temp-${Date.now()}`,
    title: 'Title page',
    description: 'Add a description here',
    ordinal: 1,
    sections: [coverSection],
  }

  const [template, setTemplate] = useState<AuditTemplate>({
    id: `temp-${Date.now()}`,
    title: '',
    description: '',
    photo: '',
    pages: [firstPage],
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageError, setImageError] = useState<string | null>(null)

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setTemplate((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setImageError('Image must be 2MB or less.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    setImageError(null)
    const reader = new FileReader()
    reader.onload = (event) => {
      setTemplate((prev) => ({
        ...prev,
        photo: (event.target?.result ?? '') as string,
      }))
    }
    reader.readAsDataURL(file)
  }

  function handleRemoveImage() {
    setTemplate((prev) => ({ ...prev, photo: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleTriggerFileInput() {
    fileInputRef.current?.click()
  }

  function handleGeneratePlaceholder() {
    // You can replace this with a real placeholder generator if needed
    setTemplate((prev) => ({
      ...prev,
      photo: 'https://placehold.co/600x400?text=Audit+Template',
    }))
  }

  async function handleSubmit(formData: FormData) {
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

    try {
      formData.set('title', template.title ?? '')
      formData.set('description', template.description ?? '')
      formData.set('photo', template.photo ?? '')
      formData.set('pages', JSON.stringify(updatePages))

      const createdBy = user?.id ?? ''
      const result = await createTemplate(formData, createdBy)
      console.log('result', result)
      if (result && result.error) {
        toast.error(result.error)
        return
      }
      if (result && 'success' in result) {
        toast.success(String(result.success))
        router.push('/dashboard/templates')
      }
    } catch (error) {
      console.error('Error creating template:', error)
      toast.error('Failed to create template')
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="details">Template Details</TabsTrigger>
        <TabsTrigger
          value="pages"
          disabled={!template.title || !template.description}
        >
          Pages & Questions
        </TabsTrigger>
        <TabsTrigger value="preview" disabled={template.pages.length === 0}>
          Preview
        </TabsTrigger>
      </TabsList>

      <TabsContent value="details">
        <Card>
          <CardHeader>
            <CardTitle>Template Details</CardTitle>
            <CardDescription>
              Define the basic information about your audit template
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Template Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Workplace Safety Audit"
                value={template.title}
                onChange={handleInputChange}
                required
                aria-label="Template Title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide a brief description of this audit template's purpose"
                value={template.description}
                onChange={handleInputChange}
                aria-label="Description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photo">Cover Image</Label>
              <div className="border rounded-xl p-6 flex flex-col items-center justify-center min-h-[200px] w-full">
                {imageError && (
                  <span className="text-red-600 text-sm font-semibold mb-2">
                    {imageError}
                  </span>
                )}
                {template.photo ? (
                  <>
                    <Image
                      width={100}
                      height={100}
                      src={template.photo}
                      alt="Cover Preview"
                      className="w-full max-w-3xl h-72 object-contain rounded mb-4"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemoveImage}
                      >
                        Remove
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleTriggerFileInput}
                      >
                        Change
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center">
                      <svg
                        width="64"
                        height="64"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="text-muted-foreground mb-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zm16 0l-4.586 4.586a2 2 0 01-2.828 0L7 7"
                        />
                      </svg>
                      <span className="text-muted-foreground mb-4">
                        Select a cover image for the template
                      </span>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleTriggerFileInput}
                        >
                          <span className="mr-2">&#8682;</span> Upload
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleGeneratePlaceholder}
                        >
                          <span className="mr-2">&#128444;</span> Generate
                          Placeholder
                        </Button>
                      </div>
                    </div>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  tabIndex={-1}
                  aria-label="Upload cover image"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => setActiveTab('pages')}
                disabled={!template.title}
                aria-label="Continue to Pages"
              >
                Continue to Pages
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="pages">
        <Card>
          <CardHeader>
            <CardTitle>Pages & Questions</CardTitle>
            <CardDescription>
              Build the structure of your audit template
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PagesManager template={template} setTemplate={setTemplate} />
            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab('details')}
                aria-label="Back to Details"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={() => setActiveTab('preview')}
                aria-label="Continue to Preview"
                disabled={template.pages.length === 0}
              >
                Continue to Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="preview">
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              Preview how your audit template will appear to users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TemplatePreview template={template} />
            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab('pages')}
                aria-label="Back to Pages"
              >
                Back
              </Button>
              <form action={handleSubmit}>
                <SubmitBtn
                  label="Create Template"
                  variant="default"
                  className="w-full"
                />
              </form>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
