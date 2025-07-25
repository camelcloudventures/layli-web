import { useState, useEffect } from 'react'
import { AuditTemplate, Page, Section } from '@/lib/types/audit-types'

export const useInspectionPages = (
  template: AuditTemplate,
  setTemplate: React.Dispatch<React.SetStateAction<AuditTemplate>>,
) => {
  const A4_PAGE_HEIGHT_PX = 1122
  const SECTION_HEADER_HEIGHT = 40
  const QUESTION_HEIGHT = 60
  const [pageNames, setPageNames] = useState<{ [key: number]: string }>({})

  // Group sections into pages based on A4 height
  const groupSectionsIntoPages = (sections: Section[]): Section[][] => {
    const pages: Section[][] = []
    let currentPage: Section[] = []
    let currentHeight = 0

    for (const section of sections) {
      const sectionHeight =
        SECTION_HEADER_HEIGHT + section.questions.length * QUESTION_HEIGHT
      if (
        currentHeight + sectionHeight > A4_PAGE_HEIGHT_PX &&
        currentPage.length > 0
      ) {
        pages.push(currentPage)
        currentPage = []
        currentHeight = 0
      }
      currentPage.push(section)
      currentHeight += sectionHeight
    }
    if (currentPage.length > 0) pages.push(currentPage)
    return pages
  }

  // Update template pages when sections change
  useEffect(() => {
    const allSections = template.pages.flatMap((page) => page.sections)
    const groupedPages = groupSectionsIntoPages(allSections)

    // Create new pages with grouped sections
    const newPages: Page[] = groupedPages.map((sections, index) => ({
      id: `page-${Date.now()}-${index}`,
      template_id: template.id,
      title: pageNames[index] || `Page ${index + 1}`,
      description: '',
      ordinal: index + 1,
      sections: sections.map((section) => ({
        ...section,
        page_id: `page-${Date.now()}-${index}`,
      })),
    }))

    setTemplate((prev) => ({
      ...prev,
      pages: newPages,
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template.pages.flatMap((page) => page.sections).length]) // Only regroup when number of sections changes

  const updatePageName = (pageIndex: number, name: string) => {
    setPageNames((prev) => ({
      ...prev,
      [pageIndex]: name,
    }))

    setTemplate((prev) => ({
      ...prev,
      pages: prev.pages.map((page, idx) =>
        idx === pageIndex ? { ...page, title: name } : page,
      ),
    }))
  }

  const getPageName = (pageIndex: number) => {
    return pageNames[pageIndex] || `Page ${pageIndex + 1}`
  }

  return {
    updatePageName,
    getPageName,
    A4_PAGE_HEIGHT_PX,
    SECTION_HEADER_HEIGHT,
    QUESTION_HEIGHT,
  }
}
