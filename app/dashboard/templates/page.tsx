import { getTemplates } from './actions/actions'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TemplateSearch } from './components/template-search'

interface PageProps {
  searchParams: { search?: string }
}

export default async function AuditTemplatesPage({ searchParams }: PageProps) {
  const response = await getTemplates()

  if (!response) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Templates</CardTitle>
          <CardDescription>
            There was an error loading the templates. Please try again later.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Templates</h1>
          <p className="text-muted-foreground">
            Create and manage audit templates
          </p>
        </div>
      </div>

      <TemplateSearch
        templates={response.data}
        searchParams={await searchParams}
      />
    </div>
  )
}
