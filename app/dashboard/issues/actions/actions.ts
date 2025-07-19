'use server'

import { GET } from '@/app/backend/apiMethods'
import { Assignee, Issue } from '@/types/types'

export async function createIssue(formData: FormData, assignees: Assignee[]) {
  const category = formData.get('category')
  const priority = formData.get('priority')
  const date = formData.get('date')
  const description = formData.get('description')
  const title = formData.get('title')

  const data = {
    category,
    priority,
    assignees,
    date,
    description,
    title,
  }

  console.log('data for submission', data)
}

export async function getIssues(): Promise<{ data: Issue[] } | null> {
  return await GET('/issues', ['issues'])
}
