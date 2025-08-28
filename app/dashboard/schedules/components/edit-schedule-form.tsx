"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import SubmitBtn from "@/components/custom/submit-btn";
import { updateSchedule } from "../actions/actions";
import type {
  TemplateOption,
  SiteOption,
  UserOption,
} from "../types/schedule-form-types";
import type { Schedule, Assignee } from "@/lib/types/schedule-types";
import { MultiSelect } from "@/components/ui/multi-select";
import { useSchedulesStore } from "@/store/schedules";

interface EditScheduleFormProps {
  schedule: Schedule;
  users: UserOption[];
  templates: TemplateOption[];
  sites: SiteOption[];
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}

export function EditScheduleForm({
  schedule,
  users,
  templates,
  sites,
  onSubmit,
  onCancel,
}: EditScheduleFormProps) {
  const { setSchedules } = useSchedulesStore();
  const [selectedAssignees, setSelectedAssignees] = useState<Assignee[]>(
    schedule.assignees || []
  );
  const [completionPolicy, setCompletionPolicy] = useState<"any" | "all">(
    schedule.completion_policy || "any"
  );

  const normalizeTime = (t?: string) => (t ? t.slice(0, 5) : undefined);
  const [startTime, setStartTime] = useState(
    normalizeTime(schedule.start_time) || "09:00"
  );
  const [endTime, setEndTime] = useState(
    normalizeTime(schedule.end_time) || "17:00"
  );

  // Helper to generate time options in 30-minute intervals
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    const ampm = hour < 12 ? "AM" : "PM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return {
      value: `${hour.toString().padStart(2, "0")}:${minute}`,
      label: `${displayHour}:${minute} ${ampm}`,
    };
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState(
    String(schedule.template_id)
  );
  const [scheduleTitle, setScheduleTitle] = useState(
    templates.find((t) => String(t.id) === String(schedule.template_id))
      ?.title || ""
  );

  useEffect(() => {
    const newTitle =
      templates.find((t) => String(t.id) === selectedTemplateId)?.title || "";
    setScheduleTitle(newTitle);
  }, [selectedTemplateId, templates]);

  async function handleEdit(formData: FormData) {
    // Add selected assignees to form data
    // formData.delete("assignee_ids");

    // Flatten the assignee objects to match the expected structure
    const flattenedAssignees = selectedAssignees.map((a) => ({
      id: a.assignee.id,
      role: a.assignee.role || "inspector",
      full_name: a.assignee.full_name,
      email: a.assignee.email,
    }));

    formData.append("assignees", JSON.stringify(flattenedAssignees));

    // Log the actual data being sent
    console.log("assignees being sent:", selectedAssignees);
    console.log("flattened assignees:", flattenedAssignees);
    console.log("assignees JSON:", JSON.stringify(flattenedAssignees));

    // Set start and end time
    formData.set("start_time", startTime);
    formData.set("end_time", endTime);
    // Set completion policy
    formData.set("completion_policy", completionPolicy);

    const res = (await updateSchedule(formData)) as {
      error?: string;
      success?: string;
      data?: Schedule;
    };

    console.log("err", res.error);

    console.log("res", res);
    if (res?.error) toast.error(res.error);
    else {
      toast.success(res?.success);
      // Update the specific schedule in the store
      if (res?.data) {
        setSchedules((prevSchedules: Schedule[]) =>
          prevSchedules.map((s: Schedule) =>
            s.id === schedule.id ? res.data! : s
          )
        );
      }
      onSubmit(formData);
    }
  }

  console.log("sched", schedule);
  return (
    <form action={handleEdit} className="space-y-6">
      <input type="hidden" name="id" value={schedule.id} />
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Schedule Title</Label>
          <Input id="title" name="title" disabled value={scheduleTitle} />
          <input type="hidden" name="title" value={scheduleTitle} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="template_id">
            Audit Template <span className="text-red-500">*</span>
          </Label>
          <Select
            name="template_id"
            required
            value={selectedTemplateId}
            onValueChange={setSelectedTemplateId}
          >
            <SelectTrigger id="template_id" className="w-full">
              <SelectValue placeholder="Select an audit template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem
                  key={template.id}
                  value={String(template.id)}
                  className="hover:bg-gray-100 cursor-pointer"
                >
                  {template.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="site_id">
            Site <span className="text-red-500">*</span>
          </Label>
          <Select
            name="site_id"
            required
            defaultValue={String(schedule.site_id)}
          >
            <SelectTrigger id="site_id" className="w-full">
              <SelectValue placeholder="Select a site" />
            </SelectTrigger>
            <SelectContent>
              {sites.map((site) => (
                <SelectItem
                  key={site.id}
                  value={String(site.id)}
                  className="hover:bg-gray-100 cursor-pointer"
                >
                  {site.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="assignee_ids">
            Assignees <span className="text-red-500">*</span>
          </Label>
          <MultiSelect
            name="assignee_ids"
            required
            value={selectedAssignees?.map((a) => a?.assignee?.id)}
            onValueChange={(ids: string[]) => {
              const selectedUsers = users?.filter((u) =>
                ids.includes(u?.user?.id)
              );
              setSelectedAssignees(
                selectedUsers?.map((u) => ({ assignee: u?.user }))
              );
            }}
            placeholder="Select assignees"
            options={users?.map((user) => ({
              value: user?.user?.id,
              label: user?.user?.full_name,
            }))}
          />

          <div className="flex flex-wrap gap-2 mt-2">
            {selectedAssignees.map((assignee) => (
              <span
                key={assignee.assignee.id}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
              >
                {assignee.assignee.full_name}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-row gap-8 mt-8 items-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="completion_policy"
              value="any"
              checked={completionPolicy === "any"}
              onChange={() => setCompletionPolicy("any")}
              className="accent-primary h-5 w-5 mr-2"
            />
            <span className="text-base select-none">
              Only one assignee needs to complete
            </span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="completion_policy"
              value="all"
              checked={completionPolicy === "all"}
              onChange={() => setCompletionPolicy("all")}
              className="accent-primary h-5 w-5 mr-2"
            />
            <span className="text-base select-none">
              All assignees need to complete
            </span>
          </label>
        </div>
        <div className="space-y-2">
          <Label htmlFor="frequency">
            Frequency <span className="text-red-500">*</span>
          </Label>
          <Select name="frequency" required defaultValue={schedule.frequency}>
            <SelectTrigger id="frequency" className="w-full">
              <SelectValue placeholder="Select a frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="daily"
                className="hover:bg-gray-100 cursor-pointer"
              >
                Daily
              </SelectItem>
              <SelectItem
                value="weekly"
                className="hover:bg-gray-100 cursor-pointer"
              >
                Weekly
              </SelectItem>
              <SelectItem
                value="monthly"
                className="hover:bg-gray-100 cursor-pointer"
              >
                Monthly
              </SelectItem>
              <SelectItem
                value="yearly"
                className="hover:bg-gray-100 cursor-pointer"
              >
                Yearly
              </SelectItem>

              <SelectItem
                value="every-weekday"
                className="hover:bg-gray-100 cursor-pointer"
              >
                Every Weekday
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">
            Status <span className="text-red-500">*</span>
          </Label>
          <Select name="status" required defaultValue={schedule.status}>
            <SelectTrigger id="status" className="w-full">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="active"
                className="hover:bg-gray-100 cursor-pointer"
              >
                Active
              </SelectItem>
              <SelectItem
                value="completed"
                className="hover:bg-gray-100 cursor-pointer"
              >
                Completed
              </SelectItem>
              <SelectItem
                value="paused"
                className="hover:bg-gray-100 cursor-pointer"
              >
                Paused
              </SelectItem>
              <SelectItem
                value="cancelled"
                className="hover:bg-gray-100 cursor-pointer"
              >
                Cancelled
              </SelectItem>
              <SelectItem
                value="inactive"
                className="hover:bg-gray-100 cursor-pointer"
              >
                Inactive
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <div className="flex-1 flex flex-col">
            <Label htmlFor="start_time">
              Start Time <span className="text-red-500">*</span>
            </Label>
            <select
              id="start_time"
              name="start_time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {timeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <span className="mx-2 text-lg font-medium">~</span>
          <div className="flex-1 flex flex-col">
            <Label htmlFor="end_time">
              End Time <span className="text-red-500">*</span>
            </Label>
            <select
              id="end_time"
              name="end_time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {timeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
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
