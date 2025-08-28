import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SiteFormData } from "../actions/types";

interface SitesFormProps {
  isLoading?: boolean;
  onSubmit: (data: SiteFormData) => void;
}

export function SitesForm({ onSubmit, isLoading }: SitesFormProps) {
  const [form, setForm] = useState<SiteFormData>({
    name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(form);
  };

  const isDisabled = !form.name;

  return (
    <form className="space-y-6 flex flex-col" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Site Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Enter site name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={isDisabled || isLoading}
        className="w-fit ml-auto self-end"
      >
        {isLoading ? "Creating..." : "Create"}
      </Button>
    </form>
  );
}
