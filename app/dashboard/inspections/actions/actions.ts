'use server'

export async function createInspection(formData: FormData) {
  const inspectionName = formData.get('inspection-name')
  const locationId = formData.get('location')
  const assignedTo = formData.get('assigned-to')
  const preparedBy = formData.get('prepared-by')
  const scheduledDate = formData.get('scheduled-date')

  const inspection = {
    name: inspectionName,
    location: locationId,
    assignedTo: assignedTo,
    preparedBy: preparedBy,
    scheduledDate: scheduledDate,
  }

  console.log('inspection data', inspection)
}
