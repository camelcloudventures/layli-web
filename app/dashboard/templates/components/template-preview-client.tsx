'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TemplatePreviewContent } from './template-preview-content'
import type { AuditTemplate } from '@/lib/types/audit-types'

interface TemplatePreviewClientProps {
  template: AuditTemplate
}

export function TemplatePreviewClient({
  template,
}: TemplatePreviewClientProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const pageCount = template.pages.length

  const goToNextPage = () => {
    if (currentPageIndex < pageCount - 1)
      setCurrentPageIndex(currentPageIndex + 1)
  }
  const goToPrevPage = () => {
    if (currentPageIndex > 0) setCurrentPageIndex(currentPageIndex - 1)
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrevPage}
          disabled={currentPageIndex === 0}
          className="rounded-r-none"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={goToNextPage}
          disabled={currentPageIndex === pageCount - 1}
          className="rounded-l-none"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <TemplatePreviewContent
        template={template}
        currentPageIndex={currentPageIndex}
      />
    </div>
  )
}
