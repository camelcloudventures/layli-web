'use client'

import type React from 'react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Upload } from 'lucide-react'
import { useAuth } from '@/lib/context/auth-provider'
import { updateProfile } from '@/app/auth/actions/actions'
import SubmitBtn from '@/components/custom/submit-btn'
import { uploadImage } from '@/utils/common'

export function UserProfileForm() {
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

  console.log('user', user?.image)

  return (
    <form action={handleUpdateProfile} className="space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={previewUrl || user?.image || ''} alt={'User'} />
          <AvatarFallback className="text-lg">
            {user?.full_name ? getInitials(user.full_name) : 'U'}
          </AvatarFallback>
        </Avatar>
        <Button
          asChild
          type="button"
          variant="outline"
          size="sm"
          aria-label="Change Avatar"
        >
          <label tabIndex={0}>
            <Upload className="mr-2 h-4 w-4" />
            Change Avatar
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
              aria-label="Upload avatar"
              tabIndex={-1}
            />
          </label>
        </Button>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            defaultValue={user?.full_name}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={user?.email}
            disabled
          />
          <p className="text-sm text-muted-foreground">
            Email cannot be changed. Contact support for assistance.
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            defaultValue={user?.phone_number}
          />
        </div>
      </div>

      <SubmitBtn
        label={uploading ? 'Uploading...' : 'Save Changes'}
        variant="default"
        className=""
        isDisabled={uploading}
      />
    </form>
  )
}
