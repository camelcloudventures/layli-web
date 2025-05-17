'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, FileText } from 'lucide-react'
import type { AuditTemplate } from '@/lib/types/audit-types'
import { TemplateGrid } from '@/app/dashboard/templates/components/template-grid'
import { mockTemplates } from '@/lib/data/mock-templates'

export default function AuditTemplatesPageClient() {
  const [templates, setTemplates] = useState<AuditTemplate[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load templates from localStorage and combine with mock templates
    const loadTemplates = () => {
      setIsLoading(true)

      let allTemplates = [...mockTemplates]

      // Get user-created templates from localStorage
      const savedTemplates = localStorage.getItem('auditTemplates')
      if (savedTemplates) {
        try {
          const parsedTemplates = JSON.parse(savedTemplates)
          allTemplates = [...allTemplates, ...parsedTemplates]
        } catch (e) {
          console.error('Error parsing saved templates:', e)
        }
      }

      // Sort templates by creation date (newest first)
      allTemplates.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
        return dateB - dateA
      })

      setTemplates(allTemplates)
      setIsLoading(false)
    }

    loadTemplates()
  }, [])

  // Filter templates based on search query
  const filteredTemplates = templates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Templates</h1>
          <p className="text-muted-foreground">
            Create and manage audit templates
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/templates/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-[400px] items-center justify-center">
          <p>Loading templates...</p>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-md border py-16">
          <FileText className="h-16 w-16 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No Templates Found</h3>
          <p className="mt-2 text-center text-muted-foreground">
            {searchQuery
              ? 'No templates match your search query'
              : 'Get started by creating your first template'}
          </p>
          {!searchQuery && (
            <Button className="mt-4" asChild>
              <Link href="/dashboard/templates/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <TemplateGrid templates={filteredTemplates} />
      )}
    </div>
  )
}
