import { updateProfile } from '@/app/auth/actions/actions'
import { toast } from 'sonner'
import { useState } from 'react'
import { uploadImage } from '@/utils/common'
import { useAuth } from '@/lib/context/auth-provider'

export function useUserProfile() {
  const { user, refreshUser } = useAuth()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  async function handleUpdateProfile(formData: FormData) {
    let imageUrl = user?.image || ''
    if (selectedFile) {
      setUploading(true)
      const { fileUrl, error } = await uploadImage(
        { file: selectedFile },
        'avatars',
      )
      setUploading(false)
      if (error) {
        toast.error(error)
        return
      }
      imageUrl = fileUrl || ''
    }
    if (imageUrl) formData.set('image', imageUrl)
    const res = await updateProfile(formData)
    if (res.error) toast.error(res.error)
    if (res.success) {
      toast.success(res.success)
      await refreshUser()
      setSelectedFile(null)
      setPreviewUrl(null)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  return {
    handleAvatarChange,
    handleUpdateProfile,
    getInitials,
    selectedFile,
    previewUrl,
    uploading,
  }
}
