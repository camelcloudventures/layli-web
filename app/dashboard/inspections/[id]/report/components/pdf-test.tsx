'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download } from 'lucide-react'
import { downloadInspectionPDF } from '../utils/pdf-generator'
import { Inspection } from '../types/inspection-types'
import { toast } from 'sonner'

interface PDFTestProps {
  inspection: Inspection
}

export function PDFTest({ inspection }: PDFTestProps) {
  const handleTestPDF = async () => {
    try {
      toast.info('Generating test PDF...')

      // Generate a test PDF
      downloadInspectionPDF(inspection, {
        filename: `test-inspection-${inspection.id}.pdf`,
      })

      toast.success('Test PDF generated successfully!')
    } catch (error) {
      console.error('Error generating test PDF:', error)
      toast.error('Failed to generate test PDF')
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          PDF Generation Test
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Test the PDF generation functionality with the current inspection
          data.
        </p>
        <Button onClick={handleTestPDF} variant="outline">
          Generate Test PDF
        </Button>
      </CardContent>
    </Card>
  )
}
