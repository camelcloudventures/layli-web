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
    case "CHECKBOX":
    case "LOCATION":
    case "SLIDER":
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

  // Order pages by ordinal and seed a base list of pages (manual pages preserved)
  const orderedPages = [...template.pages].sort(
    (a, b) => a.ordinal - b.ordinal
  );

  // Preserve existing pages to reuse their IDs, titles, and descriptions
  // Start with just the first page, more will be added as needed
  const basePages: Page[] = orderedPages.length > 0 ? [{
    id: orderedPages[0].id,
    template_id: template.id,
    title: orderedPages[0].title,
    description: orderedPages[0].description,
    ordinal: 1,
    sections: [],
    created_at: orderedPages[0].created_at || new Date().toISOString(),
  }] : [];

  // Build logical sections: dedupe by section.id, preserve first-seen order
  type LogicalSection = {
    base: Pick<Section, "id" | "title" | "created_at">;
    questions: Question[];
    orderKey: number; // stable order of first encounter in traversal
  };

  const logicalSectionsMap = new Map<string, LogicalSection>();
  let encounterCounter = 0;

  orderedPages.forEach((p) => {
    const sectionsSorted = [...p.sections].sort(
      (a, b) => a.ordinal - b.ordinal
    );
    sectionsSorted.forEach((s) => {
      const existing = logicalSectionsMap.get(s.id);
      const qs = [...s.questions].sort((a, b) => a.ordinal - b.ordinal);
      if (!existing) {
        logicalSectionsMap.set(s.id, {
          base: { id: s.id, title: s.title, created_at: s.created_at },
          questions: [...qs],
          orderKey: encounterCounter++,
        });
      } else {
        existing.questions.push(...qs);
      }
    });
  });

  const logicalSections = Array.from(logicalSectionsMap.values()).sort(
    (a, b) => a.orderKey - b.orderKey
  );

  let pageIndex = 0;
  let currentPage: Page = basePages[pageIndex];
  let currentHeight = 0;

  function generatePageId(): string {
    return `page-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function advanceToPage(targetIndex: number) {
    if (targetIndex >= basePages.length) {
      // Reuse existing page if it exists in orderedPages, otherwise create new
      const existingPage = orderedPages[targetIndex];
      const newPage: Page = existingPage ? {
        id: existingPage.id, // Reuse existing page ID
        template_id: template.id,
        title: existingPage.title,
        description: existingPage.description,
        ordinal: basePages.length + 1,
        sections: [],
        created_at: existingPage.created_at || new Date().toISOString(),
      } : {
        id: generatePageId(), // Only generate new ID if page never existed
        template_id: template.id,
        title: `Page ${basePages.length + 1}`,
        description: "",
        ordinal: basePages.length + 1,
        sections: [],
        created_at: new Date().toISOString(),
      };
      basePages.push(newPage);
      pageIndex = basePages.length - 1;
    } else {
      pageIndex = targetIndex;
    }
    currentPage = basePages[pageIndex];
    currentHeight = 0;
  }

  function startNewPage() {
    advanceToPage(pageIndex + 1);
  }

  function pushSectionFragment(
    baseSection: LogicalSection["base"],
    questions: Question[]
  ) {
    const fragment: Section = {
      id: baseSection.id,
      page_id: currentPage.id,
      title: baseSection.title,
      ordinal: (currentPage.sections.length || 0) + 1,
      questions: questions.map((q) => ({ ...q, page_id: currentPage.id })),
      created_at: baseSection.created_at,
    };
    currentPage.sections.push(fragment);
    // update height: header + questions heights
    let used = SECTION_HEADER_HEIGHT;
    for (const q of questions) used += getQuestionHeight(q);
    currentHeight += used;
  }

  // Lay out each logical section sequentially with automatic page breaks
  for (const logical of logicalSections) {
    const allQs = [...logical.questions].sort((a, b) => a.ordinal - b.ordinal);
    if (allQs.length === 0) {
      if (currentHeight + SECTION_HEADER_HEIGHT > A4_PAGE_HEIGHT_PX) {
        startNewPage();
      }
      pushSectionFragment(logical.base, []);
      continue;
    }

    let cursor = 0;
    while (cursor < allQs.length) {
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

      if (fragmentQuestions.length === 0) {
        fragmentQuestions.push(allQs[cursor]);
        cursor += 1;
      }

      pushSectionFragment(logical.base, fragmentQuestions);
    }
  }

  // Fix ordinals after layout and remove any duplicate sections on the same page
  basePages.forEach((p, pi) => {
    p.ordinal = pi + 1;
    
    // Remove duplicate sections (sections with the same ID should not appear twice on same page)
    const seenSectionIds = new Set<string>();
    p.sections = p.sections.filter((s) => {
      if (seenSectionIds.has(s.id)) {
        console.warn(`Duplicate section ${s.id} found on page ${p.id}, removing duplicate`);
        return false;
      }
      seenSectionIds.add(s.id);
      return true;
    });
    
    p.sections.forEach((s, si) => {
      s.ordinal = si + 1;
    });
  });

  return {
    ...template,
    pages: basePages,
  };
}
