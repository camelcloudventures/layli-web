"use client";

import { useState } from "react";
import Link from "next/link";
import SubmitBtn from "@/components/custom/submit-btn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface SignUpStepProps {
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function SignUpStep({
  onSubmit,
  isSubmitting,
}: SignUpStepProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  function handleTermsChange(checked: boolean | "indeterminate") {
    setAcceptedTerms(checked === true);
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" name="fullName" placeholder="John Doe" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          required
          type="email"
          placeholder="name@example.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="tel"
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
      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={acceptedTerms}
          onCheckedChange={handleTermsChange}
          required
        />
        <Label
          htmlFor="terms"
          className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I agree to the{" "}
          <Link
            href="https://en.wikipedia.org/wiki/Terms_of_service"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4 hover:text-primary/80"
          >
            terms and conditions
          </Link>
        </Label>
      </div>
      <SubmitBtn
        label={isSubmitting ? "Creating Account..." : "Create Account"}
        variant="default"
        className="w-full"
        isDisabled={isSubmitting || !acceptedTerms}
      />
    </form>
  );
}
