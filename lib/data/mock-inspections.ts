import { v4 as uuidv4 } from 'uuid'
import { mockLocations } from './mock-locations'
import type { Inspection } from '@/lib/types/inspection-types'

// Initial mock data
const mockInspections: Inspection[] = [
  {
    id: 'insp-001',
    name: 'Construction Site Safety Inspection',
    conducted_on: new Date(2023, 2, 15),
    location: mockLocations[0],
    sections: [
      {
        id: 'section-001',
        name: 'General Safety',
        questions: [
          {
            id: 'q-001-001',
            name: 'Is all required PPE available?',
            response: null,
            score: 0,
            note: '',
            attachment: null,
            action: null,
          },
          {
            id: 'q-001-002',
            name: 'Are emergency exits clear and accessible?',
            response: null,
            score: 0,
            note: '',
            attachment: null,
            action: null,
          },
          {
            id: 'q-001-003',
            name: 'Are safety signs properly displayed?',
            response: null,
            score: 0,
            note: '',
            attachment: null,
            action: null,
          },
        ],
      },
      {
        id: 'section-002',
        name: 'Electrical Safety',
        questions: [
          {
            id: 'q-002-001',
            name: 'Are electrical panels accessible and labeled?',
            response: null,
            score: 0,
            note: '',
            attachment: null,
            action: null,
          },
          {
            id: 'q-002-002',
            name: 'Are extension cords in good condition?',
            response: null,
            score: 0,
            note: '',
            attachment: null,
            action: null,
          },
          {
            id: 'q-002-003',
            name: 'Are GFCI devices used where required?',
            response: null,
            score: 0,
            note: '',
            attachment: null,
            action: null,
          },
        ],
      },
      {
        id: 'section-003',
        name: 'Equipment Safety',
        questions: [
          {
            id: 'q-003-001',
            name: 'Are equipment inspections up to date?',
            response: null,
            score: 0,
            note: '',
            attachment: null,
            action: null,
          },
          {
            id: 'q-003-002',
            name: 'Are equipment operators properly trained?',
            response: null,
            score: 0,
            note: '',
            attachment: null,
            action: null,
          },
          {
            id: 'q-003-003',
            name: 'Is backup alarm functional on heavy equipment?',
            response: null,
            score: 0,
            note: '',
            attachment: null,
            action: null,
          },
        ],
      },
    ],
    user_name: '',
    status: 'draft',
    last_modified: new Date(),
    score: null,
  },
  {
    id: 'insp-002',
    name: 'Monthly Equipment Inspection',
    conducted_on: new Date(2023, 3, 5),
    location: mockLocations[2],
    sections: [
      {
        id: 'section-001',
        name: 'General Equipment Check',
        questions: [
          {
            id: 'q-001-001',
            name: 'Is equipment clean and free of debris?',
            response: true,
            score: 10,
            note: '',
            attachment: null,
            action: null,
          },
          {
            id: 'q-001-002',
            name: 'Are all guards and shields in place?',
            response: true,
            score: 10,
            note: '',
            attachment: null,
            action: null,
          },
          {
            id: 'q-001-003',
            name: 'Are all labels and warnings legible?',
            response: true,
            score: 10,
            note: '',
            attachment: null,
            action: null,
          },
        ],
      },
      {
        id: 'section-002',
        name: 'Hydraulic System',
        questions: [
          {
            id: 'q-002-001',
            name: 'Are hydraulic fluid levels within range?',
            response: true,
            score: 10,
            note: '',
            attachment: null,
            action: null,
          },
          {
            id: 'q-002-002',
            name: 'Are there any visible leaks?',
            response: false,
            score: 0,
            note: 'Small leak observed at the main pump connection',
            attachment: null,
            action: {
              id: 'action-001',
              title: 'Repair hydraulic leak',
              priority: 'medium',
              dueDate: new Date(2023, 3, 12),
              assignee: 'john.technician',
              site: 'main-site',
              asset: 'hydraulic-pump-01',
              label: 'maintenance',
            },
          },
          {
            id: 'q-002-003',
            name: 'Are hoses free from cracks or damage?',
            response: true,
            score: 10,
            note: '',
            attachment: null,
            action: null,
          },
        ],
      },
    ],
    user_name: 'Mark Johnson',
    status: 'completed',
    last_modified: new Date(2023, 3, 5),
    completed_on: new Date(2023, 3, 5),
    score: 83,
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
  try {
    const inspections = await getAllInspections()
    const newInspection = {
      ...inspection,
      id: uuidv4(),
      last_modified: new Date(),
    }

    const updatedInspections = [...inspections, newInspection]

    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'inspections',
        serializeInspection((updatedInspections as unknown) as Inspection),
      )
    }

    return newInspection
  } catch (error) {
    console.error('Error creating inspection:', error)
    throw error
  }
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
      last_modified: new Date(),
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
): Inspection => {
  const location =
    mockLocations.find((loc) => loc.id === locationId) || mockLocations[0]

  return {
    id: uuidv4(),
    name,
    conducted_on: new Date(),
    location,
    sections: [
      {
        id: uuidv4(),
        name: 'General Information',
        questions: [
          {
            id: uuidv4(),
            name: 'Is all required PPE available?',
            response: null,
            score: 0,
            note: '',
            attachment: null,
            action: null,
          },
          {
            id: uuidv4(),
            name: 'Are emergency exits clear and accessible?',
            response: null,
            score: 0,
            note: '',
            attachment: null,
            action: null,
          },
        ],
      },
    ],
    user_name: '',
    status: 'draft',
    last_modified: new Date(),
    score: null,
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
