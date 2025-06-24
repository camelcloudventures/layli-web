'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AuditSummaryReport } from './reports/audit-summary-report'
import { ComplianceReport } from './reports/compliance-report'
import { IssuesReport } from './reports/issues-report'
import { exportToPdf } from '@/utils/pdf-utils'

interface ReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reportType: 'auditSummary' | 'compliance' | 'issues'
}

export function ReportDialog({
  open,
  onOpenChange,
  reportType,
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
    if (!reportRef.current) return

    setIsExporting(true)
    try {
      const reportElement = document.getElementById(reportConfig[reportType].id)
      if (reportElement) {
        await exportToPdf(reportElement, reportConfig[reportType].filename)
      }
    } catch (error) {
      console.error('Error exporting report:', error)
    } finally {
      setIsExporting(false)
      onOpenChange(false)
    }
  }

  // Render the appropriate report based on type
  const renderReport = () => {
    switch (reportType) {
      case 'auditSummary':
        return <AuditSummaryReport />
      case 'compliance':
        return <ComplianceReport />
      case 'issues':
        return <IssuesReport />
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {reportConfig[reportType].title} Preview
          </h2>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? 'Exporting...' : 'Export as PDF'}
          </Button>
        </div>
        <div ref={reportRef} className="border rounded-md overflow-hidden">
          {renderReport()}
        </div>
      </DialogContent>
    </Dialog>
  )
}
