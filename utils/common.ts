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
    console.error('User not found during image upload')
    return { error: 'User not found' }
  }

  const fileExt = fileData.file.name.split('.').pop()
  const timestamp = Date.now()
  const fileName = `template-${timestamp}.${fileExt}`
  const originalFileName = fileData.file.name

  console.log('Attempting to upload file:', {
    fileName,
    fileSize: fileData.file.size,
    fileType: fileData.file.type,
    bucketName,
    userId: user.id,
  })

  try {
    const { error: extensionError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileData.file, {
        upsert: true,
        cacheControl: '3600',
        contentType: fileData.file.type,
        duplex: 'half',
      })

    if (extensionError) {
      console.log('Supabase storage upload error:', {
        error: extensionError,
        message: extensionError.message,
        name: extensionError.name,
        userId: user.id,
      })
      return { error: extensionError.message }
    }

    // Update the file's owner to match the user
    const { error: updateError } = await supabase
      .from('storage.objects')
      .update({ owner: user.id })
      .eq('name', fileName)
      .eq('bucket_id', bucketName)

    if (updateError) {
      console.log('Error updating file owner:', {
        error: updateError,
        message: updateError.message,
        userId: user.id,
      })
    }

    const { data: fileUrl } = await supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName)

    console.log('File uploaded successfully:', {
      fileName,
      publicUrl: fileUrl.publicUrl,
      userId: user.id,
    })

    return {
      success: 'Image uploaded successfully',
      fileUrl: fileUrl.publicUrl,
      originalFileName,
    }
  } catch (error) {
    console.error('Unexpected error during image upload:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to upload image',
    }
  }
}

export async function attachInspectionFile(fileData: File, bucketName: string) {
  const supabase = await createClient()

  const fileName = fileData.name

  try {
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileData, {
        upsert: true,
        cacheControl: '3600',
        contentType: fileData.type || 'application/octet-stream',
      })

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError)
      return { error: uploadError.message }
    }

    const { data: fileUrl } = await supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName)

    console.log('file url', fileUrl.publicUrl)

    const newFileData = {
      fileName: fileData.name,
      file_path: fileUrl.publicUrl,
      file_size: fileData.size || 0,
      mime_type: fileData.type || 'application/octet-stream',
    }

    return { success: 'File uploaded successfully', fileData: newFileData }
  } catch (error) {
    console.error('Unexpected error during file upload:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to upload file',
    }
  }
}

export async function deleteInspectionFile(
  filePath: string,
  bucketName: string,
) {
  try {
    const supabase = await createClient()
    const fileName = filePath.split('/').pop()

    console.log('fileName', fileName)
    if (!fileName) {
      return { error: 'File name not found' }
    }

    await supabase.storage.from(bucketName).remove([fileName])

    return { success: 'File deleted successfully' }
  } catch (error) {
    console.error('Unexpected error during file deletion:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to delete file',
    }
  }
}
