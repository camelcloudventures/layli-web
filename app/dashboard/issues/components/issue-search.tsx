'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function IssueSearch() {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search issues by title, description, category, priority, status..."
        className="pl-10"
      />
    </div>
  )
}
