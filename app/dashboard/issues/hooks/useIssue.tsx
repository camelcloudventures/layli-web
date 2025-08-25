"use client";

import { deleteInspectionFile } from "@/utils/common";
import { useUpdateIssueFiles } from "../actions/query";
import { useIssuesStore } from "@/store/issues";
import { toast } from "sonner";
import { useState } from "react";
import type { Issue } from "@/lib/types/issue-types";

// This should be moved to a shared types file
interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  uploadedUrl?: string;
  isUploading?: boolean;
}

export default function useIssue({ issue }: { issue: Issue }) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const {
    mutate: updateAttachments,
    isPending: isRemovingAttachment,
    variables: removingAttachmentVariables,
  } = useUpdateIssueFiles();
  const { setIssues } = useIssuesStore();

  async function removeNewImage(imageId: string) {
    const imageToDelete = uploadedImages.find((img) => img.id === imageId);

    if (imageToDelete?.uploadedUrl) {
      const fileName = imageToDelete.uploadedUrl.split("/").pop();
      if (fileName) {
        await deleteInspectionFile(fileName, "issues-image");
      }
    }
    setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
  }

  function removeExistingAttachment(attachmentId: string) {
    updateAttachments(
      {
        issue_id: issue.id,
        attachmentsToRemove: [attachmentId],
      },
      {
        onSuccess: (data) => {
          console.log("data here", data);

          // Check if the response contains an error status code (4xx or 5xx)
          if (data?.statusCode && data.statusCode >= 400) {
            console.log("Error in response:", data.message || data.error);
            toast.error(data?.message || "Failed to remove attachment");
            return;
          }

          toast.success("Attachment removed");
          setIssues((prevIssues) =>
            prevIssues.map((i) =>
              i.id === issue.id
                ? {
                    ...i,
                    attachments: i.attachments.filter(
                      (att) => att.id !== attachmentId
                    ),
                  }
                : i
            )
          );
        },
        onError: (err) => {
          console.log("err occured", err);
          toast.error(err.message || "Failed to remove attachment");
        },
      }
    );
  }

  async function addNewImage(imageId: string) {
    const imageToDelete = uploadedImages.find((img) => img.id === imageId);

    if (imageToDelete?.uploadedUrl) {
      const fileName = imageToDelete.uploadedUrl.split("/").pop();
      if (fileName) {
        await deleteInspectionFile(fileName, "issues-image");
      }
    }
    setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
  }

  function addNewAttachment(fileName: string, fileUrl: string) {
    updateAttachments(
      {
        issue_id: issue.id,
        attachmentsToAdd: [
          {
            fileName: fileName,
            fileUrl: fileUrl,
          },
        ],
        attachmentsToRemove: [],
      },
      {
        onSuccess: (data) => {
          console.log("data here", data);
          // update the store with the new attachment
          toast.success("Attachment added successfully ");
          setIssues((prevIssues) =>
            prevIssues.map((i) =>
              i.id === issue.id
                ? { ...i, attachments: [...i.attachments, data] }
                : i
            )
          );
        },
        onError: (err) => {
          console.log("err occured", err);
          toast.error(err.message || "Failed to add attachment");
        },
      }
    );
  }

  return {
    uploadedImages,
    setUploadedImages,
    removeNewImage,
    removeExistingAttachment,
    isRemovingAttachment,
    removingAttachmentVariables,
    addNewImage,
    addNewAttachment,
  };
}
