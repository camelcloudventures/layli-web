"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import { useAuth } from "@/lib/context/auth-provider";
import SubmitBtn from "@/components/custom/submit-btn";
import { useUserProfile } from "../hooks/useUserProfile";
import { useOrganizationUpdate } from "../hooks/useOrganizationUpdate";

export function UserProfileForm() {
  const { user, activeOrg } = useAuth();
  const {
    handleUpdateProfile,
    getInitials,
    previewUrl,
    handleAvatarChange,
    uploading,
  } = useUserProfile();
  const { handleUpdateOrganization, updating } = useOrganizationUpdate();

  return (
    <>
      <form action={handleUpdateProfile} className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={previewUrl || user?.image || ""} alt={"User"} />
            <AvatarFallback className="text-lg">
              {user?.full_name ? getInitials(user.full_name) : "U"}
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
          label={uploading ? "Uploading..." : "Save Changes"}
          variant="default"
          className=""
          isDisabled={uploading}
        />
      </form>

      {activeOrg && (
        <div className="mt-8 pt-8 border-t">
          <h2 className="text-lg font-semibold mb-4">Organization Settings</h2>
          <form action={handleUpdateOrganization} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input
                  id="organizationName"
                  name="name"
                  defaultValue={activeOrg?.name}
                  required
                />
              </div>
            </div>

            <SubmitBtn
              label={updating ? "Updating..." : "Update Organization"}
              variant="default"
              className=""
              isDisabled={updating}
            />
          </form>
        </div>
      )}
    </>
  );
}
