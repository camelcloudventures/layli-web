import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function exportToPdf(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  try {
    // Show loading toast or indicator
    console.log(`Generating PDF for ${element.id}...`)

    // Use html2canvas to capture the element as an image
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Enable CORS for images
      logging: false,
      backgroundColor: '#ffffff',
    })

    // Calculate dimensions to maintain aspect ratio
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // Create PDF document
    const pdf = new jsPDF('p', 'mm', 'a4')
    let position = 0

    // Add image to PDF (potentially across multiple pages)
    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      0,
      position,
      imgWidth,
      imgHeight,
    )

    // If the content is longer than one page, add additional pages
    let heightLeft = imgHeight - pageHeight
    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight,
      )
      heightLeft -= pageHeight
    }

    // Save the PDF
    pdf.save(filename)

    console.log(`PDF ${filename} generated successfully`)
    return Promise.resolve()
  } catch (error) {
    console.error('Error generating PDF:', error)
    return Promise.reject(error)
  }
}
