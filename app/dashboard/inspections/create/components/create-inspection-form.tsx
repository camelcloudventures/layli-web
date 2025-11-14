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
import { AuditTemplate } from "@/lib/types/audit-types";
import { toast } from "sonner";
import SubmitBtn from "@/components/custom/submit-btn";
import TemplateSelector from "./template-selector";
import { useInspectionStore } from "@/store/inspections";

interface Props {
  sites: { data: { id: string; name: string }[] };
  templates: AuditTemplate[];
}

export function CreateInspectionForm({ sites, templates }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const { setInspections } = useInspectionStore();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedSite, setSelectedSite] = useState("");
  const [scheduledDate, setScheduledDate] = useState<string>("");
  const [hasManuallySetDate, setHasManuallySetDate] = useState(false);

  const [selectedTemplate, setSelectedTemplate] =
    useState<AuditTemplate | null>(null);
  console.log("selectedTemplate", selectedTemplate);

  async function handleSubmit(formData: FormData) {
    setIsCreating(true);
    try {
      const inspectionData: {
        title: string;
        description: string;
        assignees: Assignees[];
        site_id: string;
        prepared_by: string;
        due_date?: FormDataEntryValue | null;
        template_id?: number;
      } = {
        title: selectedTemplate
          ? selectedTemplate.title
          : (formData.get("inspection-name") as string),
        description: `Inspection for ${
          sites?.data?.find((s) => s.id === selectedSite)?.name || ""
        }`,
        assignees: [], // No assignees initially - can be assigned later via Manage Assignees
        site_id: selectedSite,
        prepared_by: user?.id || "",
      };

      // Only include due_date if user manually set a scheduled date
      if (hasManuallySetDate && scheduledDate) {
        inspectionData.due_date = scheduledDate;
      }

      // If using template, just send template_id
      Object.assign(inspectionData, {
        template_id: selectedTemplate?.id,
      });

      //@ts-expect-error - needs type
      const result = await createInspection(inspectionData);

      if (result && "error" in result) {
        toast.error(String(result.error));
        return;
      }

      // Update store list optimistically with newly created inspection
      if (result && result.data) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        setInspections((prev) => [result.data as any, ...prev]);
        toast.success("Inspection created successfully");
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

            <div className="w-full mb-6">
              <Label htmlFor="site">Site</Label>
              <Select
                name="site"
                value={selectedSite}
                onValueChange={setSelectedSite}
                required
              >
                <SelectTrigger className="w-full" id="site">
                  <SelectValue placeholder="Select site" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {sites?.data?.map((site) => (
                    <SelectItem key={site.id} value={String(site.id)}>
                      {site.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Label htmlFor="scheduled-date">Scheduled Date (Optional)</Label>
              <Input
                id="scheduled-date"
                name="scheduled-date"
                type="date"
                value={scheduledDate}
                onChange={(e) => {
                  setScheduledDate(e.target.value);
                  setHasManuallySetDate(true);
                }}
              />
            </div>
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
              !selectedSite ||
              !selectedTemplate
            }
          />
        </div>
      </form>
    </>
  );
}
