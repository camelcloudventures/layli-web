"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import TabsSwitcher from "@/components/custom/tab-switcher";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Download, Share2, Trash2, Loader2 } from "lucide-react";
import type { Issue, IssuePriority } from "@/lib/types/issue-types";
import Chip from "@/components/custom/chip";
import { Category, Priority, Status } from "@/lib/types";
import {
  addComment,
  updateIssue,
  addAttachments,
  removeAttachments,
} from "../actions/actions";

import { useFormStatus } from "react-dom";
import { uploadImage } from "@/utils/common";
import { generatePDF } from "@/utils/utils";
import { IssueStatus } from "@/lib/types/issue-types";
import { useAuth } from "@/lib/context/auth-provider";
import FileAttachments from "./file-attachments";
import DetailsTab from "./details-tab";
import ShareIssueDialog from "./share-issue-dialog";
import { useIssuesStore } from "@/store/issues";
import useIssue from "../hooks/useIssue";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface IssueDetailsProps {
  issue: Issue;
  onClose?: () => void;
  assignees: Array<{
    id: string;
    full_name: string;
    email: string;
    role: string;
  }>;
}

function IssueDetailsForm({ issue, assignees }: IssueDetailsProps) {
  const [currentTab, setCurrentTab] = useState("details");
  const [isDownloading, setIsDownloading] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [comment, setComment] = useState("");
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [status, setStatus] = useState<IssueStatus>(issue.status);
  const [priority, setPriority] = useState<IssuePriority>(issue.priority);

  const { pending } = useFormStatus();
  const { user: currentUser } = useAuth();

  const {
    uploadedImages,
    setUploadedImages,
    attachmentsToAdd,
    attachmentIdsToDelete,
    removeNewImage,
    removeExistingAttachment,
    addNewAttachment,
  } = useIssue();

  const handleAddComment = async () => {
    setIsSendingComment(true);
    const formData = new FormData();
    formData.append("comment", comment);

    const commenter = {
      id: currentUser?.id || "",
      full_name: currentUser?.full_name || "",
      email: currentUser?.email || "",
      role: currentUser?.role || "",
    };
    const res = await addComment(issue.id, formData, commenter);
    if (res?.success) {
      toast.success("Comment added successfully");
      setComment("");
    } else {
      toast.error((res?.error as string) || "Failed to add comment");
    }
    setIsSendingComment(false);
  };

  const handleDownloadPdf = () => {
    setIsDownloading(true);
    try {
      const doc = generatePDF(issue);
      setTimeout(() => {
        const safeTitle = issue.title
          ? issue.title
              .replace(/[^a-zA-Z0-9\s-]/g, "")
              .replace(/\s+/g, "-")
              .toLowerCase()
          : "untitled-issue";
        doc.save(`${safeTitle}.pdf`);
        toast.success("PDF downloaded successfully");
        setIsDownloading(false);
      }, 800);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
      setIsDownloading(false);
    }
  };

  function handleShare() {
    setShowShareDialog(true);
  }

  const handleFileUpload = useCallback(
    async (file: File) => {
      const imageId = crypto.randomUUID();
      const newImage = {
        id: imageId,
        file,
        preview: URL.createObjectURL(file),
        isUploading: true,
      };
      setUploadedImages((prev) => [...prev, newImage]);

      try {
        const result = await uploadImage({ file }, "issues-image");
        if (result.success && result.fileUrl) {
          setUploadedImages((prev) =>
            prev.map((img) =>
              img.id === imageId
                ? { ...img, uploadedUrl: result.fileUrl, isUploading: false }
                : img
            )
          );
          addNewAttachment(file.name, result.fileUrl);
          toast.success("Image ready for upload");
        } else {
          setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
          toast.error(result.error || "Failed to upload image");
        }
      } catch {
        setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
        toast.error("Failed to upload image");
      }
    },
    [addNewAttachment, setUploadedImages]
  );

  return (
    <div className="">
      <input
        type="hidden"
        name="attachmentsToAdd"
        value={JSON.stringify(attachmentsToAdd)}
      />
      <input
        type="hidden"
        name="attachmentIdsToDelete"
        value={JSON.stringify(attachmentIdsToDelete)}
      />

      <div className="flex flex-col mb-4 space-y-1.5">
        <div className="flex my-4 items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Category:
            </span>
            <Chip type="category" value={issue.category as Category} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Priority:
            </span>
            <Chip type="priority" value={issue.priority as Priority} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Status:
            </span>
            <Chip type="status" value={issue.status as Status} />
          </div>
        </div>
        <div className="gap-3 flex flex-col">
          <div className="gap-2 flex flex-col">
            <label htmlFor="issue-title" className="text-sm font-medium">
              Title
            </label>
            <Input id="issue-title" name="title" defaultValue={issue.title} />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              Reported by {issue.reporter?.full_name} on{" "}
              {new Date(issue.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="cause" className="text-lg font-medium mb-2">
            Cause
          </Label>
          <Textarea id="cause" name="cause" defaultValue={issue?.cause || ""} />
        </div>
      </div>
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="priority" value={priority} />
      <TabsSwitcher
        defaultValue="details"
        value={currentTab}
        onValueChange={setCurrentTab}
        tabs={[
          {
            value: "details",
            label: "Details",
            content: (
              <DetailsTab
                issue={issue}
                status={status}
                priority={priority}
                setStatus={setStatus}
                setPriority={setPriority}
                comment={comment}
                setComment={setComment}
                pending={pending}
                isSendingComment={isSendingComment}
                addComment={handleAddComment}
              />
            ),
          },
          {
            value: "files",
            label: "Files & Attachments",
            content: (
              <FileAttachments
                issue={issue}
                uploadedImages={uploadedImages}
                pending={pending}
                handleFileUpload={handleFileUpload}
                removeImage={removeNewImage}
                removeExistingAttachment={removeExistingAttachment}
                isRemovingAttachment={pending}
                attachmentIdsToDelete={attachmentIdsToDelete}
              />
            ),
          },
        ]}
      />

      <div className="flex justify-between pt-2">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {}}
            disabled={pending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleShare}
            disabled={pending}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Update assignees
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleDownloadPdf}
            disabled={pending}
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Update Issue
          </Button>
        </div>
      </div>

      <ShareIssueDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        issueId={issue.id}
        assignees={assignees}
        currentAssignees={issue.assignees}
      />
    </div>
  );
}

export function IssueDetails({ issue, onClose, assignees }: IssueDetailsProps) {
  const { issues, setIssues } = useIssuesStore();
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isUpdating, setIsUpdating] = useState(false);

  // Get the latest issue data from the store
  const currentIssue = issues.find((i) => i.id === issue.id) || issue;

  const handleUpdateIssue = async (formData: FormData) => {
    setIsUpdating(true);
    let success = true;
    let errorMessage = "Failed to update issue. Please try again.";
    let finalIssueData: Issue | null = null;

    try {
      // Step 1: Update core issue details
      const updateRes = await updateIssue(currentIssue.id, formData);
      console.log("updateRes", updateRes);
      if (!updateRes?.success) {
        success = false;
        errorMessage = updateRes?.error || errorMessage;
        throw new Error("Failed to update issue details.");
      }
      //@ts-expect-error - needs type
      finalIssueData = updateRes.data;

      // Step 2: Add new attachments
      const attachmentsToAdd = JSON.parse(
        formData.get("attachmentsToAdd") as string
      );
      if (attachmentsToAdd && attachmentsToAdd.length > 0) {
        const addRes = await addAttachments(currentIssue.id, attachmentsToAdd);
        if (!addRes?.success) {
          success = false;
          errorMessage = (addRes?.error as string) || errorMessage;
          throw new Error("Failed to add attachments.");
        }
        finalIssueData = addRes?.data as unknown as Issue;
      }

      // Step 3: Remove attachments
      const attachmentIdsToDelete = JSON.parse(
        formData.get("attachmentIdsToDelete") as string
      );
      if (attachmentIdsToDelete && attachmentIdsToDelete.length > 0) {
        const removeRes = await removeAttachments(
          currentIssue.id,
          attachmentIdsToDelete
        );
        //@ts-expect-error - needs type
        if (!removeRes.success) {
          success = false;
          errorMessage = removeRes?.error || errorMessage;
          throw new Error("Failed to remove attachments.");
        }
        //@ts-expect-error - needs type
        finalIssueData = removeRes.data;
      }

      if (finalIssueData) {
        //@ts-expect-error - needs type
        setIssues((prevIssues) =>
          prevIssues.map((i) =>
            i.id === (finalIssueData as Issue).id ? finalIssueData : i
          )
        );
      }

      toast.success("Issue updated successfully!");
      onClose?.();
    } catch (error) {
      console.error("Error updating issue:", error);
      toast.error(errorMessage);
      //eslint-disable-next-line @typescript-eslint/no-unused-vars
      success = false;
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form action={handleUpdateIssue} className=" flex flex-col gap-4">
      <IssueDetailsForm
        issue={currentIssue}
        onClose={onClose}
        assignees={assignees}
      />
    </form>
  );
}
