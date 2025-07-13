'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

type FileAttachmentProp = {
  isFileDialogOpen: boolean
  setIsFileDialogOpen: (isOpen: boolean) => void
  selectedFile: File | null
  setSelectedFile: (file: File | null) => void
  handleAttachFile: () => void
}
export function FileAttachmentDialog({
  isFileDialogOpen,
  setIsFileDialogOpen,
  selectedFile,
  setSelectedFile,
  handleAttachFile,
}: FileAttachmentProp) {
  return (
    <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Attach File</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="file">Select File</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setSelectedFile(file)
                }
              }}
            />
          </div>
          {selectedFile && (
            <p className="text-sm text-muted-foreground">
              Selected file: {selectedFile.name} (
              {Math.round(selectedFile.size / 1024)} KB)
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsFileDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAttachFile} disabled={!selectedFile}>
            Attach
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
