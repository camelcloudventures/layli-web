'use client'

import { useState } from 'react'
import { Search, Plus, FileText, PlusCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Inspection } from '@/lib/types/inspection-types'
import { columns } from './columns'
import { DataTable } from '@/components/custom/data-table'
import Loading from './loading'
import { useRouter } from 'next/navigation'

interface InspectionListProps {
  inspections: Inspection[]
  loading?: boolean
}

export function InspectionList({
  inspections = [],
  loading = false,
}: InspectionListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  // Ensure inspections is an array
  const inspectionsArray = Array.isArray(inspections) ? inspections : []

  const filteredInspections = inspectionsArray.filter((inspection) => {
    return (
      inspection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inspection.site?.name || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (inspection.prepared_by || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
  })

  const handleCreateFromScratch = () => {
    router.push('/dashboard/inspections/create?mode=scratch')
  }

  const handleCreateFromTemplate = () => {
    router.push('/dashboard/inspections/create?mode=template')
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <div className="flex items-center justify-end space-x-2 mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search inspections..."
            className="w-[250px] pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Inspection
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem onClick={handleCreateFromScratch}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create from Scratch
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCreateFromTemplate}>
              <FileText className="mr-2 h-4 w-4" />
              Use Template
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div>
        <DataTable
          columns={columns}
          data={filteredInspections}
          className="[&_table]:border-collapse [&_th]:!border-b-gray-200 [&_th]:!text-gray-600 [&_th]:!font-medium [&_td]:!py-4 [&_tr]:!border-b [&_tr]:border-gray-100 [&_tr:last-child]:!border-0 [&_tr:first-child]:!border-t-0 [&_tr]:!border-x-0"
        />
      </div>
    </div>
  )
}
