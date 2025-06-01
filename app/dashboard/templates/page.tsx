import { getTemplates } from './actions/actions'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import CreateAuditBtn from './components/create-audit-btn'
import { EmptyTemplatesState } from './components/empty-templates-state'
import { TemplateSearch } from './components/template-search'
import HasPermission from '../components/has-permission'
import { Permission } from '@/lib/auth/auth'

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string }>
}

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AuditTemplatesPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const pageNumber = Number(resolvedParams.page) || 1
  const response = await getTemplates(pageNumber)

  console.log('response', response)

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
        <HasPermission permission={Permission.EDIT_TEMPLATES}>
          <CreateAuditBtn />
        </HasPermission>
      </div>

      {hasTemplates ? (
        <TemplateSearch
          templates={response.data}
          searchParams={resolvedParams}
          page={pageNumber}
          totalPages={response.pagination.totalPages}
        />
      ) : (
        <HasPermission permission={Permission.EDIT_TEMPLATES}>
          <EmptyTemplatesState />
        </HasPermission>
      )}
    </div>
  )
}
