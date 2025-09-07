import type {
  AuditTemplate,
  Page,
  Section,
  Question,
} from "@/lib/types/audit-types";

export const A4_PAGE_HEIGHT_PX = 1122; // approx A4 at 96dpi
export const SECTION_HEADER_HEIGHT = 40;

function getQuestionHeight(question: Question): number {
  // Conservative default heights per type to keep UX stable
  switch (question.field_type) {
    case "PHOTO":
      return 120;
    case "SELECT":
    case "MULTI_SELECT":
    case "LOCATION":
    case "SLIDER":
    case "PERSON":
    case "ASSET":
      return 80;
    case "BOOLEAN":
    case "TEXT":
    case "DATE":
    case "NUMBER":
    case "SIGNATURE":
    default:
      return 60;
  }
}

export function reflowTemplateByA4(original: AuditTemplate): AuditTemplate {
  const template: AuditTemplate = JSON.parse(JSON.stringify(original));

  // Flatten sections preserving document order (by page ordinal, then section ordinal)
  const orderedPages = [...template.pages].sort(
    (a, b) => a.ordinal - b.ordinal
  );
  const originalPageIds = orderedPages.map((p) => p.id);
  const orderedSections: Section[] = [];
  for (const page of orderedPages) {
    const sectionsSorted = [...page.sections].sort(
      (a, b) => a.ordinal - b.ordinal
    );
    for (const section of sectionsSorted) {
      orderedSections.push(section);
    }
  }

  const existingPageTitles = orderedPages.map((p) => p.title);
  const existingPageDescriptions = orderedPages.map((p) => p.description);

  const newPages: Page[] = [];
  let currentPage: Page | null = null;
  let currentHeight = 0;
  let pageIndex = 0;

  function startNewPage() {
    const newPageId =
      originalPageIds[pageIndex] || `page-${Date.now()}-${pageIndex}`;
    currentPage = {
      id: newPageId,
      template_id: template.id,
      title: existingPageTitles[pageIndex] || `Page ${pageIndex + 1}`,
      description: existingPageDescriptions[pageIndex] || "",
      ordinal: pageIndex + 1,
      sections: [],
      created_at: new Date().toISOString(),
    };
    newPages.push(currentPage);
    currentHeight = 0;
    pageIndex += 1;
  }

  function pushSectionFragment(baseSection: Section, questions: Question[]) {
    if (!currentPage) startNewPage();
    const fragment: Section = {
      id: baseSection.id,
      page_id: currentPage!.id,
      title: baseSection.title,
      ordinal: (currentPage!.sections.length || 0) + 1,
      questions: questions.map((q) => ({ ...q, page_id: currentPage!.id })),
      created_at: baseSection.created_at,
    };
    currentPage!.sections.push(fragment);
    // update height: header + questions heights
    let used = SECTION_HEADER_HEIGHT;
    for (const q of questions) used += getQuestionHeight(q);
    currentHeight += used;
  }

  for (const section of orderedSections) {
    // ensure a page is active
    if (!currentPage) startNewPage();

    const allQs = [...section.questions].sort((a, b) => a.ordinal - b.ordinal);
    if (allQs.length === 0) {
      // Empty section still consumes header height
      if (currentHeight + SECTION_HEADER_HEIGHT > A4_PAGE_HEIGHT_PX) {
        startNewPage();
      }
      pushSectionFragment(section, []);
      continue;
    }

    let cursor = 0;
    while (cursor < allQs.length) {
      // If header does not fit, start new page
      if (currentHeight + SECTION_HEADER_HEIGHT > A4_PAGE_HEIGHT_PX) {
        startNewPage();
      }

      const fragmentQuestions: Question[] = [];
      let fragmentHeight = SECTION_HEADER_HEIGHT;
      while (cursor < allQs.length) {
        const q = allQs[cursor];
        const qh = getQuestionHeight(q);
        if (currentHeight + fragmentHeight + qh > A4_PAGE_HEIGHT_PX) break;
        fragmentQuestions.push(q);
        fragmentHeight += qh;
        cursor += 1;
      }

      // If nothing fit besides header, force at least one question per page
      if (fragmentQuestions.length === 0) {
        fragmentQuestions.push(allQs[cursor]);
        cursor += 1;
      }

      pushSectionFragment(section, fragmentQuestions);
    }
  }

  // Replace template pages with newPages while preserving ids in questions
  return {
    ...template,
    pages: newPages,
  };
}
