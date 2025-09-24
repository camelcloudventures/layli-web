"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { IssueCategory, IssuePriority } from "@/lib/types/issue-types";
import SelectIssueCategory from "./select-issue-category";
import ReportIssue from "./report-issue";
import { Assignee, User, Site } from "@/lib/types";
import SubmitBtn from "@/components/custom/submit-btn";
import { createIssue } from "../actions/actions";
import { toast } from "sonner";
import { useAuth } from "@/lib/context/auth-provider";
import { useIssuesStore } from "@/store/issues";

interface ReportIssueFormProps {
  users: User[];
  sites: Site[];
  onCancel: () => void;
}

export function ReportIssueForm({
  users,
  sites,
  onCancel,
}: ReportIssueFormProps) {
  const { user: currentUser } = useAuth();
  const { setIssues } = useIssuesStore();
  const [category, setCategory] = useState<IssueCategory>("safety");
  const [priority, setPriority] = useState<IssuePriority>("medium");
  const [title, setTitle] = useState("");
  const [selectedAssignees, setSelectedAssignees] = useState<Assignee[]>([]);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [uploadedImages, setUploadedImages] = useState<
    { uploadedUrl: string; originalFileName: string }[]
  >([]);

  const [step, setStep] = useState(1);

  function handleDateSelect(selectedDate: Date | undefined) {
    setDate(selectedDate);
  }

  const handleNextStep = () => {
    //Validate step 1
    if (step === 1) {
      if (!title.trim()) {
        toast.error("Please enter a title for this issue");
        return;
      }
      if (!category) {
        toast.error("Please select a category for this issue");
        return;
      }
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1);
    }
  };
  console.log("selectedAssignees", selectedAssignees);
  console.log("selectedSite", selectedSite);
  console.log("selectedDate", date);
  console.log("uploadedImages", uploadedImages);
  console.log("currentUser", currentUser);

  const handleSubmit = async (formData: FormData) => {
    // Validate site selection before submission
    if (!selectedSite) {
      toast.error("Please select a site for this issue");
      return;
    }

    formData.append("category", category);
    formData.append("priority", priority);
    formData.append("title", title);
    formData.append("date", date?.toISOString() || "");
    formData.append("site_id", selectedSite?.id || "");

    // Add uploaded images to form data
    if (uploadedImages.length > 0) {
      formData.append("images", JSON.stringify(uploadedImages));
    }

    const reporter = {
      id: currentUser?.id || "",
      full_name: currentUser?.full_name || "",
      email: currentUser?.email || "",
      role: currentUser?.role || "",
    };

    const response = await createIssue(formData, selectedAssignees, reporter);
    if (response.success) {
      toast.success(response.success);
      if (response.data) {
        setIssues((prevIssues) => [response.data, ...prevIssues]);
      }
      onCancel();
    } else {
      toast.error(response.error);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {step === 1 && (
        <SelectIssueCategory
          category={category}
          setCategory={setCategory}
          title={title}
          setTitle={setTitle}
        />
      )}

      {step === 2 && (
        <ReportIssue
          priority={priority}
          setPriority={setPriority}
          users={users}
          selectedAssignees={selectedAssignees}
          setSelectedAssignees={setSelectedAssignees}
          date={date}
          setDate={handleDateSelect}
          sites={sites}
          selectedSite={selectedSite}
          setSelectedSite={setSelectedSite}
          onImagesChange={setUploadedImages}
        />
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-2 pt-4">
        {step === 1 ? (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleNextStep}
              className="w-full sm:w-auto"
            >
              Next
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              className="w-full sm:w-auto"
            >
              Back
            </Button>
            <SubmitBtn
              label="Submit Issue"
              variant="default"
              className="w-full sm:w-auto"
            />
          </>
        )}
      </div>
    </form>
  );
}
