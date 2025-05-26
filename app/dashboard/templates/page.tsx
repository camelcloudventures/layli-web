import { getTemplates } from './actions/actions'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TemplateSearch } from './components/template-search'
import CreateAuditBtn from './components/create-audit-btn'
import { EmptyTemplatesState } from './components/empty-templates-state'

interface PageProps {
  searchParams: { search?: string; page?: string }
}

export default async function AuditTemplatesPage({ searchParams }: PageProps) {
  const page = Number(searchParams.page) || 1
  const response = await getTemplates(page)

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

  const hasTemplates = response.data && response.data.length > 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center ">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Audit Templates
            </h1>
            <p className="text-muted-foreground">
              Create and manage audit templates
            </p>
          </div>
        </div>
        <CreateAuditBtn />
      </div>

      {hasTemplates ? (
        <TemplateSearch
          templates={response.data}
          searchParams={searchParams}
          page={page}
          totalPages={response.pagination.totalPages}
        />
      ) : (
        <EmptyTemplatesState />
      )}
    </div>
  )
}
