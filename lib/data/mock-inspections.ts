import { v4 as uuidv4 } from 'uuid'
import type {
  Inspection,
  Page,
  Section,
  Question,
  ResponseOption,
} from '@/lib/types/inspection-types'

const mockResponseOptions: ResponseOption[] = [
  {
    label: 'Yes - All properly mounted',
    code: 'YES',
    sort_order: 1,
    is_flagged: false,
    color: '#28a745',
  },
  {
    label: 'No - Issues found',
    code: 'NO',
    sort_order: 2,
    is_flagged: true,
    color: '#dc3545',
  },
]

const mockQuestion: Question = {
  id: 158,
  text: 'Are fire extinguishers properly mounted?',
  field_type: 'RADIO',
  required: true,
  multiple_selection: false,
  ordinal: 1,
  risk_level: 'critical',
  response_options: mockResponseOptions,
  auto_score: true,
  max_value: 5,
  min_value: 1,
  point_value: 1,
  step_value: 1,
  weight: 1,
  is_flagged: null,
  flag_rule: null,
  organization_id: null,
  page_id: null,
  section_id: 96,
  created_at: new Date().toISOString(),
}

const mockSection: Section = {
  id: 96,
  title: 'Fire Extinguishers',
  ordinal: 1,
  page_id: 87,
  organization_id: null,
  created_at: new Date().toISOString(),
  questions: [mockQuestion],
}

const mockPage: Page = {
  id: 87,
  title: 'Fire Safety',
  description: 'Fire safety requirements',
  ordinal: 1,
  template_id: null,
  inspection_id: '50053895-bd65-4174-a399-ef12bd3fe097',
  organization_id: '1e934ff2-c292-4554-89d4-4c4b840cec2f',
  photo: null,
  created_at: new Date().toISOString(),
  sections: [mockSection],
}

// Initial mock data
export const mockInspections: Inspection[] = [
  {
    id: '50053895-bd65-4174-a399-ef12bd3fe097',
    title: 'Fire Safety Inspection',
    description: null,
    organization_id: '1e934ff2-c292-4554-89d4-4c4b840cec2f',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    prepared_by: '79d5c44e-7645-4f97-a158-e9ce6411c431',
    assignee_id: null,
    assignee_ids: ['cecd7d84-9cbe-4fec-8104-86266d58aac4'],
    site_id: null,
    site: null,
    template_id: null,
    template: null,
    schedule_id: null,
    status: 'pending',
    started_at: null,
    completed_at: null,
    paused_at: null,
    due_date: new Date(2025, 6, 4).toISOString(),
    passed: null,
    final_grade: null,
    final_score: null,
    total_points_earned: 0,
    total_points_possible: 0,
    critical_violations: 0,
    major_violations: 0,
    minor_violations: 0,
    section_scores: [],
    responses: [],
    violations: [],
    pages: [mockPage],
  },
]

// Helper to handle localStorage serialization/deserialization of dates
const serializeInspection = (inspection: Inspection): string => {
  return JSON.stringify(inspection, (key, value) => {
    if (
      key === 'conducted_on' ||
      key === 'last_modified' ||
      key === 'completed_on' ||
      key === 'dueDate'
    ) {
      return value instanceof Date ? value.toISOString() : value
    }
    return value
  })
}

// Initialize localStorage if it doesn't exist
const initializeLocalStorage = (): void => {
  try {
    if (typeof window !== 'undefined') {
      const storedInspections = localStorage.getItem('inspections')
      if (!storedInspections) {
        localStorage.setItem(
          'inspections',
          serializeInspection((mockInspections as unknown) as Inspection),
        )
      }
    }
  } catch (error) {
    console.error('Error initializing localStorage:', error)
  }
}

// Get all inspections
export const getAllInspections = async (): Promise<Inspection[]> => {
  try {
    if (typeof window !== 'undefined') {
      initializeLocalStorage()
      const storedInspections = localStorage.getItem('inspections')
      if (storedInspections) {
        const inspections: Inspection[] = JSON.parse(
          storedInspections,
          (key, value) => {
            if (
              key === 'conducted_on' ||
              key === 'last_modified' ||
              key === 'completed_on' ||
              key === 'dueDate'
            ) {
              return value ? new Date(value) : value
            }
            return value
          },
        )
        return inspections
      }
    }
    return mockInspections
  } catch (error) {
    console.error('Error getting inspections:', error)
    return mockInspections
  }
}

// Get inspection by ID
export const getInspectionById = async (
  id: string,
): Promise<Inspection | null> => {
  try {
    const inspections = await getAllInspections()
    return inspections.find((inspection) => inspection.id === id) || null
  } catch (error) {
    console.error('Error getting inspection by ID:', error)
    return null
  }
}

// Create a new inspection
export const createInspection = async (
  inspection: Omit<Inspection, 'id'>,
): Promise<Inspection> => {
  const newInspection: Inspection = {
    ...inspection,
    id: uuidv4(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: 'pending' as const,
    total_points_earned: 0,
    total_points_possible: 0,
    critical_violations: 0,
    major_violations: 0,
    minor_violations: 0,
    section_scores: [],
    responses: [],
    violations: [],
  }
  mockInspections.push(newInspection)
  return newInspection
}

// Update an existing inspection
export const updateInspection = async (
  inspection: Inspection,
): Promise<Inspection> => {
  try {
    const inspections = await getAllInspections()
    const index = inspections.findIndex((i) => i.id === inspection.id)

    if (index === -1) {
      throw new Error(`Inspection with ID ${inspection.id} not found`)
    }

    inspections[index] = {
      ...inspection,
      updated_at: new Date().toISOString(),
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'inspections',
        serializeInspection((inspections as unknown) as Inspection),
      )
    }

    return inspections[index]
  } catch (error) {
    console.error('Error updating inspection:', error)
    throw error
  }
}

// Delete an inspection
export const deleteInspection = async (id: string): Promise<void> => {
  try {
    const inspections = await getAllInspections()
    const updatedInspections = inspections.filter(
      (inspection) => inspection.id !== id,
    )

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'inspections',
        serializeInspection((updatedInspections as unknown) as Inspection),
      )
    }
  } catch (error) {
    console.error('Error deleting inspection:', error)
    throw error
  }
}

// Create a default inspection template
export const createDefaultInspection = (
  name: string,
  locationId: string,
): Omit<Inspection, 'id'> => {
  const now = new Date()
  return {
    title: name,
    description: null,
    organization_id: locationId,
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
    prepared_by: '',
    assignee_id: null,
    assignee_ids: [],
    site_id: null,
    site: null,
    template_id: null,
    template: null,
    schedule_id: null,
    status: 'pending' as const,
    started_at: null,
    completed_at: null,
    paused_at: null,
    due_date: null,
    passed: null,
    final_grade: null,
    final_score: null,
    total_points_earned: 0,
    total_points_possible: 0,
    critical_violations: 0,
    major_violations: 0,
    minor_violations: 0,
    section_scores: [],
    responses: [],
    violations: [],
    pages: [],
  }
}

export const saveInspection = async (inspection: Inspection): Promise<void> => {
  try {
    const inspections = await getAllInspections()
    const existingIndex = inspections.findIndex((i) => i.id === inspection.id)

    if (existingIndex !== -1) {
      inspections[existingIndex] = inspection
    } else {
      inspections.push(inspection)
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'inspections',
        serializeInspection((inspections as unknown) as Inspection),
      )
    }
  } catch (error) {
    console.error('Error saving inspection:', error)
    throw error
  }
}
