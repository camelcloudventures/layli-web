import CustomSelect from "@/components/custom/custom-select";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/multi-select";
import { Textarea } from "@/components/ui/textarea";
import { IssuePriority } from "@/lib/types/issue-types";
import { cn } from "@/lib/utils";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import DatePopover from "@/components/custom/date-popover";
import { Assignee } from "@/lib/types";
import { uploadImage, deleteInspectionFile } from "@/utils/common";

export interface UserOption {
  user: {
    id: string;
    full_name: string;
    role: string;
    email: string;
  };
}

interface ReportIssueProps {
  priority: IssuePriority;
  setPriority: (priority: IssuePriority) => void;
  users: UserOption[];
  selectedAssignees: Assignee[];
  setSelectedAssignees: (assignees: Assignee[]) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  onImagesChange?: (
    images: { uploadedUrl: string; originalFileName: string }[]
  ) => void;
}

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  uploadedUrl?: string;
  isUploading?: boolean;
}

export default function ReportIssue({
  priority,
  setPriority,
  users,
  selectedAssignees,
  setSelectedAssignees,
  date,
  setDate,
  onImagesChange,
}: ReportIssueProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const uploadedImagesData = uploadedImages
      .filter((img) => img.uploadedUrl)
      .map((img) => ({
        uploadedUrl: img.uploadedUrl!,
        originalFileName: img.file.name,
      }));
    onImagesChange?.(uploadedImagesData);
  }, [uploadedImages, onImagesChange]);

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const handleFileUpload = useCallback(
    async (file: File) => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size must be less than 2MB");
        return;
      }

      // Check if it's an image
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      const imageId = crypto.randomUUID();
      const preview = URL.createObjectURL(file);

      const newImage: UploadedImage = {
        id: imageId,
        file,
        preview,
        isUploading: true,
      };

      setUploadedImages((prev) => [...prev, newImage]);

      try {
        const result = await uploadImage({ file }, "issues-image");

        if (result.success && result.fileUrl) {
          setUploadedImages((prev) => {
            const updatedImages = prev.map((img) =>
              img.id === imageId
                ? { ...img, uploadedUrl: result.fileUrl, isUploading: false }
                : img
            );

            return updatedImages;
          });
          toast.success("Image uploaded successfully");
        } else {
          setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
          toast.error(result.error || "Failed to upload image");
        }
      } catch {
        setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
        toast.error("Failed to upload image");
      }
    },
    [MAX_FILE_SIZE]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFileUpload(droppedFile);
      }
    },
    [handleFileUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        handleFileUpload(selectedFile);
      }
    },
    [handleFileUpload]
  );

  const removeImage = useCallback(async (imageId: string) => {
    setUploadedImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === imageId);

      // If the image has been uploaded to the bucket, delete it
      if (imageToRemove?.uploadedUrl) {
        // Extract the file path from the uploaded URL
        const urlParts = imageToRemove.uploadedUrl.split("/");
        const fileName = urlParts[urlParts.length - 1];

        // Delete the file from the bucket
        deleteInspectionFile(fileName, "issues-image").then((result) => {
          if (result.error) {
            console.error("Failed to delete file from bucket:", result.error);
            toast.error("Failed to delete file from storage");
          }
        });
      }

      if (imageToRemove?.preview) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      const updatedImages = prev.filter((img) => img.id !== imageId);

      return updatedImages;
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm sm:text-base">
          What is the cause of the issue?{" "}
          <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="cause"
          name="cause"
          placeholder="Provide detailed information about the cause of the issue, what happened, what was the impact, etc."
          className={cn("min-h-[120px] sm:min-h-[150px] text-sm sm:text-base")}
        />
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div className="w-full">
          <Label htmlFor="priority" className="text-sm sm:text-base">
            Priority <span className="text-red-500">*</span>
          </Label>
          <CustomSelect
            options={[
              { label: "Low", value: "low" },
              { label: "Medium", value: "medium" },
              { label: "High", value: "high" },
            ]}
            value={priority}
            onValueChange={(value) => setPriority(value as IssuePriority)}
          />
        </div>

        <DatePopover date={date} setDate={setDate} />
      </div>
      <div className="w-full">
        <Label htmlFor="assignee" className="text-sm sm:text-base">
          Assignees <span className="text-red-500">*</span>
        </Label>
        <MultiSelect
          className="mb-4"
          name="assignee_ids"
          required
          value={selectedAssignees.map((assignee) => assignee.id)}
          onValueChange={(value) =>
            setSelectedAssignees(
              users
                .filter((user) => value.includes(user.user?.id))
                .map((user) => user?.user)
            )
          }
          placeholder="Select assignees"
          options={users.map((user) => ({
            value: user.user?.id,
            label: user.user?.full_name,
          }))}
        />
      </div>

      <div className="space-y-4">
        <Label className="text-sm sm:text-base">Attachments (Optional)</Label>

        {/* Image Previews */}
        {uploadedImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {uploadedImages.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                  {image.isUploading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Loader2 className="h-4 w-4 sm:h-6 sm:w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <Image
                      src={image.preview}
                      alt={image.file.name}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X className="h-2 w-2 sm:h-3 sm:w-3" />
                </button>
                {image.isUploading && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg">
                    <div className="bg-white rounded-lg px-2 py-1 text-xs">
                      Uploading...
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Upload Area */}
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-colors cursor-pointer",
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          tabIndex={0}
          aria-label="Upload image"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              fileInputRef.current?.click();
            }
          }}
        >
          <ImageIcon className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            {isDragOver ? "Drop image here" : "Choose image or drag and drop"}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-2">
            PNG, JPG, GIF up to 2MB
          </p>
          <p className="text-xs text-muted-foreground">
            Click to browse or drag and drop your image here
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}
