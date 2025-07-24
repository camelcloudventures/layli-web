'use client'
import { Permission, hasPermission } from '@/lib/auth/auth'
import { useAuth } from '@/lib/context/auth-provider'
import React from 'react'

export default function HasPermission({
  permission,
  children,
}: {
  permission: Permission
  children: React.ReactNode
}) {
  const { user } = useAuth()
  const canAccess = hasPermission(user, permission)

  if (!canAccess) return null

  return <>{children}</>
}
