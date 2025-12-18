import { pdf } from "@react-pdf/renderer";
import { InspectionPDFReport } from "../components/react-pdf-report";
import { Inspection } from "../types/inspection-types";

interface PDFOptions {
  filename?: string;
}

/**
 * Generates a PDF blob from inspection data
 */
export async function generateReactPDFBlob(
  inspection: Inspection,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions: any[] = []
): Promise<Blob> {
  const doc = InspectionPDFReport({ inspection, actions });
  const blob = await pdf(doc).toBlob();
  return blob;
}

/**
 * Downloads a PDF file generated from inspection data
 */
export async function downloadReactPDF(
  inspection: Inspection,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions: any[] = [],
  options: PDFOptions = {}
): Promise<void> {
  try {
    // Generate filename based on inspection title and date
    const filename =
      options.filename ||
      `inspection-report-${inspection.title.replace(/[^a-zA-Z0-9]/g, "-")}-${
        new Date().toISOString().split("T")[0]
      }.pdf`;

    // Generate PDF blob
    const blob = await generateReactPDFBlob(inspection, actions);

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF. Please try again.");
  }
}

/**
 * Opens the PDF in a new window/tab
 */
export async function openReactPDFInNewTab(
  inspection: Inspection,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions: any[] = []
): Promise<void> {
  try {
    // Generate PDF blob
    const blob = await generateReactPDFBlob(inspection, actions);

    // Create object URL and open in new tab
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");

    // Cleanup after a delay to ensure the tab opens
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  } catch (error) {
    console.error("Error opening PDF:", error);
    throw new Error("Failed to open PDF. Please try again.");
  }
}
