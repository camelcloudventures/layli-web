import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { Invite } from "@/app/dashboard/settings/components/user-management";

interface RoleActionItemProps {
  user: Invite;
  role: string;
  onChange: (userId: string, role: string) => void;
}

export function RoleActionItem({ user, role, onChange }: RoleActionItemProps) {
  function handleClick() {
    if (user.role !== role) onChange(user.id as string, role);
  }

  return (
    <DropdownMenuItem
      onClick={handleClick}
      disabled={user.role === role}
      tabIndex={0}
      aria-label={`Set as ${role}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
    >
      Set as {role.charAt(0).toUpperCase() + role.slice(1)}
    </DropdownMenuItem>
  );
}
