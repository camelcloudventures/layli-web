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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Inspection } from '@/lib/types/inspection-types'
import { format } from 'date-fns'
import { Check, X, Download, FileText, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { exportToPdf } from '@/lib/pdf-utils'
import { calculateScore } from '@/lib/score-utils'

interface InspectionReportProps {
  inspection: Inspection
}

export function InspectionReport({ inspection }: InspectionReportProps) {
  const [overallScore, setOverallScore] = useState(0)

  useEffect(() => {
    let totalScore = 0
    let totalQuestions = 0

    inspection.sections.forEach((section) => {
      section.questions.forEach((question) => {
        totalQuestions++
        if (question.response) {
          totalScore += question.score || 0
        }
      })
    })

    const score = totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0
    setOverallScore(Math.round(score))
  }, [inspection])

  const handleDownloadPdf = async () => {
    const element = document.getElementById('inspection-report')
    if (element) {
      await exportToPdf(element, `Inspection_Report_${inspection.id}.pdf`)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-amber-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inspection Report</h1>
        <Button onClick={handleDownloadPdf} className="flex items-center gap-2">
          <Download size={16} />
          <span>Download PDF</span>
        </Button>
      </div>

      <div id="inspection-report" className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{inspection.name}</CardTitle>
                <CardDescription>
                  {format(new Date(inspection.conducted_on), 'PPP')}
                </CardDescription>
              </div>
              <div className="text-right">
                <div
                  className={`text-3xl font-bold ${getScoreColor(
                    overallScore,
                  )}`}
                >
                  {overallScore}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Overall Score
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{inspection.location.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conducted By</p>
                <p className="font-medium">{inspection.user_name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {inspection.sections.map((section, sIndex) => (
          <Card key={sIndex}>
            <CardHeader>
              <CardTitle className="text-lg">{section.name}</CardTitle>
              <CardDescription>
                {calculateScore(section.questions)}% Score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%]">Question</TableHead>
                    <TableHead className="w-[15%]">Response</TableHead>
                    <TableHead className="w-[15%]">Score</TableHead>
                    <TableHead className="w-[20%]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {section.questions.map((question, qIndex) => (
                    <TableRow key={qIndex}>
                      <TableCell>{question.name}</TableCell>
                      <TableCell>
                        {question.response ? (
                          <Check className="text-green-500" />
                        ) : (
                          <X className="text-red-500" />
                        )}
                      </TableCell>
                      <TableCell>{question.score}</TableCell>
                      <TableCell>
                        {question.action && (
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <AlertTriangle size={14} />
                            Action Created
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notes & Attachments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {inspection.sections.flatMap((section, sIndex) =>
              section.questions
                .filter((q) => q.note || q.attachment)
                .map((question, qIndex) => (
                  <div
                    key={`${sIndex}-${qIndex}`}
                    className="space-y-2 border-b pb-4 last:border-0"
                  >
                    <div className="font-medium">{question.name}</div>

                    {question.note && (
                      <div className="text-sm">
                        <span className="font-medium text-muted-foreground">
                          Note:{' '}
                        </span>
                        {question.note}
                      </div>
                    )}

                    {question.attachment && (
                      <div className="flex items-center gap-2 text-sm">
                        <FileText size={16} />
                        <span>Attachment: {question.attachment}</span>
                      </div>
                    )}
                  </div>
                )),
            )}

            {!inspection.sections.some((s) =>
              s.questions.some((q) => q.note || q.attachment),
            ) && (
              <p className="text-muted-foreground text-sm">
                No notes or attachments found
              </p>
            )}
          </CardContent>
          <CardFooter>
            <div className="text-sm text-muted-foreground">
              Generated on {format(new Date(), "PPP 'at' p")}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
