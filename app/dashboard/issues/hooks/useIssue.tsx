"use client";

import { deleteInspectionFile } from "@/utils/common";
import { useState } from "react";

// This should be moved to a shared types file
interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  uploadedUrl?: string;
  isUploading?: boolean;
}

export default function useIssue() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [attachmentsToAdd, setAttachmentsToAdd] = useState<
    { fileName: string; fileUrl: string }[]
  >([]);
  const [attachmentIdsToDelete, setAttachmentIdsToDelete] = useState<string[]>(
    []
  );

  async function removeNewImage(imageId: string) {
    const imageToDelete = uploadedImages.find((img) => img.id === imageId);
    if (imageToDelete?.uploadedUrl) {
      const fileName = imageToDelete.uploadedUrl.split("/").pop();
      if (fileName) {
        await deleteInspectionFile(fileName, "issues-image");
      }
      setAttachmentsToAdd((prev) =>
        prev.filter((att) => att.fileUrl !== imageToDelete.uploadedUrl)
      );
    }
    setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
  }

  function removeExistingAttachment(attachmentId: string) {
    setAttachmentIdsToDelete((prev) => [...prev, attachmentId]);
  }

  function addNewAttachment(fileName: string, fileUrl: string) {
    setAttachmentsToAdd((prev) => [...prev, { fileName, fileUrl }]);
  }

  return {
    uploadedImages,
    setUploadedImages,
    attachmentsToAdd,
    attachmentIdsToDelete,
    removeNewImage,
    removeExistingAttachment,
    addNewAttachment,
  };
}
