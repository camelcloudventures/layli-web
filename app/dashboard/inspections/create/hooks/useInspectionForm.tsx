'use client'

import type {
  Inspection,
  InspectionSection,
} from '@/lib/types/inspection-types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const useInspectionForm = () => {
  const [sections, setSections] = useState<InspectionSection[]>([
    {
      id: `section-${Date.now()}`,
      name: 'General Information',
      questions: [
        {
          id: `question-${Date.now()}`,
          name: 'Is all required PPE available?',
          response: null,
          score: 0,
          note: '',
          attachment: null,
          action: null,
        },
      ],
    },
  ])

  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [inspectionName, setInspectionName] = useState('')
  const [locationId, setLocationId] = useState('')
  const [preparedBy, setPreparedBy] = useState('')
  const [scheduledDate, setScheduledDate] = useState(
    new Date().toISOString().split('T')[0],
  )
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [createdInspection, setCreatedInspection] = useState<Inspection | null>(
    null,
  )
  const [assignedTo, setAssignedTo] = useState<string[]>([])
  const [pageNames, setPageNames] = useState<{ [key: number]: string }>({})
  const A4_PAGE_HEIGHT_PX = 1122
  const SECTION_HEADER_HEIGHT = 40
  const QUESTION_HEIGHT = 60

  // Utility to group sections/questions into pages
  function groupSectionsIntoPages(
    sections: InspectionSection[],
  ): InspectionSection[][] {
    const pages: InspectionSection[][] = []
    let currentPage: InspectionSection[] = []
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

  const addSection = () => {
    setSections([
      ...sections,
      {
        id: `section-${Date.now()}-${sections.length}`,
        name: `Section ${sections.length + 1}`,
        questions: [],
      },
    ])
  }

  const removeSection = (sectionIndex: number) => {
    const newSections = [...sections]
    newSections.splice(sectionIndex, 1)
    setSections(newSections)
  }

  const updateSectionName = (sectionIndex: number, name: string) => {
    const newSections = [...sections]
    newSections[sectionIndex].name = name
    setSections(newSections)
  }

  const moveSection = (sectionIndex: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && sectionIndex === 0) ||
      (direction === 'down' && sectionIndex === sections.length - 1)
    ) {
      return
    }

    const newSections = [...sections]
    const newIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1

    // Swap sections using a temporary variable
    const temp = newSections[sectionIndex]
    newSections[sectionIndex] = newSections[newIndex]
    newSections[newIndex] = temp

    setSections(newSections)
  }

  const updatePageName = (pageIndex: number, name: string) => {
    setPageNames((prev) => ({
      ...prev,
      [pageIndex]: name,
    }))
  }

  const getPageName = (pageIndex: number) => {
    return pageNames[pageIndex] || `Page ${pageIndex + 1}`
  }

  return {
    sections,
    setSections,
    groupSectionsIntoPages,
    A4_PAGE_HEIGHT_PX,
    SECTION_HEADER_HEIGHT,
    QUESTION_HEIGHT,
    isCreating,
    setIsCreating,
    inspectionName,
    setInspectionName,
    locationId,
    setLocationId,
    preparedBy,
    setPreparedBy,
    scheduledDate,
    setScheduledDate,
    showSuccessDialog,
    setShowSuccessDialog,
    createdInspection,
    setCreatedInspection,
    router,
    addSection,
    removeSection,
    updateSectionName,
    moveSection,
    assignedTo,
    setAssignedTo,
    updatePageName,
    getPageName,
  }
}
