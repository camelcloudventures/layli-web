"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitBtn from "@/components/custom/submit-btn";
import { toast } from "sonner";
import { acceptInvite } from "../../actions/actions";
import { useSearchParams } from "next/navigation";

export default function InviteForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [fullUrl, setFullUrl] = useState("");
  useEffect(() => {
    const fullUrl = window.location.href;
    setFullUrl(fullUrl);
  }, []);

  const params = useSearchParams();
  const role = params.get("role");
  const token = params.get("token");
  const orgId = params.get("org_id");

  if (!token || !role) {
    return <div>Missing invite token or role</div>;
  }

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    const res = await acceptInvite(formData, fullUrl, role!, token!, orgId!);
    console.log("=============THIS FUNCTION  WAS CALLED=============");
    console.log("res", res);
    setIsLoading(false);

    if (res?.error) toast.error(res.error);
    if (res?.success) {
      toast.success(res.success);
      setTimeout(() => {
        window.location.href = "/dashboard/settings";
      }, 1000);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          name="fullName"
          placeholder="John Doe"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="number"
          placeholder="1234567890"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          required
        />
      </div>
      <SubmitBtn
        label={isLoading ? "Submitting..." : "Accept Invite"}
        variant="default"
        className="w-full"
        isDisabled={isLoading}
      />
    </form>
  );
}
