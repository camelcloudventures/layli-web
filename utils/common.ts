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

export async function attachInspectionFile(
  fileData: {
    name: string
    type: string
    size: number
    uri: string
  },
  bucketName: string,
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    console.error('User not found during image upload')
    return { error: 'User not found' }
  }

  const fileExt = fileData.name.split('.').pop()
  const timestamp = Date.now()
  const fileName = `template-${timestamp}.${fileExt}`
  const originalFileName = fileData.name

  console.log('Attempting to upload file:', {
    fileName,
    fileSize: fileData.size,
    fileType: fileData.type,
    bucketName,
    userId: user?.id,
  })

  try {
    // Convert URI to Blob for upload
    const response = await fetch(fileData.uri)
    const blob = await response.blob()

    const { error: extensionError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, blob, {
        upsert: true,
        cacheControl: '3600',
        contentType: fileData.type,
        duplex: 'half',
      })

    if (extensionError) {
      console.log('Supabase storage upload error:', {
        error: extensionError,
        message: extensionError.message,
        name: extensionError.name,
        userId: user?.id,
      })
      return { error: extensionError.message }
    }

    // Update the file's owner to match the user
    const { error: updateError } = await supabase
      .from('storage.objects')
      .update({ owner: user?.id })
      .eq('name', fileName)
      .eq('bucket_id', bucketName)

    if (updateError) {
      console.log('Error updating file owner:', {
        error: updateError,
        message: updateError.message,
        userId: user?.id,
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

export async function deleteInspectionFile(
  filePath: string,
  bucketName: string,
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    console.error('User not found during file deletion')
    return { error: 'User not found' }
  }

  try {
    // Extract filename from the full path
    const fileName = filePath.split('/').pop()
    if (!fileName) {
      return { error: 'Invalid file path' }
    }

    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([fileName])

    if (deleteError) {
      console.log('Supabase storage delete error:', {
        error: deleteError,
        message: deleteError.message,
        name: deleteError.name,
        userId: user?.id,
      })
      return { error: deleteError.message }
    }

    console.log('File deleted successfully:', {
      fileName,
      userId: user.id,
    })

    return { success: 'File deleted successfully' }
  } catch (error) {
    console.error('Unexpected error during file deletion:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to delete file',
    }
  }
}
