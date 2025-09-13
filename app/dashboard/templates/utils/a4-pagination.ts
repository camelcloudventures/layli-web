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

  // Order pages by ordinal and seed a base list of pages (manual pages preserved)
  const orderedPages = [...template.pages].sort(
    (a, b) => a.ordinal - b.ordinal
  );

  // Seed pages that will be filled by the reflow. Keep ids/titles/descriptions.
  const basePages: Page[] = orderedPages.map((p, idx) => ({
    id: p.id,
    template_id: template.id,
    title: p.title,
    description: p.description,
    ordinal: idx + 1,
    sections: [],
    created_at: p.created_at || new Date().toISOString(),
  }));

  function ensurePage(index: number): Page {
    // Append auto pages on demand
    while (basePages.length <= index) {
      const newPageId = `page-${Date.now()}-${basePages.length}`;
      basePages.push({
        id: newPageId,
        template_id: template.id,
        title: `Page ${basePages.length + 1}`,
        description: "",
        ordinal: basePages.length + 1,
        sections: [],
        created_at: new Date().toISOString(),
      });
    }
    return basePages[index];
  }

  // Build logical sections: dedupe by section.id, preserve first-seen order and page index
  type LogicalSection = {
    base: Pick<Section, "id" | "title" | "created_at">;
    questions: Question[];
    firstPageIndex: number; // index in orderedPages where this section first appeared
    orderKey: number; // stable order of first encounter in traversal
  };

  const logicalSectionsMap = new Map<string, LogicalSection>();
  let encounterCounter = 0;

  orderedPages.forEach((p, pi) => {
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
          firstPageIndex: pi,
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
  let currentPage: Page = ensurePage(pageIndex);
  let currentHeight = 0;

  function advanceToPage(targetIndex: number) {
    pageIndex = targetIndex;
    currentPage = ensurePage(pageIndex);
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

  // Lay out each logical section, starting on the page it was created on.
  for (const logical of logicalSections) {
    if (pageIndex < logical.firstPageIndex) {
      // Respect manual boundary where the section was added
      advanceToPage(logical.firstPageIndex);
    }

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

  // Fix ordinals after layout
  basePages.forEach((p, pi) => {
    p.ordinal = pi + 1;
    p.sections.forEach((s, si) => {
      s.ordinal = si + 1;
    });
  });

  return {
    ...template,
    pages: basePages,
  };
}
