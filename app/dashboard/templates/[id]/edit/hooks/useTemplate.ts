import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  updateTemplate,
  deleteTemplate,
} from "@/app/dashboard/templates/actions/actions";
import { useTemplatesStore } from "@/store/templates";
import { useShallow } from "zustand/react/shallow";

interface Template {
  id: string;
  title: string;
  description: string;
  //eslint-disable-next-line
  pages: any[];
}

export function useTemplate(initialTemplate: Template) {
  const router = useRouter();
  const [template, setTemplate] = useState<Template>(initialTemplate);
  const [isSaving, setIsSaving] = useState(false);

  const { reset } = useTemplatesStore(
    useShallow((state) => ({
      reset: state.reset,
    }))
  );
  async function handleSaveTemplate() {
    if (!template.title) {
      toast.error("Template title is required");
      return false;
    }
    if (template.pages.length === 0) {
      toast.error("At least one page is required");
      return false;
    }

    setIsSaving(true);
    try {
      const result = await updateTemplate(template);
      if (result && result.error) {
        toast.error(result.error);
        return false;
      }
      reset();
      router.push(`/dashboard/templates/${template.id}/preview`);
      toast.success(result?.success || "Template updated successfully");
      return true;
    } catch {
      toast.error("Failed to update template");
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteTemplate() {
    try {
      const res = await deleteTemplate(template.id);
      console.log("res", res);

      if (res?.error) toast.error(res?.error || "Failed");
      toast.success("Template deleted successfully!");
      reset();
      router.push("/dashboard/templates");
    } catch {
      toast.error("Failed to delete template");
    }
  }

  return {
    template,
    setTemplate,
    isSaving,
    handleSaveTemplate,
    handleDeleteTemplate,
  };
}
