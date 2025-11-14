"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signUp, createOrganization } from "../../actions/actions";
import { Progress } from "@/components/ui/progress";
import SignUpStep from "../components/sign-up-step";
import OrganizationStep from "../components/organization-step";

const steps = [
  { id: "signup", title: "Account Details" },
  { id: "organization", title: "Organization Details" },
];

export default function MultiStepForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(new FormData());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  const handleStepSubmit = async (stepData: FormData) => {
    for (const [key, value] of stepData.entries()) {
      formData.set(key, value);
    }
    setFormData(formData);

    if (currentStep === 0) {
      // Handle sign up
      const res = await signUp(formData);
      //@ts-expect-error - res user is not typed
      setUser(res?.user);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      setCurrentStep(1);
    } else if (currentStep === 1) {
      // Handle organization creation
      setIsSubmitting(true);
      const res = await createOrganization(formData, user!);
      if (!res) {
        toast.error("Failed to create organization");
        return;
      }
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success(res.success);
      router.push("/auth/login");
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          {steps[currentStep].title}
        </h2>
        <p className="text-muted-foreground">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>

      <Progress value={progress} className="w-full" />

      {currentStep === 0 && (
        <SignUpStep onSubmit={handleStepSubmit} isSubmitting={isSubmitting} />
      )}

      {currentStep === 1 && (
        <OrganizationStep
          onSubmit={handleStepSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
