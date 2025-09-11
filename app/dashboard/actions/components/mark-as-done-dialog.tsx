"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Action } from "@/lib/types";
import { useState, FormEvent } from "react";
import { toast } from "sonner";
import { markActionAsCompleted } from "../actions/actions";
import SubmitBtn from "@/components/custom/submit-btn";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileUploader } from "@/components/custom/file-uploader";
import { createClient } from "@/utils/supabase/client";

interface MarkAsDoneDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  action: Action | null;
  onSuccess: (updatedAction: Action) => void;
}

export function MarkAsDoneDialog({
  isOpen,
  onOpenChange,
  action,
  onSuccess,
}: MarkAsDoneDialogProps) {
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const supabase = createClient();

  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!action) return;

    const formData = new FormData(event.currentTarget);

    try {
      const state = await markActionAsCompleted(action.id, formData);

      //@ts-expect-error --need to fix this
      if (state?.error) {
        //@ts-expect-error --need to fix this
        toast.error(state?.error);
      } else {
        //@ts-expect-error --need to fix this
        toast.success(state?.success);
        //@ts-expect-error --need to fix this
        onSuccess(state?.data);
        onOpenChange(false);
        (event.target as HTMLFormElement).reset();
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    }
  }

  async function handleFileSelect(file: File) {
    if (!action) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${action.id}-${Math.random()}.${fileExt}`;
    const filePath = `action-attachments/${fileName}`;

    const { error } = await supabase.storage
      .from("issues-image")
      .upload(filePath, file);

    if (error) {
      toast.error("Failed to upload attachment. Please try again.");
      console.error("Upload error:", error.message);
      return;
    }

    const { data } = supabase.storage
      .from("issues-image")
      .getPublicUrl(filePath);

    if (data) {
      setAttachmentUrl(data.publicUrl);
    }
  }

  if (!action) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} key={action.id}>
      <DialogContent className="p-4">
        <DialogHeader>
          <DialogTitle>Mark Action as Done</DialogTitle>
          <DialogDescription>
            Please provide completion details for the action: &apos;
            {action.title}&apos;.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {attachmentUrl && (
            <input type="hidden" name="file" value={attachmentUrl} />
          )}
          <div>
            <Label htmlFor="comments">Comments (Required)</Label>
            <Textarea
              id="comments"
              name="comments"
              required
              placeholder="Add your done comments here..."
            />
          </div>
          <div>
            <Label>Attachments</Label>
            <FileUploader onFileSelect={handleFileSelect} />
          </div>
          <div className="flex justify-end">
            <SubmitBtn label="Mark as Done" variant="default" />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
