import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { pdfStyles, colors } from '../styles/pdf-styles';
import { Inspection, InspectionResponse } from '../types/inspection-types';
import {
  formatResponseValue,
  getBadgeColor,
  formatDate,
  formatDateShort,
} from '../utils/response-formatter';

// Badge Component
interface BadgeProps {
  text: string;
  color: 'red' | 'green' | 'gray' | 'teal';
}

export function Badge({ text, color }: BadgeProps) {
  const badgeStyle =
    color === 'red'
      ? [pdfStyles.badge, pdfStyles.redBadge]
      : color === 'green'
      ? [pdfStyles.badge, pdfStyles.greenBadge]
      : color === 'gray'
      ? [pdfStyles.badge, pdfStyles.grayBadge]
      : [pdfStyles.badge, { backgroundColor: colors.tealBadge }];

  const textStyle =
    color === 'red'
      ? [pdfStyles.badgeText, pdfStyles.redBadgeText]
      : color === 'green'
      ? [pdfStyles.badgeText, pdfStyles.greenBadgeText]
      : color === 'gray'
      ? [pdfStyles.badgeText, pdfStyles.grayBadgeText]
      : [pdfStyles.badgeText, { color: colors.white }];

  return (
    <View style={badgeStyle}>
      <Text style={textStyle}>{text}</Text>
    </View>
  );
}

// Cover Page Component
interface CoverPageProps {
  inspection: Inspection;
  issueCount: number;
  actionCount: number;
}

export function CoverPage({
  inspection,
  issueCount,
  actionCount,
}: CoverPageProps) {
  const inspector =
    inspection.assignees?.find((a) => a.role === 'auditor') ||
    inspection.assignees?.[0];

  return (
    <View style={pdfStyles.coverPage}>
      {/* Cover Image */}
      {inspection.template?.photo && (
        <Image
          src={inspection.template.photo}
          style={pdfStyles.coverImage}
        />
      )}

      {/* Title */}
      <Text style={pdfStyles.coverTitle}>{inspection.title}</Text>

      {/* Date and Inspector */}
      <View style={pdfStyles.coverStatusContainer}>
        <Text style={pdfStyles.coverSubtitle}>
          {formatDateShort(inspection.created_at)} / {inspector?.full_name || 'N/A'}
        </Text>
        <View style={pdfStyles.statusBadge}>
          <Text style={pdfStyles.statusBadgeText}>
            {inspection.status === 'completed' ? 'Complete' : inspection.status}
          </Text>
        </View>
      </View>

      {/* Summary Stats */}
      <View style={pdfStyles.summaryContainer}>
        <View style={pdfStyles.summaryGrid}>
          <View style={pdfStyles.summaryItem}>
            <Text style={pdfStyles.summaryLabel}>Score</Text>
            <Text style={pdfStyles.summaryValue}>
              {inspection.total_points_earned} / {inspection.total_points_possible} (
              {inspection.final_score}%)
            </Text>
          </View>

          <View style={pdfStyles.summaryItem}>
            <Text style={pdfStyles.summaryLabel}>Flagged items</Text>
            <Text style={pdfStyles.summaryValue}>{issueCount}</Text>
          </View>

          <View style={pdfStyles.summaryItem}>
            <Text style={pdfStyles.summaryLabel}>Actions</Text>
            <Text style={pdfStyles.summaryValue}>{actionCount}</Text>
          </View>
        </View>
      </View>

      {/* Metadata */}
      <View style={pdfStyles.mt16}>
        <View style={pdfStyles.metadataRow}>
          <Text style={pdfStyles.metadataLabel}>Site conducted</Text>
          <Text style={pdfStyles.metadataValue}>
            {inspection.site?.name || 'Unanswered'}
          </Text>
        </View>

        <View style={pdfStyles.metadataRow}>
          <Text style={pdfStyles.metadataLabel}>Conducted on</Text>
          <Text style={pdfStyles.metadataValue}>
            {formatDate(inspection.created_at)}
          </Text>
        </View>

        <View style={pdfStyles.metadataRow}>
          <Text style={pdfStyles.metadataLabel}>Prepared by</Text>
          <Text style={pdfStyles.metadataValue}>
            {inspector?.full_name || 'N/A'}
          </Text>
        </View>

        <View style={pdfStyles.metadataRow}>
          <Text style={pdfStyles.metadataLabel}>Location</Text>
          <Text style={pdfStyles.metadataValue}>
            {inspection.site?.name || 'N/A'}
          </Text>
        </View>
      </View>
    </View>
  );
}

// Action Card Component
interface ActionCardProps {
  action: any;
  questionText?: string;
  responseValue?: string;
}

export function ActionCard({
  action,
  questionText,
  responseValue,
}: ActionCardProps) {
  return (
    <View style={pdfStyles.actionCard}>
      {questionText && (
        <Text style={pdfStyles.questionText}>{questionText}</Text>
      )}
      {responseValue && (
        <View style={[pdfStyles.badge, pdfStyles.redBadge, pdfStyles.mb8]}>
          <Text style={[pdfStyles.badgeText, pdfStyles.redBadgeText]}>
            {responseValue}
          </Text>
        </View>
      )}
      <View style={pdfStyles.actionHeader}>
        <Text style={pdfStyles.actionStatus}>To do</Text>
        <Text style={pdfStyles.actionMeta}>
          | Assignee: {action.assignee?.full_name || 'Unassigned'} | Priority:{' '}
          {action.priority} | Due:{' '}
          {action.due_date ? formatDateShort(action.due_date) : 'No due date'} |
          Created by: {action.created_by?.full_name || 'N/A'}
        </Text>
      </View>
      <Text style={pdfStyles.actionTitle}>{action.title}</Text>
      {action.description && (
        <Text style={pdfStyles.actionDescription}>{action.description}</Text>
      )}
    </View>
  );
}

// Question Item Component
interface QuestionItemProps {
  question: any;
  response: InspectionResponse;
  actions: any[];
}

export function QuestionItem({ question, response, actions }: QuestionItemProps) {
  const formatted = formatResponseValue(response, question);
  const badgeColor = getBadgeColor(response, question);

  // Find linked action
  const linkedAction = actions.find((a) => a.id === response.action_id);

  return (
    <View style={pdfStyles.questionContainer}>
      {/* Question Header */}
      <View style={pdfStyles.questionHeader}>
        <Text style={pdfStyles.questionText}>
          {question.text || question.title}
        </Text>
        <Badge text={formatted.displayValue} color={badgeColor} />
      </View>

      {/* Question Description */}
      {question.description && (
        <Text style={pdfStyles.questionDescription}>
          {question.description}
        </Text>
      )}

      {/* Response */}
      <View style={pdfStyles.responseContainer}>
        <Text style={pdfStyles.responseLabel}>Response:</Text>
        {formatted.isImage && formatted.imageUrl ? (
          <Image src={formatted.imageUrl} style={pdfStyles.responseImage} />
        ) : (
          <Text style={pdfStyles.responseValue}>{formatted.displayValue}</Text>
        )}
      </View>

      {/* Inspector Notes */}
      {response.inspector_notes && (
        <View style={pdfStyles.notesContainer}>
          <Text style={pdfStyles.notesLabel}>Inspector Notes:</Text>
          <Text style={pdfStyles.notesText}>{response.inspector_notes}</Text>
        </View>
      )}

      {/* Flag Reason */}
      {response.flag_reason && (
        <View style={pdfStyles.flaggedContainer}>
          <Text style={pdfStyles.flaggedLabel}>Flag Reason:</Text>
          <Text style={pdfStyles.flaggedText}>{response.flag_reason}</Text>
        </View>
      )}

      {/* Linked Action */}
      {linkedAction && (
        <View style={pdfStyles.mt8}>
          <ActionCard action={linkedAction} />
        </View>
      )}
    </View>
  );
}

// Section Page Component
interface SectionPageProps {
  section: any;
  responses: InspectionResponse[];
  sectionScore: any;
  actions: any[];
}

export function SectionContent({
  section,
  responses,
  sectionScore,
  actions,
}: SectionPageProps) {
  return (
    <View>
      {/* Section Header */}
      <View style={pdfStyles.sectionHeader}>
        <View style={pdfStyles.sectionHeaderRow}>
          <Text style={pdfStyles.sectionTitle}>{section.title}</Text>
          {sectionScore && (
            <Text style={pdfStyles.summaryValue}>
              {sectionScore.points_earned} / {sectionScore.points_possible} (
              {sectionScore.section_score}%)
            </Text>
          )}
        </View>
      </View>

      {/* Questions */}
      {section.questions.map((question: any) => {
        const response = responses.find((r) => r.question_id === question.id);
        if (!response) return null;

        return (
          <QuestionItem
            key={question.id}
            question={question}
            response={response}
            actions={actions}
          />
        );
      })}
    </View>
  );
}

// Flagged Items Page Component
interface FlaggedItemsPageProps {
  inspection: Inspection;
  actions: any[];
}

export function FlaggedItemsPage({
  inspection,
  actions,
}: FlaggedItemsPageProps) {
  const flaggedResponses = inspection.responses.filter((r) => r.is_flagged);
  const flaggedActions = actions.filter((a) =>
    flaggedResponses.some((r) => r.action_id === a.id)
  );

  // Get question for each flagged response
  const getQuestionForResponse = (response: InspectionResponse) => {
    for (const page of inspection.pages) {
      for (const section of page.sections) {
        const question = section.questions.find((q) => q.id === response.question_id);
        if (question) return question;
      }
    }
    return null;
  };

  return (
    <View>
      {/* Header */}
      <View style={pdfStyles.sectionHeader}>
        <View style={pdfStyles.sectionHeaderRow}>
          <Text style={pdfStyles.sectionTitle}>Flagged items & Actions</Text>
          <Text style={pdfStyles.sectionSubtitle}>
            {flaggedResponses.length} flagged, {flaggedActions.length} actions
          </Text>
        </View>
      </View>

      {/* Flagged Items Section */}
      <View style={pdfStyles.mt16}>
        <Text style={[pdfStyles.sectionTitle, pdfStyles.mb12]}>
          Flagged items
        </Text>
        <Text style={[pdfStyles.sectionSubtitle, pdfStyles.mb12]}>
          {flaggedResponses.length} flagged, {flaggedActions.length} actions
        </Text>

        {flaggedResponses.map((response) => {
          const question = getQuestionForResponse(response);
          const linkedAction = actions.find((a) => a.id === response.action_id);
          const formatted = formatResponseValue(response, question || {} as any);
          const sectionName = inspection.pages
            .flatMap((p) => p.sections)
            .find((s) => s.questions.some((q) => q.id === response.question_id))
            ?.title;

          return (
            <View key={response.id} style={pdfStyles.mb16}>
              <Text style={pdfStyles.questionDescription}>
                {sectionName} / {question?.title || question?.text}
              </Text>
              <Text style={[pdfStyles.questionText, pdfStyles.mb8]}>
                {question?.text || question?.title}
              </Text>
              {linkedAction && (
                <ActionCard
                  action={linkedAction}
                  responseValue={formatted.displayValue}
                />
              )}
            </View>
          );
        })}
      </View>

      {/* Other Actions */}
      {actions.filter((a) => !flaggedActions.includes(a)).length > 0 && (
        <View style={pdfStyles.mt16}>
          <Text style={[pdfStyles.sectionTitle, pdfStyles.mb12]}>
            Other actions
          </Text>
          <Text style={[pdfStyles.sectionSubtitle, pdfStyles.mb12]}>
            {actions.filter((a) => !flaggedActions.includes(a)).length} actions
          </Text>
        </View>
      )}
    </View>
  );
}

// Media Summary Page Component
interface MediaSummaryPageProps {
  inspection: Inspection;
}

export function MediaSummaryPage({ inspection }: MediaSummaryPageProps) {
  // Collect all photos from responses
  const photos: Array<{ url: string; caption: string }> = [];

  inspection.responses.forEach((response, index) => {
    // Check for file attachments (photos)
    if (response.file_attachments && response.file_attachments.length > 0) {
      response.file_attachments.forEach((attachment: any) => {
        if (attachment?.file_path) {
          photos.push({
            url: attachment.file_path,
            caption: `Photo ${photos.length + 1}`,
          });
        }
      });
    }
    // Check for response_value that's an image URL
    if (
      response.response_value &&
      response.response_value.startsWith('http') &&
      (response.response_value.includes('.jpg') ||
        response.response_value.includes('.png') ||
        response.response_value.includes('.jpeg'))
    ) {
      photos.push({
        url: response.response_value,
        caption: `Photo ${photos.length + 1}`,
      });
    }
  });

  if (photos.length === 0) {
    return null;
  }

  return (
    <View>
      {/* Header */}
      <View style={pdfStyles.sectionHeader}>
        <Text style={pdfStyles.sectionTitle}>Media summary</Text>
      </View>

      {/* Photo Grid */}
      <View style={pdfStyles.mediaGrid}>
        {photos.map((photo, index) => (
          <View key={index} style={pdfStyles.mediaItem}>
            <Image src={photo.url} style={pdfStyles.mediaImage} />
            <Text style={pdfStyles.mediaCaption}>{photo.caption}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// Page Footer Component
interface PageFooterProps {
  pageNumber: number;
  totalPages: number;
}

export function PageFooter({ pageNumber, totalPages }: PageFooterProps) {
  return (
    <View style={pdfStyles.footer}>
      <Text>Generated on {new Date().toLocaleDateString()}</Text>
      <Text>
        Page {pageNumber} of {totalPages}
      </Text>
    </View>
  );
}

