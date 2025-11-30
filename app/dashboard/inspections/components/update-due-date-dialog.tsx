"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { updateInspectionDueDate } from "../actions/actions";
import { Inspection } from "@/lib/types/inspection-types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useInspectionStore } from "@/store/inspections";
import { parseISO, format } from "date-fns";

interface UpdateDueDateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  inspection: Inspection;
  onSuccess?: () => void;
}

export function UpdateDueDateDialog({
  isOpen,
  onOpenChange,
  inspection,
  onSuccess,
}: UpdateDueDateDialogProps) {
  const [dueDate, setDueDate] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { setInspections } = useInspectionStore();

  // Reset due date when dialog opens or inspection changes
  useEffect(() => {
    if (isOpen) {
      if (inspection.due_date) {
        // Format the date for the input (YYYY-MM-DD)
        const date = parseISO(inspection.due_date);
        setDueDate(format(date, "yyyy-MM-dd"));
      } else {
        setDueDate("");
      }
    }
  }, [isOpen, inspection.due_date]);

  async function handleSave() {
    if (!dueDate) {
      toast.error("Please select a due date");
      return;
    }

    setIsUpdating(true);
    try {
      // Convert YYYY-MM-DD to ISO string format for backend consistency
      const dateObj = new Date(dueDate + "T00:00:00.000Z");
      const isoDateString = dateObj.toISOString();

      const result = await updateInspectionDueDate(
        inspection.id,
        isoDateString
      );

      if (result && "error" in result) {
        toast.error(String(result.error));
        return;
      }

      // Update the inspection in the store with new due date
      if (result && result.data) {
        setInspections((prev) =>
          prev.map((insp) =>
            insp.id === inspection.id
              ? { ...insp, due_date: isoDateString }
              : insp
          )
        );
      }

      // Toast the success message from backend
      if (result && result.success) {
        toast.success(result.success);
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating due date:", error);
      toast.error("Failed to update due date");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader>
          <DialogTitle>Update Due Date</DialogTitle>
          <DialogDescription>
            {inspection.due_date
              ? "Update the due date for this inspection."
              : "Set a due date for this inspection."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="due-date">Due Date</Label>
            <Input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {inspection.due_date && (
            <div className="space-y-2">
              <Label>Current Due Date</Label>
              <div className="bg-gray-100 px-3 py-2 rounded-md text-sm">
                {format(parseISO(inspection.due_date), "MMM d, yyyy")}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

