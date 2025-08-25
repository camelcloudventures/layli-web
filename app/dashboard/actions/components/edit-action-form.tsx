"use client";
("");

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Action,
  ActionPriority,
  ActionStatus,
  User,
  ActionFrequency,
  Site,
} from "@/lib/types";
import { updateAction } from "../actions/actions";
import { toast } from "sonner";
import { MultiSelect } from "@/components/ui/multi-select";
import SubmitBtn from "@/components/custom/submit-btn";
import { Label } from "@/components/ui/label";
import { useActionsStore } from "@/store/actions";

interface EditActionFormProps {
  users: User[];
  sites: Site[];
  action: Action;
  onCancel: () => void;
}

export function EditActionForm({
  users,
  sites,
  action,
  onCancel,
}: EditActionFormProps) {
  const { setActions } = useActionsStore();
  const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>(
    action.assignees.map((assignee) => assignee.id)
  );
  const [dueDate, setDueDate] = useState<string>(
    new Date(action.due_at).toISOString().split("T")[0]
  );
  const [selectedSite, setSelectedSite] = useState<Site | null>(
    action.site
      ? {
          id: String(action.site.id),
          name: action.site.name,
          address: action.site.address,
          latitude: action.site.latitude,
          longitude: action.site.longitude,
        }
      : null
  );
  const [selectedFrequency, setSelectedFrequency] = useState<ActionFrequency>(
    action.frequency
  );

  const handleSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as ActionPriority;
    const status = formData.get("status") as ActionStatus;
    const label = formData.get("label") as string;

    // Convert assignee IDs to assignee objects
    const assignees = allOptions
      .filter((option) => selectedAssigneeIds.includes(option.value))
      .map((option) => ({
        id: option.value,
        full_name: option.label,
        email: "", // We don't have email in the options
        role: "user", // Default role
      }));

    const payload = {
      title,
      description,
      priority,
      status,
      due_at: dueDate,
      frequency: selectedFrequency,
      site: selectedSite
        ? {
            id: Number(selectedSite.id),
            name: selectedSite.name,
            address: selectedSite.address,
            latitude: selectedSite.latitude,
            longitude: selectedSite.longitude,
          }
        : undefined,
      label,
      assignees,
    };

    toast.promise(updateAction(action.id, payload), {
      loading: "Updating action...",
      success: (data) => {
        console.log("data", data);
        //@ts-expect-error -needs type
        if (data && data.data) {
          setActions((prev) =>
            //@ts-expect-error -needs type
            prev.map((a) => (a.id === action.id ? data.data : a))
          );
        }
        return "Action updated successfully";
      },
      error: "Failed to update action",
    });
    onCancel();
  };

  // Create user options from users array
  const userOptions = users.map((user) => ({
    value: user.user.id,
    label: user.user.full_name,
  }));

  // Add assignees that might not be in the users array
  const assigneeOptions = action.assignees.map((assignee) => ({
    value: assignee.id,
    label: assignee.full_name,
  }));

  // Combine and deduplicate options
  const allOptions = [...userOptions, ...assigneeOptions].filter(
    (option, index, self) =>
      index === self.findIndex((o) => o.value === option.value)
  );

  console.log("action in question", action);
  console.log("userOptions", userOptions);
  console.log("selectedAssigneeIds", selectedAssigneeIds);
  console.log("action.assignees", action.assignees);
  console.log("selectedSite", selectedSite);
  console.log("sites", sites);

  // Check if assignee IDs exist in userOptions
  const assigneeIdsInUsers = selectedAssigneeIds.filter((id) =>
    userOptions.some((option) => option.value === id)
  );
  console.log("assigneeIdsInUsers", assigneeIdsInUsers);
  console.log(
    "Missing assignee IDs",
    selectedAssigneeIds.filter(
      (id) => !userOptions.some((option) => option.value === id)
    )
  );

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g. Fix leaky faucet"
          defaultValue={action.title}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="site">Site</Label>
        <Select
          value={selectedSite?.id ? String(selectedSite.id) : ""}
          onValueChange={(value) => {
            const site = sites.find((s) => String(s.id) === value);
            setSelectedSite(site || null);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a site" />
          </SelectTrigger>
          <SelectContent>
            {sites.map((site) => (
              <SelectItem key={site.id} value={String(site.id)}>
                {site.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="e.g. The faucet in the main kitchen is dripping."
          defaultValue={action.description}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select name="priority" defaultValue={action.priority}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ActionPriority).map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select name="status" defaultValue={action.status}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ActionStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Frequency</Label>
        <Select
          value={selectedFrequency}
          onValueChange={(value) =>
            setSelectedFrequency(value as ActionFrequency)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ActionFrequency).map((frequency) => {
              const formatted = frequency.replace("_", " ");
              return (
                <SelectItem key={frequency} value={frequency}>
                  {formatted.charAt(0).toUpperCase() + formatted.slice(1)}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Assignees</Label>
        <MultiSelect
          name="assignees"
          className="mb-14"
          options={allOptions}
          value={selectedAssigneeIds}
          onValueChange={setSelectedAssigneeIds}
          placeholder="Select assignees"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input
          id="label"
          name="label"
          placeholder="e.g. maintenance, safety"
          defaultValue={action.label}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <SubmitBtn label="Save Changes" variant="default" className="" />
      </div>
    </form>
  );
}
