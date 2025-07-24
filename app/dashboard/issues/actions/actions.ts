'use server'

import { DELETE, GET, POST, UPDATE } from '@/app/backend/apiMethods'
import { Assignee, Issue } from '@/lib/types'
import { revalidateTag } from 'next/cache'

export async function createIssue(
  formData: FormData,
  assignees: Assignee[],
  reporter: Assignee,
) {
  const category = formData.get('category')
  const priority = formData.get('priority')
  const cause = formData.get('cause')
  const due_at = formData.get('date')
  const title = formData.get('title')
  const images = JSON.parse(formData.get('images') as string)

  const attachments = images?.map((image: { uploadedUrl: string }) => {
    return {
      attachments: image.uploadedUrl,
    }
  })
  console.log('attachments', attachments)

  const data = {
    category,
    priority,
    assignees,
    due_at,
    cause,
    title,
    attachments,
    reporter,
  }

  console.log('data for submission', data)
  const response = await POST('/issues/create', data, true)
  revalidateTag('issues')
  return response
}

export async function getIssues(): Promise<{ data: Issue[] } | null> {
  return await GET('/issues', ['issues'])
}

export async function updateIssue(issueId: string, formData: FormData) {
  const payload = {
    title: formData.get('title') as string,
    cause: formData.get('cause') as string,
    solution: formData.get('solution') as string,
    status: formData.get('status') as string,
    priority: formData.get('priority') as string,
    assignees: formData.getAll('assignee_ids'),
    due_at: formData.get('due_at')
      ? new Date(formData.get('due_at') as string).toISOString()
      : null,
  }

  const res = await UPDATE(`/issues/${issueId}`, payload, ['issues'])
  revalidateTag('issues')
  return res
}

export async function addComment(
  issueId: string,
  formData: FormData,

  commenter: {
    id: string
    full_name: string
    email: string
    role: string
  },
) {
  const comment = formData.get('comment') as string
  const data = {
    comment,
    commenter,
  }

  const res = await POST(`/issues/${issueId}/comments/add`, data)
  revalidateTag('issues')
  return res
}

export async function shareIssue(issueId: string, assignees: Assignee[]) {
  console.log('assignees', assignees)
  const res = await POST(`/issues/${issueId}/assignees/add`, assignees)
  revalidateTag('issues')
  return res
}

export async function closeIssue(issueId: string, solution: string) {
  const res = await UPDATE(`/issues/${issueId}/close`, {
    solution,
  })
  revalidateTag('issues')
  return res
}

export async function deleteIssue(issueId: string) {
  const res = await DELETE(`/issues/${issueId}/delete`, {})
  revalidateTag('issues')
  return res
}
