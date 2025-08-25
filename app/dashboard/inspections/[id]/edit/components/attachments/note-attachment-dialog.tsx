"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type NoteAttachmentDialogProps = {
  isNoteDialogOpen: boolean;
  setIsNoteDialogOpen: (isOpen: boolean) => void;
  note: string;
  setNote: (note: string) => void;
  handleAddNote: () => void;
};
export function NoteAttachmentDialog({
  isNoteDialogOpen,
  setIsNoteDialogOpen,
  note,
  setNote,
  handleAddNote,
}: NoteAttachmentDialogProps) {
  return (
    <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
      <DialogContent className="p-6">
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add your note here..."
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsNoteDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddNote}>Save Note</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
