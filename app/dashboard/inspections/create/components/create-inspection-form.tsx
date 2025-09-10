"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAuth } from "@/lib/context/auth-provider";
import { Assignees, createInspection } from "../../actions/actions";
import { UserOption } from "@/app/dashboard/schedules/types/schedule-form-types";
import { MultiSelect } from "@/components/ui/multi-select";
import { AuditTemplate } from "@/lib/types/audit-types";
import { toast } from "sonner";
import SubmitBtn from "@/components/custom/submit-btn";
import { Checkbox } from "@/components/ui/checkbox";
import TemplateSelector from "./template-selector";
import { useInspectionStore } from "@/store/inspections";

interface Props {
  sites: { id: string; name: string }[];
  users: UserOption[];
  templates: AuditTemplate[];
}

export function CreateInspectionForm({ sites, users, templates }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const { setInspections } = useInspectionStore();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [assignedTo, setAssignedTo] = useState<Assignees[]>([]);
  const [participateInInspection, setParticipateInInspection] = useState(false);
  const isSupervisor = user?.role === "supervisor";

  const [selectedTemplate, setSelectedTemplate] =
    useState<AuditTemplate | null>(null);
  console.log("selectedTemplate", selectedTemplate);

  async function handleSubmit(formData: FormData) {
    setIsCreating(true);
    try {
      // Add current user to assignees if participating
      const finalAssignees: Assignees[] = [...assignedTo];
      if (participateInInspection && user?.id) {
        if (!finalAssignees.some((assignee) => assignee?.id === user?.id)) {
          finalAssignees.push({
            id: user?.id,
            full_name: user?.full_name || "",
            role: user?.role || "",
            email: user?.email || "",
          });
        }
      }

      const inspectionData = {
        title: selectedTemplate
          ? selectedTemplate.title
          : (formData.get("inspection-name") as string),
        description: `Inspection for ${
          // @ts-expect-error - sites.data structure needs to be fixed
          sites?.data?.find((s) => s.id === selectedLocation)?.name
        }`,
        assignees: finalAssignees,
        site_id: selectedLocation,
        prepared_by: user?.id || "",
        due_date: formData.get("scheduled-date"),
      };

      // If using template, just send template_id
      Object.assign(inspectionData, {
        template_id: selectedTemplate?.id,
      });

      const result = await createInspection(inspectionData);

      if (result && "error" in result) {
        toast.error(String(result.error));
        return;
      }

      // Update store list optimistically with newly created inspection
      if (result && result.data) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        setInspections((prev) => [result.data as any, ...prev]);
      }

      // Set the created inspection for the success dialog
      router.push(`/dashboard/inspections`);
    } catch (error) {
      console.error("Error creating inspection:", error);
      toast.error("Failed to create inspection");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <>
      <form action={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>New Inspection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-full">
              <TemplateSelector
                templates={templates}
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
              />
            </div>

            <div className="flex items-center justify-between gap-8 mb-6">
              <span className="w-full">
                <Label htmlFor="location">Location</Label>
                <Select
                  name="location"
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                  required
                >
                  <SelectTrigger className="w-full" id="location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {/* @ts-expect-error - sites.data structure needs to be fixed */}
                    {sites?.data?.map((location) => (
                      <SelectItem key={location.id} value={String(location.id)}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </span>

              <span
                className={`w-full ${assignedTo.length > 0 ? "mb-4" : "mb-0"}`}
              >
                <Label htmlFor="assigned-to">Assign To</Label>
                <MultiSelect
                  name="assignee_ids"
                  required
                  value={assignedTo?.map((assignee) => assignee?.id)}
                  onValueChange={(selectedUserIds) => {
                    // Transform the selected user IDs to Assignees format
                    const transformedAssignees: Assignees[] = selectedUserIds
                      ?.map((userId) => {
                        const user = users?.find((u) => u?.user?.id === userId);
                        if (user) {
                          return {
                            id: user?.user?.id,
                            full_name: user?.user?.full_name,
                            role: user?.user?.role,
                            email: user?.user?.email,
                          };
                        }
                        return null;
                      })
                      .filter(
                        (assignee): assignee is Assignees => assignee !== null
                      );

                    setAssignedTo(transformedAssignees);
                  }}
                  placeholder="Select assignees"
                  options={users?.map((user) => ({
                    value: user?.user?.id,
                    label: user?.user?.full_name,
                  }))}
                />
              </span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prepared-by">Prepared By</Label>
              <Input
                id="prepared-by"
                name="prepared-by"
                value={user?.full_name}
                className="cursor-not-allowed bg-gray-100"
                disabled
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled-date">Scheduled Date</Label>
              <Input
                id="scheduled-date"
                name="scheduled-date"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>

            {isSupervisor && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="participate"
                  checked={participateInInspection}
                  onCheckedChange={(checked) =>
                    setParticipateInInspection(checked as boolean)
                  }
                />
                <label
                  htmlFor="participate"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Participate in inspection
                </label>
              </div>
            )}
          </CardContent>
        </Card>
        <div className="flex justify-end space-x-2 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/inspections")}
          >
            Cancel
          </Button>
          <SubmitBtn
            label="Create Inspection"
            className=""
            variant="default"
            isDisabled={
              isCreating ||
              !selectedTemplate?.title ||
              !selectedLocation ||
              !assignedTo.length ||
              !selectedTemplate
            }
          />
        </div>
      </form>
    </>
  );
}
