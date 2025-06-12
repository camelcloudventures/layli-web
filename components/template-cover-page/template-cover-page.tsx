import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { QuestionsManager } from '@/app/dashboard/templates/components/questions-manager'
import type { Question } from '@/types/audit-types'

export interface TemplateCoverPageProps {
  isMultiTenant?: boolean
  pageId: string
  sectionId: string
}

export const getPreloadedQuestions = (
  pageId: string,
  sectionId: string,
  isMultiTenant?: boolean,
): Question[] => [
  {
    id: uuidv4(),
    page_id: pageId,
    section_id: sectionId,
    text: isMultiTenant ? 'Tenant' : 'Site Conducted',
    required: true,
    multiple_selection: false,
    is_flagged: false,
    field_type: 'TEXT',
    ordinal: 1,
    response_options: [],
  },
  {
    id: uuidv4(),
    page_id: pageId,
    section_id: sectionId,
    text: 'Date',
    required: true,
    multiple_selection: false,
    is_flagged: false,
    field_type: 'DATE',
    ordinal: 2,
    response_options: [],
  },
  {
    id: uuidv4(),
    page_id: pageId,
    section_id: sectionId,
    text: 'Prepared by',
    required: true,
    multiple_selection: false,
    is_flagged: false,
    field_type: 'PERSON',
    ordinal: 3,
    response_options: [],
  },
  {
    id: uuidv4(),
    page_id: pageId,
    section_id: sectionId,
    text: 'Location',
    required: true,
    multiple_selection: false,
    is_flagged: false,
    field_type: 'LOCATION',
    ordinal: 4,
    response_options: [],
  },
]

export function TemplateCoverPage({
  isMultiTenant,
  pageId,
  sectionId,
}: TemplateCoverPageProps) {
  const [questions] = useState<Question[]>(
    getPreloadedQuestions(pageId, sectionId, isMultiTenant),
  )

  // Render using QuestionsManager for full UI/UX consistency
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Cover Page</h3>
      <QuestionsManager
        template={{
          id: 'cover-template',
          title: '',
          description: '',
          pages: [
            {
              id: pageId,
              template_id: 'cover-template',
              title: '',
              description: '',
              ordinal: 1,
              sections: [
                {
                  id: sectionId,
                  page_id: pageId,
                  title: 'Cover Page',
                  ordinal: 1,
                  questions,
                },
              ],
            },
          ],
        }}
        setTemplate={() => {}}
        page={{
          id: pageId,
          template_id: 'cover-template',
          title: '',
          description: '',
          ordinal: 1,
          sections: [
            {
              id: sectionId,
              page_id: pageId,
              title: 'Cover Page',
              ordinal: 1,
              questions,
            },
          ],
        }}
        section={{
          id: sectionId,
          page_id: pageId,
          title: 'Cover Page',
          ordinal: 1,
          questions,
        }}
      />
    </div>
  )
}
