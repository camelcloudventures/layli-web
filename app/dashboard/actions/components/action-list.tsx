"use client"

import { useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { format } from "date-fns"
import { ArrowUpDown, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Action } from "@/lib/types/action-types"
import { mockUsers, mockSites } from "@/lib/data/mock-actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ActionListProps {
  actions: Action[]
  onEditAction: (action: Action) => void
  onDeleteAction: (actionId: string) => void
}

export function ActionList({ actions, onEditAction, onDeleteAction }: ActionListProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [actionToDelete, setActionToDelete] = useState<string | null>(null)

  const columns: ColumnDef<Action>[] = [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => <div className="text-xs font-medium">{row.getValue("code")}</div>,
    },
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const statusMap: Record<string, { label: string; className: string }> = {
          todo: { label: "To Do", className: "bg-blue-100 text-blue-800" },
          in_progress: { label: "In Progress", className: "bg-yellow-100 text-yellow-800" },
          completed: { label: "Completed", className: "bg-green-100 text-green-800" },
        }
        const { label, className } = statusMap[status] || { label: status, className: "" }
        return (
          <Badge variant="outline" className={className}>
            {label}
          </Badge>
        )
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Priority
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const priority = row.getValue("priority") as string
        const priorityColors: Record<string, string> = {
          low: "bg-green-100 text-green-800",
          medium: "bg-yellow-100 text-yellow-800",
          high: "bg-red-100 text-red-800",
        }
        return (
          <Badge variant="outline" className={priorityColors[priority]}>
            {priority}
          </Badge>
        )
      },
    },
    {
      accessorKey: "due_at",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            Due Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("due_at") as string)
        return <div>{format(date, "MMM d, yyyy")}</div>
      },
      sortingFn: "datetime",
    },
    {
      accessorKey: "assignee_id",
      header: "Assignee",
      cell: ({ row }) => {
        const assigneeId = row.getValue("assignee_id") as string
        const assignee = mockUsers.find((user) => user.id === assigneeId)
        return assignee ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={assignee.avatar || "/placeholder.svg"} alt={assignee.name} />
              <AvatarFallback className="text-xs">
                {assignee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span>{assignee.name}</span>
          </div>
        ) : (
          <span>Unassigned</span>
        )
      },
    },
    {
      accessorKey: "site_id",
      header: "Site",
      cell: ({ row }) => {
        const siteId = row.getValue("site_id") as string
        const site = mockSites.find((site) => site.id === siteId)
        return site ? <div>{site.name}</div> : <span>No site</span>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const action = row.original
        return (
          <div className="flex justify-end">
            <AlertDialog open={actionToDelete === action.id} onOpenChange={(open) => !open && setActionToDelete(null)}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    setActionToDelete(action.id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete action</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the action "{action.title}". This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      onDeleteAction(action.id)
                      setActionToDelete(null)
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: actions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onEditAction(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No actions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
