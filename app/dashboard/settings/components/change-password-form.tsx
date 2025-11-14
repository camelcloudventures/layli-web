"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import SubmitBtn from "@/components/custom/submit-btn";
import { changePasswordAction } from "../actions/actions";
import { useAuth } from "@/lib/context/auth-provider";

export function ChangePasswordForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Client-side validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await changePasswordAction(formData);

      if (res.error) {
        toast.error(res.error);
        setIsSubmitting(false);
        return;
      }

      toast.success(
        "Password updated successfully. Please log in with your new password."
      );

      // Small delay to show the toast before redirect
      setTimeout(() => {
        router.push("/auth/login");
      }, 1000);
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          id="currentPassword"
          type="password"
          name="currentPassword"
          placeholder="••••••••"
          required
          disabled={isSubmitting}
          aria-label="Current password"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          name="newPassword"
          placeholder="••••••••"
          required
          minLength={8}
          disabled={isSubmitting}
          aria-label="New password"
        />
        <p className="text-sm text-muted-foreground">
          Must be at least 8 characters
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          required
          minLength={8}
          disabled={isSubmitting}
          aria-label="Confirm new password"
        />
      </div>

      <input type="hidden" name="email" value={user?.email || ""} />

      <SubmitBtn
        label={isSubmitting ? "Updating..." : "Change Password"}
        variant="default"
        className=""
        isDisabled={isSubmitting}
      />
    </form>
  );
}
