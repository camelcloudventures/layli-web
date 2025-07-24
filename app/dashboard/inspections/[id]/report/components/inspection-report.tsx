'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  XCircle,
  Flag,
  FileText,
  Calendar,
  User,
  Download,
} from 'lucide-react'
import { Inspection, InspectionResponse } from '../types/inspection-types'
import { downloadInspectionPDF } from '../utils/pdf-generator'
import { toast } from 'sonner'
import { PDFTest } from './pdf-test'

interface InspectionReportProps {
  inspection: Inspection
}

export function InspectionReport({ inspection }: InspectionReportProps) {
  const [selectedPage, setSelectedPage] = useState(0)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return 'bg-green-100 text-green-800'
      case 'B':
        return 'bg-blue-100 text-blue-800'
      case 'C':
        return 'bg-yellow-100 text-yellow-800'
      case 'D':
        return 'bg-orange-100 text-orange-800'
      case 'F':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getResponseDisplayValue = (response: InspectionResponse) => {
    if (response.text_value) return response.text_value
    if (response.numeric_value !== null && response.numeric_value !== undefined)
      return response.numeric_value.toString()
    if (response.response_value)
      return new Date(response.response_value).toLocaleDateString()
    if (response.selected_options && response.selected_options.length > 0) {
      return response.selected_options.join(', ')
    }
    return 'No response'
  }

  const getQuestionById = (questionId: number) => {
    for (const page of inspection.pages) {
      for (const section of page.sections) {
        const question = section.questions.find((q) => q.id === questionId)
        if (question) return question
      }
    }
    return null
  }

  const getSectionScore = (sectionId: number) => {
    return inspection.section_scores.find(
      (score) => score.section_id === sectionId,
    )
  }

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true)

      // Generate filename based on inspection title and date
      const filename = `inspection-report-${inspection.title.replace(
        /[^a-zA-Z0-9]/g,
        '-',
      )}-${new Date().toISOString().split('T')[0]}.pdf`

      // Download the PDF
      downloadInspectionPDF(inspection, { filename })

      toast.success('PDF downloaded successfully!')
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Failed to generate PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {inspection.title}
          </h1>
          <p className="text-gray-600 mt-1">{inspection.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
          >
            <Download className="w-4 h-4 mr-2" />
            {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
          </Button>
          <Link href="/dashboard/inspections">
            <Button variant="outline">Back to Inspections</Button>
          </Link>
        </div>
      </div>

      {/* PDF Test Component (Development Only) */}
      <PDFTest inspection={inspection} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Final Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">
                {inspection.final_score}%
              </span>
              <Badge className={getGradeColor(inspection.final_grade)}>
                {inspection.final_grade}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {inspection.passed ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className="text-lg font-semibold capitalize">
                {inspection.passed ? 'Passed' : 'Failed'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Violations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm">Critical:</span>
                <span className="font-semibold text-red-600">
                  {inspection.critical_violations}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Major:</span>
                <span className="font-semibold text-orange-600">
                  {inspection.major_violations}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Minor:</span>
                <span className="font-semibold text-yellow-600">
                  {inspection.minor_violations}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Completion Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm">
                {formatDate(inspection.completed_at)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignees */}
      {inspection.assignees.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Assignees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {inspection.assignees.map((assignee) => (
                <Badge key={assignee.id} variant="secondary">
                  {assignee.full_name} ({assignee.role})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Page Navigation */}
      {inspection.pages.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {inspection.pages.map((page, index) => (
                <Button
                  key={page.id}
                  variant={selectedPage === index ? 'default' : 'outline'}
                  onClick={() => setSelectedPage(index)}
                >
                  {page.title}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sections */}
      <div className="space-y-6">
        {inspection.pages[selectedPage]?.sections.map((section) => {
          const sectionScore = getSectionScore(section.id)
          const sectionResponses = inspection.responses.filter((response) => {
            const question = getQuestionById(response.question_id)
            return (
              question && section.questions.some((q) => q.id === question.id)
            )
          })

          return (
            <Card
              key={section.id}
              className={
                sectionResponses.some((r) => r.is_flagged)
                  ? 'border-red-200 bg-red-50'
                  : ''
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {sectionResponses.some((r) => r.is_flagged) && (
                      <Flag className="w-5 h-5 text-red-600" />
                    )}
                    {section.title}
                  </CardTitle>
                  {sectionScore && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Score:</span>
                      <span className="font-semibold">
                        {sectionScore.section_score}%
                      </span>
                      <Badge
                        className={getGradeColor(sectionScore.section_grade)}
                      >
                        {sectionScore.section_grade}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.questions.map((question) => {
                  const response = inspection.responses.find(
                    (r) => r.question_id === question.id,
                  )

                  return (
                    <div
                      key={question.id}
                      className={`p-4 border rounded-lg ${
                        response?.is_flagged
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {question.title}
                          </h4>
                          {question.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {question.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {response?.is_flagged && (
                            <Flag className="w-4 h-4 text-red-600" />
                          )}
                          {response ? (
                            response.points_earned ===
                            response.points_possible ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-sm text-gray-600">
                            {response?.points_earned || 0}/
                            {response?.points_possible || question.points} pts
                          </span>
                        </div>
                      </div>

                      {response && (
                        <div className="space-y-2">
                          <div className="bg-gray-50 p-3 rounded">
                            <span className="text-sm font-medium text-gray-700">
                              Response:
                            </span>
                            <p className="text-sm text-gray-900 mt-1">
                              {getResponseDisplayValue(response)}
                            </p>
                          </div>

                          {response.inspector_notes && (
                            <div className="bg-blue-50 p-3 rounded">
                              <span className="text-sm font-medium text-blue-700">
                                Inspector Notes:
                              </span>
                              <p className="text-sm text-blue-900 mt-1">
                                {response.inspector_notes}
                              </p>
                            </div>
                          )}

                          {response.flag_reason && (
                            <div className="bg-red-50 p-3 rounded">
                              <span className="text-sm font-medium text-red-700">
                                Flag Reason:
                              </span>
                              <p className="text-sm text-red-900 mt-1">
                                {response.flag_reason}
                              </p>
                            </div>
                          )}

                          {response.file_attachments &&
                            response.file_attachments.length > 0 && (
                              <div className="bg-gray-50 p-3 rounded">
                                <span className="text-sm font-medium text-gray-700">
                                  Attachments:
                                </span>
                                <div className="flex gap-2 mt-1">
                                  {response.file_attachments.map(
                                    (attachment, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center gap-1 text-sm text-blue-600"
                                      >
                                        <FileText className="w-3 h-3" />
                                        <span>Attachment {index + 1}</span>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
