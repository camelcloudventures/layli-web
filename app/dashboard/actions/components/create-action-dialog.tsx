"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Site, User } from "@/lib/types";
import { CreateActionForm } from "./create-action-form";
import { Action } from "@/lib/types";

interface CreateActionDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  users: User[];
  sites: Site[];
  onActionCreated?: (newAction: Action) => void;
  questionId?: number | null;
  inspectionId?: string;
}

export function CreateActionDialog({
  isOpen,
  onOpenChange,
  users,
  sites,
  onActionCreated,
  questionId,
  inspectionId,
}: CreateActionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px] p-6">
        <DialogHeader>
          <DialogTitle>Create Action</DialogTitle>
          <DialogDescription>
            Create a new action to assign and track.
          </DialogDescription>
        </DialogHeader>
        <CreateActionForm
          users={users}
          sites={sites}
          onCancel={() => onOpenChange(false)}
          onActionCreated={onActionCreated}
          questionId={questionId}
          inspectionId={inspectionId}
        />
      </DialogContent>
    </Dialog>
  );
}
