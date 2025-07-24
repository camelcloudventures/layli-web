import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
export default function CreateAuditBtn() {
  return (
    <div>
      <Button asChild>
        <Link href="/dashboard/templates/create">
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Link>
      </Button>
    </div>
  )
}
