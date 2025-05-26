import { getTemplate } from '@/app/dashboard/templates/actions/actions'
import { redirect } from 'next/navigation'
import EditTemplateShell from './components/edit-template-shell'

export default async function EditTemplatePage({
  params,
}: {
  params: { id: string }
}) {
  const template = await getTemplate(params.id)
  if (!template || (template && 'error' in template)) {
    redirect('/dashboard/templates')
  }
  // If wrapped, unwrap
  const realTemplate = 'data' in template ? template.data : template
  //@ts-expect-error -wn
  return <EditTemplateShell template={realTemplate} />
}
