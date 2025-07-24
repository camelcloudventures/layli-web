'use client'

import { DataTable } from '@/components/custom/data-table'
import { Action } from '@/lib/types'
import { ColumnDef } from '@tanstack/react-table'

interface ActionListProps {
  actions: Action[]
  columns: ColumnDef<Action>[]
}

export function ActionList({ actions, columns }: ActionListProps) {
  return <DataTable columns={columns} data={actions} border />
}
