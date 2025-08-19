"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
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
import { createSchedule } from "../actions/actions";
import type {
  UserOption,
  TemplateOption,
  SiteOption,
} from "../types/schedule-form-types";
import { useState } from "react";
import { MultiSelect } from "@/components/ui/multi-select";
import clsx from "clsx";
import { useSchedulesStore } from "@/store/schedules";
import type { Schedule } from "@/lib/types/schedule-types";

interface CreateScheduleFormProps {
  users: UserOption[];
  templates: TemplateOption[];
  sites: SiteOption[];
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}

export function CreateScheduleForm({
  users,
  templates,
  sites,
  onSubmit,
  onCancel,
}: CreateScheduleFormProps) {
  const { setSchedules } = useSchedulesStore();
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<
    string | undefined
  >(undefined);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [completionPolicy, setCompletionPolicy] = useState<"any" | "all">(
    "any"
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

  async function handleCreate(formData: FormData) {
    // Add selected assignees to form data
    formData.delete("assignee_ids");
    selectedAssignees.forEach((id) => {
      formData.append("assignee_ids", id);
    });

    // Set the title from the selected template
    const selectedTemplate = templates.find(
      (t) => String(t.id) === selectedTemplateId
    );
    if (selectedTemplate) {
      formData.set("title", selectedTemplate.title);
    }

    // Set start and end time
    formData.set("start_time", startTime);
    formData.set("end_time", endTime);

    // Set completion policy
    formData.set("completion_policy", completionPolicy);

    const res = await createSchedule(formData);
    if (res?.error) toast.error(res.error);
    else {
      toast.success(res?.success);
      // Add the new schedule to the existing array
      if (res?.data) {
        setSchedules((prevSchedules: Schedule[]) => [
          ...prevSchedules,
          res.data!,
        ]);
      }
      onSubmit(formData);
    }
  }

  return (
    <form action={handleCreate} className="flex flex-col gap-6">
      <div className="flex flex-col gap-5">
        <div className="">
          <Label htmlFor="template_id">
            Audit Template <span className="text-red-500">*</span>
          </Label>
          <Select
            name="template_id"
            required
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
        <div className="">
          <Label htmlFor="site_id">
            Site <span className="text-red-500">*</span>
          </Label>
          <Select name="site_id" required>
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
        <div
          className={clsx(
            selectedAssignees.length > 0 ? "mb-10" : "mb-0",
            "transition-all duration-300 "
          )}
        >
          <Label htmlFor="assignee_ids">
            Assignees <span className="text-red-500">*</span>
          </Label>
          <MultiSelect
            className=""
            name="assignee_ids"
            required
            value={selectedAssignees}
            onValueChange={setSelectedAssignees}
            placeholder="Select assignees"
            options={users.map((user) => ({
              value: user.user.id,
              label: user.user.full_name,
            }))}
          />
        </div>
        <div className="flex flex-row gap-8 mt- items-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="completion_policy"
              value="any"
              checked={completionPolicy === "any"}
              onChange={() => setCompletionPolicy("any")}
              className="accent-primary h-5 w-5 mr-2"
            />
            <span className="text-sm select-none">
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
            <span className="text-sm select-none">
              All assignees need to complete
            </span>
          </label>
        </div>
        <div className="">
          <Label htmlFor="frequency">
            Frequency <span className="text-red-500">*</span>
          </Label>
          <Select name="frequency" required>
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
      <div className="flex justify-end  gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <SubmitBtn label="Create Schedule" variant="default" className="" />
      </div>
    </form>
  );
}

export type { UserOption, TemplateOption, SiteOption };
