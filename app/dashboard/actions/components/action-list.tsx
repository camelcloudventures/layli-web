'use client'

import { DataTable } from '@/components/custom/data-table'
import { Action } from '@/lib/types'
import { columns } from './columns'

interface ActionListProps {
  actions: Action[]
}

export function ActionList({ actions }: ActionListProps) {
  return <DataTable columns={columns} data={actions} border />
}
