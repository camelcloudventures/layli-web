export interface ResponseData {
  question_id: number
  value: string
  selected_options: number[]
  response_value: string
  location_data?: {
    address: string
    latitude: number
    longitude: number
    place_id?: string
  } | null
  file_attachments?: {
    filename: string
    file_path: string
    file_size: number
    mime_type: string
  }[]
  inspector_notes?: string
}
