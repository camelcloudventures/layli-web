"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { updateTemplate } from "@/app/dashboard/templates/actions/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PagesManager } from "@/app/dashboard/templates/components/pages-manager";
import { toast } from "sonner";
import { TemplatePreview } from "@/app/dashboard/templates/components/template-preview";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import type { AuditTemplate } from "@/lib/types/audit-types";
import { useAuditTemplates } from "@/hooks/use-audit-templates";

interface EditAuditFormProps {
  template: AuditTemplate;
}

export default function EditAuditForm({
  template: initialTemplate,
}: EditAuditFormProps) {
  const router = useRouter();
  //@ts-expect-error -e9
  const { setAuditTemplates } = useAuditTemplates();
  // const { user } = useAuth() // not used
  const [activeTab, setActiveTab] = useState("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [template, setTemplate] = useState<AuditTemplate>(initialTemplate);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setTemplate((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setTemplate((prev) => ({
        ...prev,
        photo: (event.target?.result ?? "") as string,
      }));
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveImage() {
    setTemplate((prev) => ({ ...prev, photo: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleTriggerFileInput() {
    fileInputRef.current?.click();
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    // For update, keep all IDs
    const updatePages = template.pages.map((page) => ({
      ...page,
      sections: page.sections.map((section) => ({
        ...section,
        questions: section.questions.map((question) => ({
          ...question,
          response_options: question.response_options ?? [],
        })),
      })),
    }));
    try {
      formData.set("id", template.id);
      formData.set("title", template.title ?? "");
      formData.set("description", template.description ?? "");
      formData.set("photo", template.photo ?? "");
      formData.set("pages", JSON.stringify(updatePages));
      const result = await updateTemplate({
        id: template.id,
        title: template.title,
        description: template.description,
        photo: template.photo,
        pages: updatePages,
      });
      if (result && result.error) {
        toast.error(result.error);
        return;
      }
      if (result && "success" in result) {
        toast.success("Template updated successfully!");
        if (result.data) {
          setAuditTemplates(result.data);
        }
        router.push("/dashboard/templates");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="details">Template Details</TabsTrigger>
        <TabsTrigger value="pages">Pages & Questions</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>

      <TabsContent value="details">
        <Card>
          <CardHeader>
            <CardTitle>Edit Template Details</CardTitle>
            <CardDescription>
              Update the basic information about your audit template
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Template Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Workplace Safety Audit"
                value={template.title}
                onChange={handleInputChange}
                required
                aria-label="Template Title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide a brief description of this audit template's purpose"
                value={template.description}
                onChange={handleInputChange}
                aria-label="Description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photo">Cover Image</Label>
              <div className="border rounded-xl p-6 flex flex-col items-center justify-center min-h-[200px] w-full">
                {template.photo ? (
                  <>
                    <Image
                      width={100}
                      height={100}
                      src={template.photo}
                      alt="Cover Preview"
                      className="w-full max-w-3xl h-72 object-contain rounded mb-4"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemoveImage}
                      >
                        Remove
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleTriggerFileInput}
                      >
                        Change
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center">
                      <svg
                        width="64"
                        height="64"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="text-muted-foreground mb-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zm16 0l-4.586 4.586a2 2 0 01-2.828 0L7 7"
                        />
                      </svg>
                      <span className="text-muted-foreground mb-4">
                        Select a cover image for the template
                      </span>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleTriggerFileInput}
                        >
                          <span className="mr-2">&#8682;</span> Upload
                        </Button>
                      </div>
                    </div>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  tabIndex={-1}
                  aria-label="Upload cover image"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => setActiveTab("pages")}
                disabled={!template.title}
                aria-label="Continue to Pages"
              >
                Continue to Pages
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="pages">
        <Card>
          <CardHeader>
            <CardTitle>Edit Pages & Questions</CardTitle>
            <CardDescription>
              Update the structure of your audit template
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PagesManager template={template} setTemplate={setTemplate} />
            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab("details")}
                aria-label="Back to Details"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={() => setActiveTab("preview")}
                aria-label="Continue to Preview"
                disabled={template.pages.length === 0}
              >
                Continue to Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="preview">
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              Preview how your audit template will appear to users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TemplatePreview template={template} />
            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab("pages")}
                aria-label="Back to Pages"
              >
                Back
              </Button>
              <form action={handleSubmit}>
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !template.title ||
                    template.pages.length === 0
                  }
                  aria-label="Update Template"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2
                        className="mr-2 h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                      Updating...
                    </>
                  ) : (
                    "Update Template"
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
