import React from 'react';
import { Document, Page, View } from '@react-pdf/renderer';
import { pdfStyles } from '../styles/pdf-styles';
import { Inspection } from '../types/inspection-types';
import {
  CoverPage,
  SectionContent,
  FlaggedItemsPage,
  MediaSummaryPage,
  PageFooter,
} from './pdf-components';

interface InspectionPDFReportProps {
  inspection: Inspection;
  actions: any[];
}

export function InspectionPDFReport({
  inspection,
  actions,
}: InspectionPDFReportProps) {
  // Calculate counts
  const issueCount = inspection.responses.filter((r) => r.is_flagged).length;
  const actionCount = inspection.responses.filter((r) => r.action_id).length;

  // Collect all photos for media summary
  const hasMedia = inspection.responses.some(
    (r) =>
      (r.file_attachments && r.file_attachments.length > 0) ||
      (r.response_value &&
        r.response_value.startsWith('http') &&
        (r.response_value.includes('.jpg') ||
          r.response_value.includes('.png') ||
          r.response_value.includes('.jpeg')))
  );

  const hasFlaggedItems = issueCount > 0 || actionCount > 0;

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={pdfStyles.page}>
        <CoverPage
          inspection={inspection}
          issueCount={issueCount}
          actionCount={actionCount}
        />
        <PageFooter pageNumber={1} totalPages={-1} />
      </Page>

      {/* Section Pages */}
      {inspection.pages.map((page, pageIndex) =>
        page.sections.map((section, sectionIndex) => {
          const sectionScore = inspection.section_scores.find(
            (score) => score.section_id === section.id
          );
          const sectionResponses = inspection.responses.filter((response) => {
            return section.questions.some((q) => q.id === response.question_id);
          });

          // Skip sections with no responses
          if (sectionResponses.length === 0) return null;

          return (
            <Page
              key={`${page.id}-${section.id}`}
              size="A4"
              style={pdfStyles.page}
            >
              <SectionContent
                section={section}
                responses={sectionResponses}
                sectionScore={sectionScore}
                actions={actions}
              />
              <PageFooter pageNumber={-1} totalPages={-1} />
            </Page>
          );
        })
      )}

      {/* Flagged Items & Actions Page */}
      {hasFlaggedItems && (
        <Page size="A4" style={pdfStyles.page}>
          <FlaggedItemsPage inspection={inspection} actions={actions} />
          <PageFooter pageNumber={-1} totalPages={-1} />
        </Page>
      )}

      {/* Media Summary Page */}
      {hasMedia && (
        <Page size="A4" style={pdfStyles.page}>
          <MediaSummaryPage inspection={inspection} />
          <PageFooter pageNumber={-1} totalPages={-1} />
        </Page>
      )}
    </Document>
  );
}

