'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getInspectionById } from '@/lib/data/mock-inspections'
import type { Inspection } from '@/lib/types/inspection-types'
import { ArrowLeft, Download, CheckCircle, XCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { exportToPdf } from '@/lib/pdf-utils'
import { toast } from 'sonner'
import Image from 'next/image'

export default function InspectionReportPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [inspection, setInspection] = useState<Inspection | null>(null)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchInspection = async () => {
      try {
        const { id } = await params
        const data = await getInspectionById(id)
        if (data) {
          setInspection(data)
        } else {
          toast.error('Inspection not found')
          router.push('/dashboard/inspections')
        }
      } catch (error) {
        console.error('Error fetching inspection:', error)
        toast.error('Failed to load inspection')
      } finally {
        setLoading(false)
      }
    }

    fetchInspection()
  }, [params, router, toast])

  const handleDownloadReport = async () => {
    if (!reportRef.current || !inspection) return

    setIsGeneratingPdf(true)
    toast.info('Generating PDF')

    try {
      const filename = `${inspection.title.replace(/\s+/g, '_')}_Report_${
        new Date().toISOString().split('T')[0]
      }.pdf`
      await exportToPdf(reportRef.current, filename)

      toast.success('Download Complete')
    } catch (error) {
      console.error('PDF generation error:', error)
      toast.error('Download Failed')
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  // Safe date formatting function
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A'

    try {
      // Try to parse the date string
      const date = new Date(dateString)

      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid Date'
      }

      return format(date, 'PPP')
    } catch (error) {
      console.error('Date formatting error:', error)
      return 'Invalid Date'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Skeleton className="h-10 w-10 mr-4" />
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-2 h-4 w-64" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!inspection || inspection.status !== 'completed') {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            {!inspection
              ? 'Inspection not found'
              : 'This inspection has not been completed yet'}
          </p>
          <Button
            onClick={() => router.push('/dashboard/inspections')}
            className="mt-4"
          >
            Back to Inspections
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Count issues by response
  //@ts-expect-error - sections is not typed
  const issueCount = inspection.sections.reduce((count, section) => {
    //@ts-expect-error - questions is not typed
    return count + section.questions.filter((q) => q.response === false).length
  }, 0)

  // Count actions
  //@ts-expect-error - sections is not typed
  const actionCount = inspection.sections.reduce((count, section) => {
    //@ts-expect-error - questions is not typed
    return count + section.questions.filter((q) => q.action !== null).length
  }, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/inspections')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {inspection.title} Report
            </h1>
            <p className="text-muted-foreground">
              {/* @ts-expect-error - location is not typed */}
              {inspection.location?.name || 'N/A'}
            </p>
          </div>
        </div>
        <Button onClick={handleDownloadReport} disabled={isGeneratingPdf}>
          <Download className="mr-2 h-4 w-4" />
          {isGeneratingPdf ? 'Generating...' : 'Download PDF'}
        </Button>
      </div>

      <div ref={reportRef} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Inspection Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Conducted On
                </p>
                <p className="text-lg font-semibold">
                  {formatDate(inspection.created_at?.toString())}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Completed On
                </p>
                <p className="text-lg font-semibold">
                  {formatDate(inspection.completed_at?.toString())}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Inspector
                </p>
                <p className="text-lg font-semibold">
                  {/* @ts-expect-error - user is not typed */}
                  {inspection.user?.first_name || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Score
                </p>
                <p
                  className={`text-lg font-semibold ${
                    //@ts-expect-error - score is not typed
                    (inspection.score ?? 0) >= 80
                      ? 'text-green-600'
                      : //@ts-expect-error - score is not typed
                      (inspection.score ?? 0) >= 60
                      ? 'text-amber-600'
                      : 'text-red-600'
                  }`}
                >
                  {/* @ts-expect-error - score is not typed */}
                  {inspection.score}%
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Issues Found
                </p>
                <p className="text-lg font-semibold">{issueCount}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Actions Created
                </p>
                <p className="text-lg font-semibold">{actionCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* @ts-expect-error - sections is not typed */}
        {inspection.sections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle>{section.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* @ts-expect-error - questions is not typed */}
                {section.questions.map((question) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-medium">
                            {question.name}
                          </h3>
                          {question.response !== null && (
                            <Badge
                              variant={
                                question.response ? 'outline' : 'destructive'
                              }
                              className="ml-2"
                            >
                              {question.response ? 'Pass' : 'Fail'}
                            </Badge>
                          )}
                        </div>

                        {question.note && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-muted-foreground">
                              Notes:
                            </p>
                            <p className="text-sm mt-1">{question.note}</p>
                          </div>
                        )}

                        {question.attachment && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                              Attachment:
                            </p>
                            <Image
                              src={question.attachment || '/placeholder.png'}
                              alt="Inspection attachment"
                              className="max-h-40 rounded-md border"
                              crossOrigin="anonymous"
                            />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        {question.response !== null &&
                          (question.response ? (
                            <CheckCircle className="h-6 w-6 text-green-500" />
                          ) : (
                            <XCircle className="h-6 w-6 text-red-500" />
                          ))}
                      </div>
                    </div>

                    {question.action && (
                      <>
                        <Separator className="my-4" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Action Required:
                          </p>
                          <div className="mt-2 border-l-4 border-amber-500 pl-4">
                            <h4 className="font-medium">
                              {question.action.title}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-sm">
                              <div>
                                <span className="font-medium">Priority:</span>{' '}
                                <Badge
                                  variant={
                                    question.action.priority === 'high'
                                      ? 'destructive'
                                      : question.action.priority === 'medium'
                                      ? 'default'
                                      : 'outline'
                                  }
                                >
                                  {question.action.priority}
                                </Badge>
                              </div>
                              <div>
                                <span className="font-medium">Due Date:</span>{' '}
                                {question.action.dueDate
                                  ? formatDate(
                                      question.action.dueDate.toISOString(),
                                    )
                                  : 'N/A'}
                              </div>
                              <div>
                                <span className="font-medium">Assignee:</span>{' '}
                                {question.action.assignee || 'Unassigned'}
                              </div>
                              <div>
                                <span className="font-medium">Location:</span>{' '}
                                {question.action.location?.name || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
