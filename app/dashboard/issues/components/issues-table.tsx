'use client'

import { DataTable } from '@/components/custom/data-table'
import { createColumns } from './columns'
import { Issue } from '@/lib/types'

interface IssuesTableProps {
  issues: Issue[]
  assignees: Array<{
    id: string
    full_name: string
    email: string
    role: string
  }>
}

export default function IssuesTable({ issues, assignees }: IssuesTableProps) {
  const columns = createColumns(assignees)

  return <DataTable columns={columns} data={issues} border />
}
