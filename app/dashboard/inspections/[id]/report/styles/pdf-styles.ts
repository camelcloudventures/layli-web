import { StyleSheet } from '@react-pdf/renderer';

// Color palette - all hex colors to avoid oklch/hsl compatibility issues
export const colors = {
  // Backgrounds
  white: '#FFFFFF',
  sectionBg: '#EEF2FF',
  actionBg: '#FFFBEB',
  lightGray: '#F9FAFB',
  
  // Text colors
  black: '#000000',
  darkGray: '#1F2937',
  mediumGray: '#6B7280',
  lightText: '#9CA3AF',
  orangeText: '#EA580C',
  
  // Badge colors
  redBadge: '#DC2626',
  redBadgeBg: '#FEE2E2',
  greenBadge: '#10B981',
  greenBadgeBg: '#D1FAE5',
  grayBadge: '#6B7280',
  grayBadgeBg: '#F3F4F6',
  tealBadge: '#47BFBB',
  tealBadgeBg: '#CCEDED',
  
  // Borders
  border: '#E5E7EB',
  darkBorder: '#D1D5DB',
};

// Typography scale
export const fontSize = {
  xs: 8,
  sm: 10,
  base: 12,
  lg: 14,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  '4xl': 28,
};

// Create all styles
export const pdfStyles = StyleSheet.create({
  // Page styles
  page: {
    padding: 40,
    backgroundColor: colors.white,
    fontSize: fontSize.base,
    color: colors.darkGray,
    fontFamily: 'Helvetica',
  },
  
  // Cover page styles
  coverPage: {
    padding: 40,
    backgroundColor: colors.white,
  },
  coverImage: {
    width: 180,
    height: 120,
    objectFit: 'cover',
    borderRadius: 4,
    marginBottom: 20,
  },
  coverTitle: {
    fontSize: fontSize['3xl'],
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 8,
  },
  coverSubtitle: {
    fontSize: fontSize.lg,
    color: colors.mediumGray,
    marginBottom: 20,
  },
  coverStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.tealBadgeBg,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: fontSize.sm,
    color: colors.tealBadge,
    fontWeight: 'bold',
  },
  
  // Summary cards
  summaryContainer: {
    backgroundColor: colors.sectionBg,
    padding: 16,
    marginBottom: 16,
    borderRadius: 4,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  summaryItem: {
    flex: 1,
    minWidth: '30%',
  },
  summaryLabel: {
    fontSize: fontSize.sm,
    color: colors.mediumGray,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.darkGray,
  },
  
  // Section headers
  sectionHeader: {
    backgroundColor: colors.sectionBg,
    padding: 12,
    marginBottom: 12,
    marginTop: 20,
    borderRadius: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.darkGray,
  },
  sectionSubtitle: {
    fontSize: fontSize.sm,
    color: colors.mediumGray,
    marginTop: 4,
  },
  
  // Question item
  questionContainer: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: `1px solid ${colors.border}`,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  questionText: {
    fontSize: fontSize.base,
    fontWeight: 'bold',
    color: colors.darkGray,
    flex: 1,
    marginRight: 8,
  },
  questionDescription: {
    fontSize: fontSize.sm,
    color: colors.mediumGray,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  
  // Response styles
  responseContainer: {
    backgroundColor: colors.lightGray,
    padding: 10,
    borderRadius: 4,
    marginBottom: 8,
  },
  responseLabel: {
    fontSize: fontSize.sm,
    fontWeight: 'bold',
    color: colors.mediumGray,
    marginBottom: 4,
  },
  responseValue: {
    fontSize: fontSize.base,
    color: colors.darkGray,
  },
  responseImage: {
    width: 120,
    height: 90,
    objectFit: 'cover',
    borderRadius: 4,
    marginTop: 8,
  },
  
  // Badge styles
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: 'bold',
  },
  
  // Red badge (No, Poor, Failed)
  redBadge: {
    backgroundColor: colors.redBadge,
  },
  redBadgeText: {
    color: colors.white,
  },
  
  // Green badge (Yes, Good, Passed)
  greenBadge: {
    backgroundColor: colors.greenBadge,
  },
  greenBadgeText: {
    color: colors.white,
  },
  
  // Gray badge (Neutral)
  grayBadge: {
    backgroundColor: colors.grayBadge,
  },
  grayBadgeText: {
    color: colors.white,
  },
  
  // Action card
  actionCard: {
    backgroundColor: colors.actionBg,
    padding: 12,
    borderRadius: 4,
    marginBottom: 12,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  actionStatus: {
    fontSize: fontSize.sm,
    fontWeight: 'bold',
    color: colors.orangeText,
  },
  actionMeta: {
    fontSize: fontSize.xs,
    color: colors.mediumGray,
  },
  actionTitle: {
    fontSize: fontSize.base,
    fontWeight: 'bold',
    color: colors.darkGray,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: fontSize.sm,
    color: colors.mediumGray,
  },
  
  // Notes and inspector comments
  notesContainer: {
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: 4,
    marginTop: 8,
  },
  notesLabel: {
    fontSize: fontSize.sm,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 4,
  },
  notesText: {
    fontSize: fontSize.sm,
    color: '#1E3A8A',
  },
  
  // Flagged item
  flaggedContainer: {
    backgroundColor: colors.redBadgeBg,
    padding: 10,
    borderRadius: 4,
    marginTop: 8,
    borderLeft: `3px solid ${colors.redBadge}`,
  },
  flaggedLabel: {
    fontSize: fontSize.sm,
    fontWeight: 'bold',
    color: colors.redBadge,
    marginBottom: 4,
  },
  flaggedText: {
    fontSize: fontSize.sm,
    color: '#991B1B',
  },
  
  // Metadata rows
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottom: `1px solid ${colors.border}`,
  },
  metadataLabel: {
    fontSize: fontSize.base,
    fontWeight: 'bold',
    color: colors.darkGray,
  },
  metadataValue: {
    fontSize: fontSize.base,
    color: colors.mediumGray,
  },
  
  // Media summary grid
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  mediaItem: {
    width: '48%',
    marginBottom: 12,
  },
  mediaImage: {
    width: '100%',
    height: 150,
    objectFit: 'cover',
    borderRadius: 4,
  },
  mediaCaption: {
    fontSize: fontSize.sm,
    color: colors.mediumGray,
    marginTop: 4,
  },
  
  // Page footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: fontSize.xs,
    color: colors.lightText,
  },
  
  // Utility classes
  row: {
    flexDirection: 'row',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  alignCenter: {
    alignItems: 'center',
  },
  mt8: {
    marginTop: 8,
  },
  mt12: {
    marginTop: 12,
  },
  mt16: {
    marginTop: 16,
  },
  mb8: {
    marginBottom: 8,
  },
  mb12: {
    marginBottom: 12,
  },
  mb16: {
    marginBottom: 16,
  },
  gap8: {
    gap: 8,
  },
  gap12: {
    gap: 12,
  },
});

