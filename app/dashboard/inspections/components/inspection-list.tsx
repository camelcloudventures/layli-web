'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format, differenceInMinutes } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Edit,
  Download,
  Play,
  Search,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MoreHorizontal,
  Plus,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Inspection } from '@/lib/types/inspection-types'

interface InspectionListProps {
  inspections: Inspection[]
  loading?: boolean
  onCreateInspection: () => void
}

export function InspectionList({
  inspections,
  loading = false,
  onCreateInspection,
}: InspectionListProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Inspection | null
    direction: 'ascending' | 'descending'
  }>({
    key: null,
    direction: 'ascending',
  })

  const handleSort = (key: keyof Inspection) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const sortedInspections = [...inspections].sort((a, b) => {
    if (!sortConfig.key) return 0

    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]

    if (aValue && bValue && aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1
    }
    if (aValue && bValue && aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1
    }
    return 0
  })

  const filteredInspections = sortedInspections.filter((inspection) => {
    return (
      inspection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inspection.location.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      inspection.user_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const getStatusBadge = (inspection: Inspection) => {
    if (inspection.status === 'completed') {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Completed
        </Badge>
      )
    } else if (inspection.status === 'in_progress') {
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
          <Clock className="mr-1 h-3 w-3" />
          In Progress
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Draft
        </Badge>
      )
    }
  }

  const handleContinue = (id: string) => {
    router.push(`/dashboard/inspections/${id}/edit`)
  }

  const handleViewReport = (id: string) => {
    router.push(`/dashboard/inspections/${id}/report`)
  }

  const handleEditInspection = (id: string) => {
    router.push(`/dashboard/inspections/${id}/edit`)
  }

  const handleDownloadReport = (id: string) => {
    // In a real application, this would trigger a PDF download
    alert(`Downloading report for inspection ${id}`)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div>
          <div className="h-12 bg-gray-50 flex items-center px-4">
            <div className="grid grid-cols-6 gap-4 w-full">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 border-b flex items-center px-4">
              <div className="grid grid-cols-6 gap-4 w-full">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
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
        <Button onClick={onCreateInspection}>
          <Plus className="mr-2 h-4 w-4" />
          Create Inspection
        </Button>
      </div>

      <div className="shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                onClick={() => handleSort('name')}
                className="cursor-pointer"
              >
                Name
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>Location</TableHead>
              <TableHead
                onClick={() => handleSort('conducted_on')}
                className="cursor-pointer"
              >
                Date
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead
                onClick={() => handleSort('user_name')}
                className="cursor-pointer"
              >
                Inspector
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead
                onClick={() => handleSort('status')}
                className="cursor-pointer"
              >
                Status
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead
                onClick={() => handleSort('score')}
                className="cursor-pointer"
              >
                Score
                <ArrowUpDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInspections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No inspections found.
                </TableCell>
              </TableRow>
            ) : (
              filteredInspections.map((inspection) => (
                <TableRow key={inspection.id}>
                  <TableCell className="font-medium">
                    {inspection.name}
                  </TableCell>
                  <TableCell>{inspection.location.name}</TableCell>
                  <TableCell>
                    {format(inspection.conducted_on, 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>{inspection.user_name}</TableCell>
                  <TableCell>{getStatusBadge(inspection)}</TableCell>
                  <TableCell>
                    {inspection.score !== null ? `${inspection.score}%` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {inspection.status === 'completed' ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewReport(inspection.id)}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            View Report
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownloadReport(inspection.id)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download Report
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : Math.abs(
                        differenceInMinutes(
                          new Date(inspection.last_modified),
                          new Date(),
                        ),
                      ) <= 30 ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleContinue(inspection.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditInspection(inspection.id)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Inspection
                          </DropdownMenuItem>
                          {inspection.status !== 'draft' && (
                            <DropdownMenuItem
                              onClick={() => handleViewReport(inspection.id)}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              View Report
                            </DropdownMenuItem>
                          )}
                          {inspection.status === 'draft' && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleDownloadReport(inspection.id)
                              }
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download Report
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
