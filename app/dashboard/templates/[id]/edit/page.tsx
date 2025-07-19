import { getTemplate } from '@/app/dashboard/templates/actions/actions'
import { redirect } from 'next/navigation'
import EditTemplateShell from './components/edit-template-shell'

export const dynamic = 'force-dynamic'

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const template = await getTemplate(id)
  if (!template || (template && 'error' in template)) {
    redirect('/dashboard/templates')
  }
  // If wrapped, unwrap
  const realTemplate = 'data' in template ? template.data : template
  return <EditTemplateShell template={realTemplate} />
}
