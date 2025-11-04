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
import { MultiSelect } from "@/components/ui/multi-select";
import { Assignees, updateInspectionAssignees } from "../actions/actions";
import { Inspection } from "@/lib/types/inspection-types";
import { UserOption } from "@/app/dashboard/schedules/types/schedule-form-types";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useInspectionStore } from "@/store/inspections";

interface ManageAssigneesDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  inspection: Inspection;
  users: UserOption[];
  onSuccess?: () => void;
}

export function ManageAssigneesDialog({
  isOpen,
  onOpenChange,
  inspection,
  users,
  onSuccess,
}: ManageAssigneesDialogProps) {
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>(
    inspection.assignees?.map((assignee) => assignee.id) || []
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const { setInspections } = useInspectionStore();

  // Reset selected assignees when dialog opens or inspection changes
  useEffect(() => {
    if (isOpen) {
      setSelectedAssigneeIds(
        inspection.assignees?.map((assignee) => assignee.id) || []
      );
    }
  }, [isOpen, inspection.assignees]);

  async function handleSave() {
    setIsUpdating(true);
    try {
      // Transform the selected user IDs to Assignees format
      const transformedAssignees: Assignees[] = selectedAssigneeIds
        .map((userId) => {
          const user = users?.find((u) => u?.user?.id === userId);
          if (user) {
            return {
              id: user.user.id,
              full_name: user.user.full_name,
              role: user.user.role,
              email: user.user.email,
            };
          }
          return null;
        })
        .filter((assignee): assignee is Assignees => assignee !== null);

      const result = await updateInspectionAssignees(
        inspection.id,
        transformedAssignees
      );

      if (result && "error" in result) {
        toast.error(String(result.error));
        return;
      }

      // Update the inspection in the store with new assignees
      if (result && result.data) {
        setInspections((prev) =>
          prev.map((insp) =>
            insp.id === inspection.id
              ? { ...insp, assignees: transformedAssignees }
              : insp
          )
        );
      }

      toast.success("Assignees updated successfully");
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating assignees:", error);
      toast.error("Failed to update assignees");
    } finally {
      setIsUpdating(false);
    }
  }

  const userOptions =
    users?.map((user) => ({
      value: user.user.id,
      label: user.user.full_name,
    })) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader>
          <DialogTitle>Manage Assignees</DialogTitle>
          <DialogDescription>
            Update the assignees for this inspection. The inspection will be
            reassigned to the selected users.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="assignees">Assignees</Label>
            <div className="[&>div>div.absolute]:hidden">
              <MultiSelect
                name="assignees"
                value={selectedAssigneeIds}
                onValueChange={setSelectedAssigneeIds}
                placeholder="Select assignees"
                options={userOptions}
              />
            </div>
          </div>

          {inspection.assignees && inspection.assignees.length > 0 && (
            <div className="space-y-2">
              <Label>Current Assignees</Label>
              <div className="flex flex-wrap gap-2">
                {inspection.assignees.map((assignee) => (
                  <div
                    key={assignee.id}
                    className="bg-gray-100 px-2 py-1 rounded-md text-sm"
                  >
                    {assignee.full_name}
                  </div>
                ))}
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
