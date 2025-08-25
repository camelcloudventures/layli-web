"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Issue } from "@/lib/types";
import { closeIssue } from "../actions/actions";
import SubmitBtn from "@/components/custom/submit-btn";
import { useIssuesStore } from "@/store/issues";

interface CloseIssueProps {
  issue: Issue;
  onClose: () => void;
}

export default function CloseIssue({ issue, onClose }: CloseIssueProps) {
  const { setIssues } = useIssuesStore();
  const [solution, setSolution] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  // Check if issue is already closed
  const isAlreadyClosed = issue.status === "closed";

  const handleCloseIssue = async (formData: FormData) => {
    if (isAlreadyClosed) {
      toast.error("This issue is already closed");
      return;
    }

    const solutionText = formData.get("solution") as string;
    if (!solutionText) {
      toast.error("Please provide a solution before closing the issue");
      return;
    }

    setIsClosing(true);

    const response = await closeIssue(issue.id, solutionText);
    console.log("response for an issue", response);
    if (response) {
      //@ts-expect-error 047
      toast.success(response.success);
      //@ts-expect-error 047
      if (response.data) {
        setIssues((prevIssues) =>
          prevIssues.map((i) => (i.id === issue.id ? response.data : i))
        );
      }
      onClose();
    } else {
      toast.error("Failed to close issue");
    }
    setIsClosing(false);
  };

  if (isAlreadyClosed) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Issue Already Closed
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            This issue has already been closed and cannot be closed again.
          </p>
        </div>
        <div className="mt-5 sm:mt-6">
          <Button type="button" className="w-full" onClick={onClose}>
            Close Dialog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form action={handleCloseIssue} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="solution" className="text-sm font-medium">
          Solution *
        </Label>
        <Textarea
          id="solution"
          name="solution"
          placeholder="Describe the solution implemented to resolve this issue..."
          className="min-h-[120px]"
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground">
          Please provide details about how this issue was resolved before
          closing it.
        </p>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isClosing}
        >
          Cancel
        </Button>
        <SubmitBtn
          label={isClosing ? "Closing..." : "Close Issue"}
          isDisabled={isClosing || !solution.trim()}
          variant="default"
          className="w-fit"
        />
      </div>
    </form>
  );
}
