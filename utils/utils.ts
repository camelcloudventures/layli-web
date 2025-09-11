import { Issue } from "@/lib/types";
import jsPDF from "jspdf";

export function extractTokens(url: string) {
  // Create a URL object (works in modern browsers and Node.js)
  const u = new URL(url);

  // 1) Try to parse fragment (everything after '#')
  const hashParams = new URLSearchParams(
    u.hash.startsWith("#") ? u.hash.slice(1) : ""
  );

  // 2) Parse query parameters (in case tokens were in ?token=… form)
  const queryParams = u.searchParams;

  // Helper to look in fragment first, then query
  const getParam = (name: string) =>
    hashParams.get(name) ?? queryParams.get(name);

  return {
    accessToken: getParam("access_token"),
    refreshToken: getParam("refresh_token"),
  };
}

export const getFrequencyColor = (frequency: string) => {
  switch (frequency) {
    case "daily":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "weekly":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "monthly":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    case "yearly":
      return "bg-amber-100 text-amber-800 hover:bg-amber-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "paused":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-100";
    case "inactive":
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

export function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export const generatePDF = (issue: Issue) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(20);
  doc.text(`Issue: ${issue.title || "Untitled"}`, 20, 20);

  // Add metadata
  doc.setFontSize(12);
  doc.text(`ID: ${issue.id}`, 20, 30);
  doc.text(`Status: ${issue.status}`, 20, 40);
  doc.text(`Priority: ${issue.priority}`, 20, 50);
  doc.text(`Category: ${issue.category}`, 20, 60);

  // Add reporter info - handle both string and object formats
  const reporterName =
    typeof issue.reporter === "object"
      ? issue.reporter?.full_name || "Unknown"
      : issue.reporter || "Unknown";
  doc.text(`Reported by: ${reporterName}`, 20, 70);

  doc.text(
    `Created on: ${new Date(issue.created_at).toLocaleDateString()}`,
    20,
    80
  );

  // Add assignees - handle multiple assignees
  if (issue.assignees && issue.assignees.length > 0) {
    const assigneeNames = issue.assignees
      .map((assignee) => assignee.full_name)
      .join(", ");
    doc.text(`Assigned to: ${assigneeNames}`, 20, 90);
  } else {
    doc.text(`Assigned to: Unassigned`, 20, 90);
  }

  // Add description
  if (issue.description) {
    doc.text("Description:", 20, 110);
    const splitDescription = doc.splitTextToSize(issue.description, 170);
    doc.text(splitDescription, 20, 120);
  }

  // Add cause if available
  if (issue.cause) {
    let yPosition = issue.description
      ? 120 + (issue.description.length > 50 ? 30 : 20)
      : 110;
    doc.text("Cause:", 20, yPosition);
    yPosition += 10;
    const splitCause = doc.splitTextToSize(issue.cause, 170);
    doc.text(splitCause, 20, yPosition);
    yPosition += splitCause.length * 10 + 10;
  }

  // Add solution if available
  if (issue.solution) {
    let yPosition = issue.description
      ? 120 + (issue.description.length > 50 ? 30 : 20)
      : 110;
    if (issue.cause) yPosition += 30;
    doc.text("Solution:", 20, yPosition);
    yPosition += 10;
    const splitSolution = doc.splitTextToSize(issue.solution, 170);
    doc.text(splitSolution, 20, yPosition);
    yPosition += splitSolution.length * 10 + 10;
  }

  // Add comments section if there are comments
  if (issue.comments && issue.comments.length > 0) {
    let yPosition = 140; // Start position for comments

    // Adjust based on content above
    if (issue.description) yPosition += 20;
    if (issue.cause) yPosition += 30;
    if (issue.solution) yPosition += 30;

    doc.text("Comments:", 20, yPosition);
    yPosition += 10;

    issue.comments.forEach((comment, index) => {
      // Handle comment author - could be string or object
      const authorName =
        typeof comment.created_by === "object"
          ? comment.created_by?.full_name || "Unknown"
          : comment.created_by || "Unknown";

      doc.text(
        `${authorName} (${new Date(comment.created_at).toLocaleDateString()}):`,
        20,
        yPosition
      );
      yPosition += 10;

      const splitComment = doc.splitTextToSize(comment.comment, 170);
      doc.text(splitComment, 20, yPosition);
      yPosition += splitComment.length * 10 + 10;

      // Add a new page if we're running out of space
      if (yPosition > 270 && index < issue.comments.length - 1) {
        doc.addPage();
        yPosition = 20;
      }
    });
  }

  return doc;
};
