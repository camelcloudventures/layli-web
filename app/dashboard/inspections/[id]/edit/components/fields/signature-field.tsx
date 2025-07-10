'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { Question, Response } from '@/lib/types/inspection-types'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import SignatureCanvas from 'react-signature-canvas'
import Image from 'next/image'

interface SignatureFieldProps {
  question: Question
  response?: Response
  onResponse: (value: string) => void
  isDisabled?: boolean
}

export function SignatureField({
  question,
  response,
  onResponse,
  isDisabled,
}: SignatureFieldProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const sigCanvas = useRef<SignatureCanvas | null>(null)

  const handleSaveSignature = () => {
    if (sigCanvas.current) {
      const signature = sigCanvas.current.toDataURL()
      onResponse(signature)
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="space-y-2">
      <Label>{question.text}</Label>
      <div className="p-2 border rounded-md bg-muted min-h-[120px] flex items-center justify-center">
        {response?.response_value ? (
          <Image
            width={450}
            height={200}
            src={response.response_value}
            alt="Signature"
            className="max-w-full h-auto"
          />
        ) : (
          <p className="text-muted-foreground">No signature provided</p>
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsDialogOpen(true)}
        disabled={isDisabled}
      >
        {response?.response_value ? 'Edit Signature' : 'Add Signature'}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Provide Signature</DialogTitle>
          </DialogHeader>
          <div className="p-4 border-2 border-dashed rounded-md">
            <SignatureCanvas
              ref={sigCanvas}
              penColor="black"
              canvasProps={{
                width: 450,
                height: 200,
                className: 'sigCanvas',
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => sigCanvas.current?.clear()}
            >
              Clear
            </Button>
            <Button onClick={handleSaveSignature}>Save Signature</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
