import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SiteFormData } from "../actions/types";

interface SitesFormProps {
  onSubmit: (data: SiteFormData) => void;
}

export function SitesForm({ onSubmit }: SitesFormProps) {
  const [form, setForm] = useState<SiteFormData>({
    name: "",
    address: "",
    longitude: 0,
    latitude: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(form);
  };

  const isDisabled = !form.name || !form.address;

  return (
    <form className="space-y-6 flex flex-col" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
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

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Enter site URL"
            value={form.address}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label
            htmlFor="longitude"
            className="block text-sm font-medium text-gray-700"
          >
            Longitude
          </label>
          <input
            type="number"
            id="longitude"
            name="longitude"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Enter longitude"
            value={form.longitude}
            onChange={handleChange}
          />
        </div>
        <div>
          <label
            htmlFor="latitude"
            className="block text-sm font-medium text-gray-700"
          >
            Latitude
          </label>
          <input
            type="number"
            id="latitude"
            name="latitude"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Enter latitude"
            value={form.latitude}
            onChange={handleChange}
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={isDisabled}
        className="w-fit ml-auto self-end"
      >
        Save
      </Button>
    </form>
  );
}
