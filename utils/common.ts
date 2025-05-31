'use server'

import { createClient } from './supabase/server'

export async function getUser() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    throw new Error(error.message)
  }
  return data.user
}

type FileData = {
  file: File
}

export async function uploadImage(fileData: FileData, bucketName: string) {
  const supabase = await createClient()
  const user = await getUser()
  if (!user) {
    return { error: 'User not found' }
  }

  const fileExt = fileData.file.name.split('.').pop()
  const timestamp = Date.now()
  const fileName = `template-${timestamp}.${fileExt}`
  const originalFileName = fileData.file.name

  const { error: extensionError } = await supabase.storage
    .from(bucketName)
    .upload(fileName, fileData.file, { upsert: true })

  if (extensionError) {
    console.error('extensionError', extensionError)
    return { error: extensionError.message }
  }

  const { data: fileUrl } = await supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName)

  return {
    success: 'Image uploaded successfully',
    fileUrl: fileUrl.publicUrl,
    originalFileName,
  }
}
