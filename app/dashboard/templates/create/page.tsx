import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import CreateAuditForm from './components/create-audit-form'

export default function CreateTemplatePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="icon">
            <Link href="/dashboard/templates" aria-label="Back to templates">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create Audit Template
            </h1>
            <p className="text-muted-foreground">
              Build a new audit template from scratch
            </p>
          </div>
        </div>
      </div>

      <CreateAuditForm />
    </div>
  )
}
