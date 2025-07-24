import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import type { Invite } from '@/app/dashboard/settings/components/columns'
import { Loader2 } from 'lucide-react'

interface RoleActionItemProps {
  user: Invite
  role: string
  onChange: (userId: string, role: string) => void
  disabled?: boolean
}

export function RoleActionItem({
  user,
  role,
  onChange,
  disabled,
}: RoleActionItemProps) {
  function handleClick() {
    if (user.role !== role) onChange(user.user_id, role)
  }

  return (
    <DropdownMenuItem
      onClick={handleClick}
      disabled={disabled || user.role === role}
      tabIndex={0}
      aria-label={`Set as ${role}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleClick()
      }}
    >
      {disabled ? (
        <div className="flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Updating...
        </div>
      ) : (
        `Set as ${role.charAt(0).toUpperCase() + role.slice(1)}`
      )}
    </DropdownMenuItem>
  )
}
