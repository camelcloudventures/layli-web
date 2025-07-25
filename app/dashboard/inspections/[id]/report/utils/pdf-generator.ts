import jsPDF from 'jspdf'
import { Inspection } from '../types/inspection-types'

interface PDFOptions {
  title?: string
  filename?: string
}

export function generateInspectionPDF(
  inspection: Inspection,
  options: PDFOptions = {},
) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const contentWidth = pageWidth - margin * 2
  let yPosition = margin

  // Helper function to add text with word wrapping
  const addWrappedText = (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    fontSize: number = 12,
  ) => {
    doc.setFontSize(fontSize)
    const lines = doc.splitTextToSize(text, maxWidth)
    doc.text(lines, x, y)
    return lines.length * (fontSize * 0.4) // Return height used
  }

  // Helper function to add section header
  const addSectionHeader = (text: string, y: number) => {
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(text, margin, y)
    doc.setFont('helvetica', 'normal')
    return y + 10
  }

  // Helper function to add subsection
  const addSubsection = (text: string, y: number) => {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(text, margin + 10, y)
    doc.setFont('helvetica', 'normal')
    return y + 8
  }

  // Helper function to add key-value pair
  const addKeyValue = (key: string, value: string | number, y: number) => {
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(`${key}:`, margin + 10, y)
    doc.setFont('helvetica', 'normal')
    const valueX = margin + 50
    const valueWidth = contentWidth - 40
    const heightUsed = addWrappedText(String(value), valueX, y, valueWidth, 12)
    return y + Math.max(heightUsed, 8)
  }

  // Title
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('Inspection Report', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 15

  // Inspection Title
  doc.setFontSize(18)
  doc.text(inspection.title, pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 12

  // Description
  if (inspection.description) {
    doc.setFontSize(12)
    doc.setFont('helvetica', 'italic')
    const descHeight = addWrappedText(
      inspection.description,
      margin,
      yPosition,
      contentWidth,
      12,
    )
    yPosition += descHeight + 10
    doc.setFont('helvetica', 'normal')
  }

  // Summary Section
  yPosition = addSectionHeader('Inspection Summary', yPosition)

  // Basic Info
  yPosition = addKeyValue(
    'Final Score',
    `${inspection.final_score}%`,
    yPosition,
  )
  yPosition = addKeyValue('Final Grade', inspection.final_grade, yPosition)
  yPosition = addKeyValue(
    'Status',
    inspection.passed ? 'Passed' : 'Failed',
    yPosition,
  )
  yPosition = addKeyValue(
    'Completion Date',
    new Date(inspection.completed_at).toLocaleDateString(),
    yPosition,
  )

  // Violations
  yPosition = addKeyValue(
    'Critical Violations',
    inspection.critical_violations,
    yPosition,
  )
  yPosition = addKeyValue(
    'Major Violations',
    inspection.major_violations,
    yPosition,
  )
  yPosition = addKeyValue(
    'Minor Violations',
    inspection.minor_violations,
    yPosition,
  )

  // Assignees
  if (inspection.assignees.length > 0) {
    yPosition += 5
    yPosition = addSubsection('Assignees', yPosition)
    inspection.assignees.forEach((assignee) => {
      const assigneeText = `${assignee.full_name} (${assignee.role}) - ${assignee.email}`
      const heightUsed = addWrappedText(
        assigneeText,
        margin + 20,
        yPosition,
        contentWidth - 20,
        10,
      )
      yPosition += heightUsed + 2
    })
  }

  yPosition += 10

  // Check if we need a new page
  if (yPosition > doc.internal.pageSize.getHeight() - 50) {
    doc.addPage()
    yPosition = margin
  }

  // Sections
  yPosition = addSectionHeader('Detailed Results', yPosition)

  inspection.pages.forEach((page, pageIndex) => {
    // Check if we need a new page
    if (yPosition > doc.internal.pageSize.getHeight() - 100) {
      doc.addPage()
      yPosition = margin
    }

    // Page header
    yPosition = addSubsection(`Page ${pageIndex + 1}: ${page.title}`, yPosition)

    page.sections.forEach((section) => {
      // Check if we need a new page
      if (yPosition > doc.internal.pageSize.getHeight() - 80) {
        doc.addPage()
        yPosition = margin
      }

      // Section header
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(`Section: ${section.title}`, margin + 20, yPosition)
      yPosition += 8

      // Section score
      const sectionScore = inspection.section_scores.find(
        (score) => score.section_id === section.id,
      )
      if (sectionScore) {
        doc.setFont('helvetica', 'normal')
        doc.text(
          `Score: ${sectionScore.section_score}% (Grade: ${sectionScore.section_grade})`,
          margin + 20,
          yPosition,
        )
        yPosition += 8
      }

      // Questions
      section.questions.forEach((question) => {
        // Check if we need a new page
        if (yPosition > doc.internal.pageSize.getHeight() - 60) {
          doc.addPage()
          yPosition = margin
        }

        const response = inspection.responses.find(
          (r) => r.question_id === question.id,
        )

        // Question title
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        const questionText = `Q${question.id}: ${question.title}`
        const questionHeight = addWrappedText(
          questionText,
          margin + 30,
          yPosition,
          contentWidth - 30,
          10,
        )
        yPosition += questionHeight + 2

        // Question description
        if (question.description) {
          doc.setFont('helvetica', 'italic')
          const descHeight = addWrappedText(
            question.description,
            margin + 30,
            yPosition,
            contentWidth - 30,
            9,
          )
          yPosition += descHeight + 2
          doc.setFont('helvetica', 'normal')
        }

        // Response
        if (response) {
          doc.setFontSize(9)

          // Response value
          let responseText = 'Response: '
          if (response.text_value) {
            responseText += response.text_value
          } else if (
            response.numeric_value !== null &&
            response.numeric_value !== undefined
          ) {
            responseText += response.numeric_value.toString()
          } else if (response.response_value) {
            responseText += new Date(
              response.response_value,
            ).toLocaleDateString()
          } else if (
            response.selected_options &&
            response.selected_options.length > 0
          ) {
            responseText += response.selected_options.join(', ')
          } else {
            responseText += 'No response'
          }

          const responseHeight = addWrappedText(
            responseText,
            margin + 30,
            yPosition,
            contentWidth - 30,
            9,
          )
          yPosition += responseHeight + 2

          // Points
          doc.text(
            `Points: ${response.points_earned}/${response.points_possible}`,
            margin + 30,
            yPosition,
          )
          yPosition += 5

          // Status indicator
          if (response.is_flagged) {
            doc.setTextColor(255, 0, 0)
            doc.text('⚠ FLAGGED', margin + 30, yPosition)
            yPosition += 5
            doc.setTextColor(0, 0, 0)
          } else if (response.points_earned === response.points_possible) {
            doc.setTextColor(0, 128, 0)
            doc.text('✓ PASSED', margin + 30, yPosition)
            yPosition += 5
            doc.setTextColor(0, 0, 0)
          } else {
            doc.setTextColor(255, 0, 0)
            doc.text('✗ FAILED', margin + 30, yPosition)
            yPosition += 5
            doc.setTextColor(0, 0, 0)
          }

          // Inspector notes
          if (response.inspector_notes) {
            doc.setFont('helvetica', 'italic')
            const notesHeight = addWrappedText(
              `Notes: ${response.inspector_notes}`,
              margin + 30,
              yPosition,
              contentWidth - 30,
              9,
            )
            yPosition += notesHeight + 2
            doc.setFont('helvetica', 'normal')
          }

          // Flag reason
          if (response.flag_reason) {
            doc.setTextColor(255, 0, 0)
            const flagHeight = addWrappedText(
              `Flag Reason: ${response.flag_reason}`,
              margin + 30,
              yPosition,
              contentWidth - 30,
              9,
            )
            yPosition += flagHeight + 2
            doc.setTextColor(0, 0, 0)
          }

          // File attachments
          if (
            response.file_attachments &&
            response.file_attachments.length > 0
          ) {
            doc.text(
              `Attachments: ${response.file_attachments.length} file(s)`,
              margin + 30,
              yPosition,
            )
            yPosition += 5
          }
        } else {
          doc.setFontSize(9)
          doc.setTextColor(128, 128, 128)
          doc.text('No response recorded', margin + 30, yPosition)
          yPosition += 5
          doc.setTextColor(0, 0, 0)
        }

        yPosition += 3
      })

      yPosition += 5
    })

    yPosition += 5
  })

  // Footer
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.setTextColor(128, 128, 128)
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' },
    )
    doc.text(
      `Generated on ${new Date().toLocaleDateString()}`,
      margin,
      doc.internal.pageSize.getHeight() - 10,
    )
  }

  // Generate filename
  const filename =
    options.filename ||
    `inspection-report-${inspection.title.replace(/[^a-zA-Z0-9]/g, '-')}-${
      new Date().toISOString().split('T')[0]
    }.pdf`

  return { doc, filename }
}

export function downloadInspectionPDF(
  inspection: Inspection,
  options: PDFOptions = {},
) {
  const { doc, filename } = generateInspectionPDF(inspection, options)
  doc.save(filename)
}
