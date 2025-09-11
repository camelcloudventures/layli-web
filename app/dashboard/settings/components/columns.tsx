"use client";

import { formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Loader2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoleActionItem } from "./role-action-item";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { updateUserRole } from "../actions/actions";
import { toast } from "sonner";
import { useState } from "react";
import { Invite } from "./user-management";
import { useInvitesStore } from "@/store/invites";

function getRoleBadgeColor(role: string) {
  switch (role) {
    case "admin":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100/80 dark:bg-purple-900/30 dark:text-purple-300";
    case "supervisor":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-300";
    case "auditor":
      return "bg-orange-100 text-orange-800 hover:bg-orange-100/80 dark:bg-orange-900/30 dark:text-orange-300";
    default:
      return "";
  }
}

function getStatusBadgeColor(status: string) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "invited":
      return "bg-yellow-100 text-yellow-800";
    case "inactive":
      return "bg-gray-100 text-gray-800";
    default:
      return "";
  }
}

function getUserStatus(used: boolean) {
  return used ? "active" : "invited";
}

function capitalize(str: string) {
  return str?.charAt(0)?.toUpperCase() + str.slice(1);
}

function ActionsCell({ user }: { user: Invite }) {
  const [isLoading, setIsLoading] = useState(false);
  const updateInviteRoleInStore = useInvitesStore(
    (state) => state.updateInviteRole
  );
  const isActive = getUserStatus(user.used) === "active";

  const handleRoleChange = async (userId: string, role: string) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await updateUserRole(userId, role);
      updateInviteRoleInStore(userId, role as Invite["role"]);
      toast.success(`Role updated to ${role} successfully`);
    } catch {
      toast.error("Failed to update role");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader2 className="h-4 w-4 animate-spin" />;
  }

  if (isActive) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-10 bg-white" align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <RoleActionItem
            user={user}
            role="admin"
            onChange={handleRoleChange}
            disabled={isLoading}
          />
          <RoleActionItem
            user={user}
            role="supervisor"
            onChange={handleRoleChange}
            disabled={isLoading}
          />
          <RoleActionItem
            user={user}
            role="auditor"
            onChange={handleRoleChange}
            disabled={isLoading}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          aria-disabled="true"
          className="inline-flex opacity-50 cursor-not-allowed"
          tabIndex={0}
        >
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 pointer-events-none"
            tabIndex={-1}
            aria-label="Actions unavailable"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent className="">
        <p className="font-medium">
          Role changes are only available for active users.
        </p>
      </TooltipContent>
    </Tooltip>
  );
}

export const columns: ColumnDef<Invite>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge className={getRoleBadgeColor(row.original.role)}>
        {capitalize(row.original.role)}
      </Badge>
    ),
  },
  {
    accessorKey: "used",
    header: "Status",
    cell: ({ row }) => {
      const status = getUserStatus(row.original.used);
      return (
        <Badge className={getStatusBadgeColor(status)}>
          {capitalize(status)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Invited At",
    cell: ({ row }) => {
      return <span>{formatDate(row.original.created_at)}</span>;
    },
  },

  // actions
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell user={row.original} />,
  },
];
