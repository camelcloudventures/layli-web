"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { shareIssue } from "../actions/actions";
import { useRemoveAssignees } from "../actions/query";
import { useIssuesStore } from "@/store/issues";

interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

interface ShareIssueDialogProps {
  isOpen: boolean;
  onClose: () => void;
  issueId: string;
  assignees: User[]; // All available users
  currentAssignees: User[]; // Currently assigned users to this issue
}

export default function ShareIssueDialog({
  isOpen,
  onClose,
  issueId,
  assignees,
  currentAssignees,
}: ShareIssueDialogProps) {
  console.log("assignees", assignees);
  console.log("currentAssignees", currentAssignees);

  // Initialize selectedUsers with the current assignees (users already assigned to this issue)
  const [selectedUsers, setSelectedUsers] = useState<string[]>(
    currentAssignees.map((user) => user?.id)
  );
  const [isSharing, setIsSharing] = useState(false);

  const { mutate: removeAssignee, isPending: isRemoving } =
    useRemoveAssignees();

  const { setIssues } = useIssuesStore();

  // Update selectedUsers when currentAssignees change
  useEffect(() => {
    setSelectedUsers(currentAssignees.map((user) => user?.id));
  }, [currentAssignees]);

  const handleSelectAll = () => {
    if (selectedUsers.length === assignees.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(assignees.map((user) => user?.id));
    }
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Determine what action is being performed
  const getActionType = () => {
    const currentAssigneeIds = currentAssignees.map((user) => user?.id);
    const usersToRemove = currentAssigneeIds.filter(
      (userId) => !selectedUsers.includes(userId)
    );
    const newlySelectedUserIds = selectedUsers.filter(
      (userId) => !currentAssigneeIds.includes(userId)
    );

    if (usersToRemove.length > 0 && newlySelectedUserIds.length === 0) {
      return "remove";
    } else if (newlySelectedUserIds.length > 0 && usersToRemove.length === 0) {
      return "add";
    } else if (usersToRemove.length > 0 && newlySelectedUserIds.length > 0) {
      return "update";
    }
    return "none";
  };

  const getButtonText = () => {
    const actionType = getActionType();
    const isLoading = isSharing || isRemoving;

    if (isLoading) {
      if (isRemoving) {
        return (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Removing...
          </>
        );
      }
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sharing...
        </>
      );
    }

    switch (actionType) {
      case "remove":
        return "Remove Assignee";
      case "add":
        return "Add New Assignee";
      case "update":
        return "Update Assignees";
      default:
        return "Share Issue";
    }
  };

  function handleRemove(assigneeIds: string[]) {
    return new Promise((resolve, reject) => {
      removeAssignee(
        { issueId, assigneeIds },
        {
          onSuccess: (data) => {
            console.log("Remove assignees response:", data);
            toast.success(data.success);
            onClose();

            // Update the store with the new data
            if (data && data.data) {
              setIssues((prevIssues) =>
                prevIssues.map((issue) =>
                  issue.id === issueId ? data.data : issue
                )
              );
            }

            resolve(data);
          },
          onError: (err) => {
            console.log("Error removing assignees:", err);
            toast.error(err?.message || "Error occurred");
            reject(err);
          },
        }
      );
    });
  }

  const handleShare = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user to share with");
      return;
    }

    setIsSharing(true);

    try {
      // Get current assignee IDs
      const currentAssigneeIds = currentAssignees.map((user) => user?.id);

      // Find users to remove (currently assigned but deselected)
      const usersToRemove = currentAssigneeIds.filter(
        (userId) => !selectedUsers.includes(userId)
      );

      // Find newly selected users (users that are selected but not currently assigned)
      const newlySelectedUserIds = selectedUsers.filter(
        (userId) => !currentAssigneeIds.includes(userId)
      );

      // Remove deselected users first
      if (usersToRemove.length > 0) {
        return await handleRemove(usersToRemove);
      }

      // Add newly selected users
      if (newlySelectedUserIds.length > 0) {
        // Convert newly selected user IDs to Assignee objects
        const newlySelectedAssignees = assignees
          .filter((user) => newlySelectedUserIds.includes(user?.id))
          .map((user) => ({
            id: user?.id,
            full_name: user?.full_name,
            email: user?.email,
            role: user?.role,
          }));

        const response = await shareIssue(issueId, newlySelectedAssignees);

        if (response?.success) {
          console.log("res", response);
          if (response && response.data) {
            setIssues((prevIssues) =>
              prevIssues.map((issue) =>
                issue.id === issueId ? response.data : issue
              )
            );
          }
          toast.success(response?.success);
          onClose();
        } else {
          toast.error(response?.error || "Failed to share issue");
        }
      }
    } catch (error) {
      console.log("Error in handleShare:", error);
      toast.error("Failed to update assignees");
    } finally {
      setIsSharing(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="p-6 ">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Share Issue</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Share this issue with team members
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Select Users</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className="h-auto p-0 text-sm"
              >
                {selectedUsers?.length === assignees?.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {assignees?.map((user) => (
                <div key={user?.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={user?.id}
                    checked={selectedUsers?.includes(user?.id)}
                    onCheckedChange={() => handleUserToggle(user?.id)}
                  />
                  <Label
                    htmlFor={user?.id}
                    className="flex flex-col cursor-pointer"
                  >
                    <span className="text-sm font-medium">
                      {user?.full_name}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {user?.role}
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSharing || isRemoving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleShare}
            disabled={isSharing || isRemoving || selectedUsers?.length === 0}
          >
            {getButtonText()}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
