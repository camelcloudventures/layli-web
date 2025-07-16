'use client'

import { useState, useRef, useEffect } from 'react'
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
  const [localSignature, setLocalSignature] = useState<string>('')
  const sigCanvas = useRef<SignatureCanvas | null>(null)

  // Initialize local signature from response
  useEffect(() => {
    setLocalSignature(response?.response_value || '')
  }, [response?.response_value])

  const handleSaveSignature = () => {
    if (sigCanvas.current) {
      const signature = sigCanvas.current.toDataURL()
      setLocalSignature(signature)
      onResponse(signature) // This updates the local state, not saved to backend yet
      setIsDialogOpen(false)
    }
  }

  const handleClearSignature = () => {
    setLocalSignature('')
    onResponse('') // Clear the local signature
    if (sigCanvas.current) {
      sigCanvas.current.clear()
    }
  }

  return (
    <div className="space-y-2 w-full">
      <Label>{question.text}</Label>
      <div className="p-2 border rounded-md bg-muted min-h-[120px] flex items-center justify-center">
        {localSignature ? (
          <Image
            width={450}
            height={200}
            src={localSignature}
            alt="Signature"
            className="max-w-full h-auto"
          />
        ) : (
          <p className="text-muted-foreground">No signature provided</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsDialogOpen(true)}
          disabled={isDisabled}
        >
          {localSignature ? 'Edit Signature' : 'Add Signature'}
        </Button>
        {localSignature && (
          <Button
            type="button"
            variant="outline"
            onClick={handleClearSignature}
            disabled={isDisabled}
          >
            Clear Signature
          </Button>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-full ">
          <DialogHeader>
            <DialogTitle>Provide Signature</DialogTitle>
          </DialogHeader>
          <div className=" border-2 border-dashed rounded-md w-full">
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
