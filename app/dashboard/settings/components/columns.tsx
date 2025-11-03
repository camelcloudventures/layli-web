"use client";

import { formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Loader2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoleActionItem } from "./role-action-item";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import {
  updateUserRole,
  removeUser,
  revokeInvite,
  resendInvite,
} from "../actions/actions";
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
  const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useState(false);
  const [isResendDialogOpen, setIsResendDialogOpen] = useState(false);

  const updateInviteRoleInStore = useInvitesStore(
    (state) => state.updateInviteRole
  );
  const removeUserFromStore = useInvitesStore((state) => state.removeUser);
  const revokeInviteInStore = useInvitesStore((state) => state.revokeInvite);
  const resendInviteInStore = useInvitesStore((state) => state.resendInvite);

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

  const handleRemoveUser = async () => {
    if (!user.user_id) return;
    setIsLoading(true);
    try {
      const res = await removeUser(user.user_id);
      if (res?.error) {
        toast.error(res?.error || "Failed to remove user");
        return;
      }
      removeUserFromStore(user.user_id);
      toast.success(res?.success || "User removed successfully");
    } catch {
      toast.error("Failed to remove user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeInvite = async () => {
    setIsLoading(true);
    try {
      const res = await revokeInvite(user.id);
      if (res?.error) {
        toast.error(res?.error || "Failed to revoke invite");
        return;
      }
      revokeInviteInStore(user.id);
      toast.success(res?.success || "Invite revoked successfully");
      setIsRevokeDialogOpen(false);
    } catch {
      toast.error("Failed to revoke invite");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendInvite = async () => {
    setIsLoading(true);
    try {
      const res = await resendInvite(user.id);
      if (res?.error) {
        toast.error(res?.error || "Failed to resend invite");
        return;
      }
      if (res?.data) {
        resendInviteInStore(user.id, res.data as Invite);
      }
      toast.success(res?.success || "Invite resent successfully");
      setIsResendDialogOpen(false);
    } catch {
      toast.error("Failed to resend invite");
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
          <DeleteDialog
            title="Remove User"
            description={`Are you sure you want to remove ${user.email} from this organization? This action cannot be undone.`}
            onDelete={handleRemoveUser}
            trigger={
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                tabIndex={0}
                aria-label="Remove user"
              >
                Remove User
              </DropdownMenuItem>
            }
          />
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
    <>
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
          <DropdownMenuItem
            onClick={() => setIsRevokeDialogOpen(true)}
            disabled={isLoading || user.revoked}
            tabIndex={0}
            aria-label="Revoke invite"
          >
            Revoke Invite
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsResendDialogOpen(true)}
            disabled={isLoading || user.revoked}
            tabIndex={0}
            aria-label="Resend invite"
          >
            Resend Invite
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isRevokeDialogOpen}
        onOpenChange={setIsRevokeDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Invite</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke the invitation for {user.email}?
              They will no longer be able to use this invitation to join the
              organization.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevokeInvite}
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Revoking...
                </>
              ) : (
                "Revoke Invite"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isResendDialogOpen}
        onOpenChange={setIsResendDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resend Invite</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to resend the invitation to {user.email}? A
              new invitation email will be sent to them.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResendInvite}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resending...
                </>
              ) : (
                "Resend Invite"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
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
