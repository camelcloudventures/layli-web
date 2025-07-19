"use client"

import { useState, useEffect, useCallback } from "react"
import ProtectedRoute from "@/components/auth/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { Download, FileText, Loader2, MoreHorizontal, Plus, Search, Share2, Trash2 } from "lucide-react"
import { mockIssues } from "@/lib/data/mock-issues"
import type { Issue, IssueStatus, IssuePriority, IssueCategory } from "@/lib/types/issue-types"
import { IssueDetails } from "@/components/issues/issue-details"
import { ReportIssueForm } from "@/components/issues/report-issue-form"
import { IssueShareDialog } from "@/components/issues/issue-share-dialog"

export default function IssuesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [issues, setIssues] = useState<Issue[]>([])
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  // Load issues from localStorage or use mock data
  useEffect(() => {
    setIsLoading(true)
    try {
      const savedIssues = localStorage.getItem("auditIssues")
      if (savedIssues) {
        const parsedIssues = JSON.parse(savedIssues)
        setIssues(parsedIssues)
      } else {
        // Initialize with mock data
        setIssues(mockIssues)
        localStorage.setItem("auditIssues", JSON.stringify(mockIssues))
      }
    } catch (error) {
      console.error("Error loading issues:", error)
      setIssues(mockIssues)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save issues to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("auditIssues", JSON.stringify(issues))
    }
  }, [issues, isLoading])

  // Filter issues based on search query - memoized to improve performance
  const filteredIssues = useCallback(() => {
    if (!searchQuery.trim()) return issues

    const query = searchQuery.toLowerCase().trim()

    return issues.filter((issue) => {
      // Check various fields
      return (
        issue.title.toLowerCase().includes(query) ||
        issue.description.toLowerCase().includes(query) ||
        issue.category.toLowerCase().includes(query) ||
        issue.priority.toLowerCase().includes(query) ||
        issue.status.toLowerCase().includes(query) ||
        issue.reporter_name.toLowerCase().includes(query) ||
        (issue.assignee_name && issue.assignee_name.toLowerCase().includes(query)) ||
        (issue.audit_name && issue.audit_name.toLowerCase().includes(query))
      )
    })
  }, [issues, searchQuery])

  // Compute filtered issues only when needed
  const displayedIssues = filteredIssues()

  const getStatusBadgeColor = (status: IssueStatus) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "resolved":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "closed":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const getPriorityTextColor = (priority: IssuePriority) => {
    switch (priority) {
      case "critical":
        return "text-red-600"
      case "high":
        return "text-orange-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const getCategoryBadgeColor = (category: IssueCategory) => {
    return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }

  // Handle creating a new issue
  const handleCreateIssue = useCallback((newIssue: Issue) => {
    setIssues((prevIssues) => [newIssue, ...prevIssues])
    setIsReportDialogOpen(false)
    toast({
      title: "Success",
      description: "Issue reported successfully",
    })
  }, [])

  // Handle updating an issue
  const handleUpdateIssue = useCallback((updatedIssue: Issue) => {
    setIssues((prevIssues) => prevIssues.map((issue) => (issue.id === updatedIssue.id ? updatedIssue : issue)))
    toast({
      title: "Success",
      description: "Issue updated successfully",
    })
  }, [])

  // Handle deleting an issue
  const handleDeleteIssue = useCallback(() => {
    if (selectedIssue) {
      setIssues((prevIssues) => prevIssues.filter((issue) => issue.id !== selectedIssue.id))
      setIsDeleteDialogOpen(false)
      setIsDetailsDialogOpen(false)
      setSelectedIssue(null)
      toast({
        title: "Success",
        description: "Issue deleted successfully",
      })
    }
  }, [selectedIssue])

  // Open the issue details dialog
  const openIssueDetails = useCallback((issue: Issue) => {
    setSelectedIssue(issue)
    setIsDetailsDialogOpen(true)
  }, [])

  // Handle sharing an issue
  const handleShareIssue = useCallback(() => {
    toast({
      title: "Success",
      description: "Issue shared successfully",
    })
    setIsShareDialogOpen(false)
  }, [])

  // Handle downloading CSV of issues
  const handleDownloadCsv = useCallback(() => {
    try {
      setIsExporting(true)

      // Create CSV content
      const headers = [
        "ID",
        "Title",
        "Description",
        "Category",
        "Priority",
        "Status",
        "Reporter",
        "Assignee",
        "Created At",
        "Due Date",
      ]

      const rows = displayedIssues.map((issue) => [
        issue.id,
        issue.title,
        issue.description,
        issue.category,
        issue.priority,
        issue.status,
        issue.reporter_name,
        issue.assignee_name || "Unassigned",
        new Date(issue.created_at).toLocaleDateString(),
        issue.due_date ? new Date(issue.due_date).toLocaleDateString() : "No due date",
      ])

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
      ].join("\n")

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `issues-${new Date().toISOString().split("T")[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Success",
        description: "Issues exported to CSV",
      })
    } catch (error) {
      console.error("Error exporting CSV:", error)
      toast({
        title: "Error",
        description: "Failed to export issues to CSV",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }, [displayedIssues])

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Issues</h1>
            <p className="text-muted-foreground">Track and manage audit issues</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadCsv} disabled={isExporting}>
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </>
              )}
            </Button>
            <Button onClick={() => setIsReportDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Report Issue
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search issues by title, description, category, priority, status..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {searchQuery && (
            <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")} className="h-9 px-2">
              Clear
            </Button>
          )}
        </div>

        {searchQuery && displayedIssues.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Found {displayedIssues.length} {displayedIssues.length === 1 ? "issue" : "issues"} for "{searchQuery}"
          </p>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <p>Loading issues...</p>
          </div>
        ) : displayedIssues.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Issues Found</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <Button onClick={() => setIsReportDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Report New Issue
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Issue List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Category</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Reporter</TableHead>
                      <TableHead className="hidden lg:table-cell">Created</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedIssues.map((issue) => (
                      <TableRow key={issue.id} className="cursor-pointer" onClick={() => openIssueDetails(issue)}>
                        <TableCell className="font-medium">{issue.title}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="secondary" className={getCategoryBadgeColor(issue.category)}>
                            {issue.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getPriorityTextColor(issue.priority)}>
                            {issue.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getStatusBadgeColor(issue.status)}>
                            {issue.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{issue.reporter_name}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {new Date(issue.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openIssueDetails(issue)
                                }}
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                View details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedIssue(issue)
                                  setIsShareDialogOpen(true)
                                }}
                              >
                                <Share2 className="mr-2 h-4 w-4" />
                                Share issue
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedIssue(issue)
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete issue
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Issue Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Issue Details</DialogTitle>
          </DialogHeader>
          {selectedIssue && (
            <IssueDetails
              issue={selectedIssue}
              onUpdate={handleUpdateIssue}
              onDelete={() => {
                setIsDeleteDialogOpen(true)
              }}
              onShare={() => {
                setIsShareDialogOpen(true)
              }}
              onClose={() => setIsDetailsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Report Issue Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Report Issue</DialogTitle>
            <DialogDescription>Report a new issue that requires attention or action.</DialogDescription>
          </DialogHeader>
          <ReportIssueForm onSubmit={handleCreateIssue} onCancel={() => setIsReportDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Share Issue Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Share Issue</DialogTitle>
            <DialogDescription>Share this issue with team members</DialogDescription>
          </DialogHeader>
          {selectedIssue && (
            <IssueShareDialog
              issue={selectedIssue}
              onShare={handleShareIssue}
              onCancel={() => setIsShareDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the issue &quot;{selectedIssue?.title}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteIssue} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ProtectedRoute>
  )
}
