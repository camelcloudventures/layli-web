import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// Function to force black and white colors for PDF export
function forceBlackAndWhite(element: HTMLElement) {
  const originalStyles: { [key: string]: string } = {}

  try {
    // Get all elements in the report
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_ELEMENT,
      null,
    )

    const elements: HTMLElement[] = []
    let node
    while ((node = walker.nextNode())) {
      elements.push(node as HTMLElement)
    }

    // Force black and white colors
    elements.forEach((el) => {
      const properties = [
        'color',
        'background-color',
        'border-color',
        'fill',
        'stroke',
      ]

      properties.forEach((prop) => {
        // Store original style
        const originalValue = el.style.getPropertyValue(prop)
        originalStyles[`${el.tagName}-${prop}`] = originalValue

        // Force black and white
        if (prop === 'color') {
          el.style.setProperty(prop, '#000000', 'important') // Black text
        } else if (prop === 'background-color') {
          el.style.setProperty(prop, '#ffffff', 'important') // White background
        } else if (prop === 'border-color') {
          el.style.setProperty(prop, '#000000', 'important') // Black borders
        } else {
          el.style.setProperty(prop, '#000000', 'important') // Black for other properties
        }
      })
    })

    return originalStyles
  } catch (error) {
    console.warn('Error forcing black and white colors:', error)
    return originalStyles
  }
}

// Function to restore original styles
function restoreOriginalStyles(
  element: HTMLElement,
  originalStyles: { [key: string]: string },
) {
  try {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_ELEMENT,
      null,
    )

    const elements: HTMLElement[] = []
    let node
    while ((node = walker.nextNode())) {
      elements.push(node as HTMLElement)
    }

    elements.forEach((el) => {
      const properties = [
        'color',
        'background-color',
        'border-color',
        'fill',
        'stroke',
      ]

      properties.forEach((prop) => {
        const key = `${el.tagName}-${prop}`
        if (originalStyles[key] !== undefined) {
          if (originalStyles[key]) {
            el.style.setProperty(prop, originalStyles[key], 'important')
          } else {
            el.style.removeProperty(prop)
          }
        }
      })
    })
  } catch (error) {
    console.warn('Error restoring original styles:', error)
  }
}

export async function exportToPdf(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  let originalStyles: { [key: string]: string } = {}

  try {
    console.log(`Starting PDF generation for ${element.id}...`)

    // Validate element
    if (!element) {
      throw new Error('Element is null or undefined')
    }

    if (!element.offsetWidth || !element.offsetHeight) {
      throw new Error(
        'Element has no dimensions - it may not be visible or rendered',
      )
    }

    console.log('Element validation passed:', {
      id: element.id,
      offsetWidth: element.offsetWidth,
      offsetHeight: element.offsetHeight,
    })

    // Wait a bit to ensure the element is fully rendered
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Force black and white colors
    console.log('Forcing black and white colors...')
    originalStyles = forceBlackAndWhite(element)

    // Capture the element with html2canvas
    console.log('Starting html2canvas capture...')
    const canvas = await html2canvas(element, {
      scale: 1,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: true,
      foreignObjectRendering: false,
      imageTimeout: 10000,
      removeContainer: true,
    })

    console.log('Canvas capture completed:', {
      width: canvas.width,
      height: canvas.height,
    })

    // Validate canvas
    if (!canvas.width || !canvas.height) {
      throw new Error('Canvas capture failed - no dimensions')
    }

    // Convert to image data
    console.log('Converting canvas to image data...')
    const imgData = canvas.toDataURL('image/png', 0.8)

    if (!imgData || imgData === 'data:,') {
      throw new Error('Failed to convert canvas to image data')
    }

    console.log('Image data created successfully, length:', imgData.length)

    // Create PDF
    console.log('Creating PDF document...')
    const pdf = new jsPDF('p', 'mm', 'a4')

    // Calculate dimensions
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    console.log('PDF dimensions calculated:', {
      imgWidth,
      imgHeight,
      pageHeight,
    })

    // Add image to first page
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

    // Add additional pages if needed
    let heightLeft = imgHeight - pageHeight
    let pageNumber = 1

    while (heightLeft > 0) {
      pageNumber++
      console.log(`Adding page ${pageNumber}...`)

      pdf.addPage()
      const position = heightLeft - imgHeight
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Save the PDF
    console.log('Saving PDF...')
    pdf.save(filename)

    console.log(
      `PDF ${filename} generated successfully with ${pageNumber} page(s)`,
    )
    return Promise.resolve()
  } catch (error) {
    console.log('PDF generation failed:', error)

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('html2canvas')) {
        throw new Error(
          'Failed to capture the report content. Please try again.',
        )
      } else if (error.message.includes('canvas')) {
        throw new Error('Failed to process the report image. Please try again.')
      } else if (error.message.includes('PDF')) {
        throw new Error('Failed to create the PDF file. Please try again.')
      }
    }

    throw new Error('PDF generation failed. Please try again.')
  } finally {
    // Always restore original styles
    if (Object.keys(originalStyles).length > 0) {
      console.log('Restoring original styles...')
      restoreOriginalStyles(element, originalStyles)
    }
  }
}
