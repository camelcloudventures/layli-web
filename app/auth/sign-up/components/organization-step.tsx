'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import SubmitBtn from '@/components/custom/submit-btn'

const organizationTypes = [
  { value: 'Construction', label: 'Construction' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Education', label: 'Education' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Hospitality', label: 'Hospitality' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Real Estate', label: 'Real Estate' },
  { value: 'Other', label: 'Other' },
]

interface OrganizationStepProps {
  onSubmit: (formData: FormData) => Promise<void>
  isSubmitting: boolean
}

export default function OrganizationStep({
  onSubmit,
  isSubmitting,
}: OrganizationStepProps) {
  return (
    <form action={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Organization Name</Label>
        <Input id="name" name="name" placeholder="Acme Corporation" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">Organization Type</Label>
        <Select name="type" required>
          <SelectTrigger>
            <SelectValue placeholder="Select organization type" />
          </SelectTrigger>
          <SelectContent>
            {organizationTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <SubmitBtn
        label={isSubmitting ? 'Creating...' : 'Create Organization'}
        variant="default"
        className="w-full"
        isDisabled={isSubmitting}
      />
    </form>
  )
}
