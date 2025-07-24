'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import { FileText, PlusCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import CreateAuditBtn from './create-audit-btn'

export function EmptyTemplatesState() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute -top-4 -right-4"
          >
            <PlusCircle className="h-6 w-6 text-primary animate-pulse" />
          </motion.div>
          <FileText className="h-16 w-16 text-muted-foreground mb-6" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-3"
        >
          <CardTitle className="text-2xl font-semibold">
            No Templates Available
          </CardTitle>
          <CardDescription className="max-w-md text-base">
            You haven&apos;t created any audit templates yet. Click the
            &quot;Create Template&quot; button above to get started.
          </CardDescription>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8"
        >
          <CreateAuditBtn />
        </motion.div>
      </CardContent>
    </Card>
  )
}
