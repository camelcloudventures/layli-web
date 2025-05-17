'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { TemplateGrid } from '@/app/dashboard/templates/components/template-grid'
import { useRouter } from 'next/navigation'
import { mockTemplates } from '@/lib/data/mock-templates'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { AuditTemplate } from '@/lib/types/audit-types'

export default function AuditTemplatesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [templates, setTemplates] = useState<AuditTemplate[]>([])

  useEffect(() => {
    // Try to load templates from localStorage
    const savedTemplates = localStorage.getItem('auditTemplates')
    if (savedTemplates) {
      try {
        const parsedTemplates = JSON.parse(savedTemplates)
        setTemplates([...mockTemplates, ...parsedTemplates])
      } catch (e) {
        console.error('Error parsing saved templates:', e)
        setTemplates(mockTemplates)
      }
    } else {
      // If no templates in localStorage, use mock templates
      setTemplates(mockTemplates)
    }
  }, [])

  const filteredTemplates = templates.filter((template) =>
    template.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Templates</h1>
          <p className="text-muted-foreground">
            Create and manage audit templates
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/templates/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {filteredTemplates.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Templates Found</CardTitle>
            <CardDescription>
              No audit templates match your search criteria. Try a different
              search term or create a new template.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Button onClick={() => router.push('/dashboard/templates/create')}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <TemplateGrid templates={filteredTemplates} />
      )}
    </div>
  )
}
