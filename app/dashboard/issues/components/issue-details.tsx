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
import { addComment, updateIssue, updateAttachments } from "../actions/actions";
import SubmitBtn from "@/components/custom/submit-btn";
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
  const { setIssues } = useIssuesStore();

  const {
    uploadedImages,
    setUploadedImages,
    removeNewImage,
    removeExistingAttachment,
    isRemovingAttachment,
    removingAttachmentVariables,
  } = useIssue({ issue });

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
    if (res.success) {
      toast.success("Comment added successfully");
      setComment("");
    } else {
      toast.error(res.error);
    }
    setIsSendingComment(false);
  };

  const handleDownloadPdf = () => {
    setIsDownloading(true);
    try {
      const doc = generatePDF(issue);
      setTimeout(() => {
        // Create a safe filename from the issue title
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

          // Immediately add the file to the issue via API
          const res = await updateAttachments(
            issue.id,
            [
              {
                fileName: file.name,
                fileUrl: result.fileUrl,
              },
            ],
            undefined
          );

          if (res) {
            // Update the store with the new attachment
            setIssues((prevIssues) =>
              prevIssues.map((i) =>
                i.id === issue.id
                  ? {
                      ...i,
                      attachments: [
                        ...i.attachments,
                        {
                          id: crypto.randomUUID(), // Temporary ID, will be updated when store refreshes
                          file_url: result.fileUrl,
                          issue_id: issue.id,
                          created_at: new Date().toISOString(),
                          created_by: currentUser?.id || "",
                        },
                      ],
                    }
                  : i
              )
            );
            toast.success("Image uploaded successfully");
          } else {
            toast.error("Failed to add image to issue");
          }
        } else {
          setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
          toast.error(result.error || "Failed to upload image");
        }
      } catch {
        setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
        toast.error("Failed to upload image");
      }
    },
    [issue.id, setIssues, currentUser?.id, setUploadedImages]
  );

  return (
    <div className="">
      {/* Hidden inputs for attachment data */}
      {/* {attachmentsToAdd.length > 0 && (
        <input
          type="hidden"
          name="attachmentsToAdd"
          value={JSON.stringify(attachmentsToAdd)}
        />
      )} */}
      {/* {attachmentIdsToDelete.length > 0 && (
        <input
          type="hidden"
          name="attachmentIdsToDelete"
          value={JSON.stringify(attachmentIdsToDelete)}
        />
      )} */}

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
                isRemovingAttachment={isRemovingAttachment}
                removingAttachmentVariables={removingAttachmentVariables}
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
          <SubmitBtn label="Update Issue" variant="default" />
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
  const { issues } = useIssuesStore();

  // Get the latest issue data from the store
  const currentIssue = issues.find((i) => i.id === issue.id) || issue;

  const handleUpdateIssue = async (formData: FormData) => {
    try {
      // Add attachment data to form if there are changes
      // const attachmentsToAdd = formData.get("attachmentsToAdd");
      // const attachmentIdsToDelete = formData.get("attachmentIdsToDelete");

      // if (attachmentsToAdd) {
      //   formData.set("attachmentsToAdd", attachmentsToAdd as string);
      // }
      // if (attachmentIdsToDelete) {
      //   formData.set("attachmentIdsToDelete", attachmentIdsToDelete as string);
      // }

      const res = await updateIssue(currentIssue.id, formData);

      console.log("res from issue update", res);
      if (res) {
        toast.success("Issue updated successfully");

        // The optimistic updates in removeExistingAttachment will handle the UI updates
        // The store will be updated when the page refreshes or when the issues are refetched

        onClose?.();
      } else {
        toast.error("Failed to update issue");
      }
    } catch (error) {
      console.error("Error updating issue:", error);
      toast.error("Failed to update issue");
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
