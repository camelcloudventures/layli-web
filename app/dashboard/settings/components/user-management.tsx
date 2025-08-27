"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

import { inviteUser } from "@/app/dashboard/settings/actions/actions";
import { DataTable } from "@/components/custom/data-table";
import SubmitBtn from "@/components/custom/submit-btn";
import { useAuth } from "@/lib/context/auth-provider";
import { Plus, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { columns } from "./columns";
import { SitesForm } from "./sites-form";
import { SiteFormData } from "../actions/types";

type UserRole = "admin" | "auditor" | "supervisor";

export interface Invite {
  id: string;
  email: string;
  role: UserRole;
  token: string;
  invited_by: string;
  created_at: string;
  used: boolean;
}

export function UserManagement({ invites }: { invites: Invite[] }) {
  const { user, activeOrg } = useAuth();

  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isCreateSiteDialogOpen, setIsCreateSiteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    role: "auditor" as UserRole,
  });

  const handleInviteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInviteForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleInviteSubmit = async (formData: FormData) => {
    setIsLoading(true);
    const res = await inviteUser(
      formData,
      user?.id || "",
      inviteForm.role,
      activeOrg?.id || ""
    );
    setIsLoading(false);
    if (res?.error) {
      toast.error(res?.error || "Invitation failed, please try again.");
      return;
    }
    toast.success(res?.success);
    setInviteForm({ role: inviteForm.role });
    setIsInviteDialogOpen(false);
  };

  const handleSiteSubmit = (data: SiteFormData) => {
    console.log("Site data:", data);
    setIsCreateSiteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Users</h3>
        <div className="flex flex-row gap-4 items-center">
          <Dialog
            open={isCreateSiteDialogOpen}
            onOpenChange={setIsCreateSiteDialogOpen}
          >
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreateSiteDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Site
              </Button>
            </DialogTrigger>
            <DialogContent className="p-6 max-h-[90vh] overflow-y-auto sm:max-w-[600px] overflow-hidden hover:overflow-y-auto scrollbar-none">
              <DialogHeader>
                <DialogTitle>Create a new site</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new site.
                </DialogDescription>
              </DialogHeader>
              <SitesForm onSubmit={handleSiteSubmit} />
            </DialogContent>
          </Dialog>
          <Dialog
            open={isInviteDialogOpen}
            onOpenChange={setIsInviteDialogOpen}
          >
            <DialogTrigger asChild>
              <Button onClick={() => setIsInviteDialogOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite User
              </Button>
            </DialogTrigger>
            <DialogContent className="p-6 max-h-[90vh] overflow-y-auto sm:max-w-[600px] overflow-hidden hover:overflow-y-auto scrollbar-none">
              <DialogHeader>
                <DialogTitle>Invite a new user</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your organization.
                </DialogDescription>
              </DialogHeader>
              <form action={handleInviteSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      onChange={handleInviteChange}
                      placeholder="user@example.com"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={inviteForm.role}
                      onValueChange={(value) =>
                        setInviteForm((prev) => ({
                          ...prev,
                          role: value as UserRole,
                        }))
                      }
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="auditor">Auditor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <SubmitBtn
                    label={isLoading ? "Sending..." : "Send Invitation"}
                    variant="default"
                    className=""
                    isDisabled={isLoading}
                  />
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border rounded-md">
        <DataTable
          columns={columns}
          //@ts-expect-error -0expects invites to be typed
          data={invites}
        />
      </div>
    </div>
  );
}
