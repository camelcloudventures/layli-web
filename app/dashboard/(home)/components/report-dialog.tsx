'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AuditSummaryReport } from './reports/audit-summary-report'
import { ComplianceReport } from './reports/compliance-report'
import { IssuesReport } from './reports/issues-report'
import { exportToPdf } from '@/utils/pdf-utils'
import { toast } from 'sonner'

interface ReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reportType: 'auditSummary' | 'compliance' | 'issues'
  reportData?: {
    auditSummary: {
      totalInspections: number
      completedInspections: number
      pendingInspections: number
      totalIssues: number
      resolvedIssues: number
      recentInspections: Array<{
        id: number
        title: string
        status: string
        date: string
        assignedTo: string
      }>
    }
    issues: {
      totalIssues: number
      resolvedIssues: number
      openIssues: number
      issuesByCategory: Record<string, number>
      criticalIssues: Array<{
        id: string
        title: string
        category: string
        priority: string
        due_at: string
        assignees: Array<{
          id: string
          full_name: string
          email: string
          role: string
        }>
      }>
      topRecurringIssues: Array<{
        title: string
        occurrences: number
      }>
    }
  }
}

export function ReportDialog({
  open,
  onOpenChange,
  reportType,
  reportData,
}: ReportDialogProps) {
  const [isExporting, setIsExporting] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  // Report title and filename mapping
  const reportConfig = {
    auditSummary: {
      title: 'Audit Summary Report',
      filename: 'audit-summary-report.pdf',
      id: 'audit-summary-report',
    },
    compliance: {
      title: 'Compliance Status Report',
      filename: 'compliance-status-report.pdf',
      id: 'compliance-report',
    },
    issues: {
      title: 'Issues Summary Report',
      filename: 'issues-summary-report.pdf',
      id: 'issues-report',
    },
  }

  const handleExport = async () => {
    console.log('Export button clicked for:', reportType)

    if (!reportRef.current) {
      console.error('Report ref is null')
      toast.error('Report content not found')
      return
    }

    setIsExporting(true)
    let loadingToast: string | number | undefined

    try {
      console.log('Starting export process...')

      // Show loading toast
      loadingToast = toast.loading('Generating PDF...')

      // Wait for content to be fully rendered
      console.log('Waiting for content to render...')
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Find the report element by ID
      const reportElement = document.getElementById(reportConfig[reportType].id)
      console.log('Looking for element with ID:', reportConfig[reportType].id)
      console.log('Found element:', reportElement)

      if (!reportElement) {
        console.error('Report element not found:', reportConfig[reportType].id)
        console.log('Available elements with similar IDs:')
        document.querySelectorAll('[id*="report"]').forEach((el) => {
          console.log('-', el.id, el.tagName)
        })
        throw new Error('Report element not found')
      }

      console.log('Report element found:', {
        id: reportElement.id,
        tagName: reportElement.tagName,
        className: reportElement.className,
        offsetWidth: reportElement.offsetWidth,
        offsetHeight: reportElement.offsetHeight,
        innerHTML: reportElement.innerHTML.substring(0, 200) + '...',
      })

      // Export to PDF
      console.log('Calling exportToPdf...')
      await exportToPdf(reportElement, reportConfig[reportType].filename)

      console.log('PDF export completed successfully')

      // Dismiss loading toast and show success
      if (loadingToast) {
        toast.dismiss(loadingToast)
      }
      toast.success('PDF exported successfully!')

      // Close dialog only after successful export
      onOpenChange(false)
    } catch (error) {
      console.error('Export failed:', error)

      // Always dismiss loading toast on error
      if (loadingToast) {
        toast.dismiss(loadingToast)
      }

      // Show specific error message
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred'
      console.error('Error message:', errorMessage)
      toast.error(errorMessage || 'Failed to export PDF. Please try again.')
    } finally {
      console.log('Resetting export state')
      // Always reset the exporting state
      setIsExporting(false)
    }
  }

  // Render the appropriate report based on type
  const renderReport = () => {
    switch (reportType) {
      case 'auditSummary':
        return <AuditSummaryReport data={reportData?.auditSummary} />
      case 'compliance':
        return <ComplianceReport />
      case 'issues':
        return <IssuesReport data={reportData?.issues} />
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" bg-white max-h-[90vh] overflow-y-auto w-full min-w-[800px]">
        <DialogTitle className="sr-only">
          {reportConfig[reportType].title}
        </DialogTitle>
        <div className="flex justify-between  items-center mb-4">
          <h2 className="text-xl font-bold">
            {reportConfig[reportType].title} Preview
          </h2>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="min-w-[120px]"
          >
            {isExporting ? 'Exporting...' : 'Export as PDF'}
          </Button>
        </div>
        <div ref={reportRef} className=" w-full rounded-md overflow-hidden">
          {renderReport()}
        </div>
      </DialogContent>
    </Dialog>
  )
}
