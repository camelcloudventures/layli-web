'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Pen, Eraser, Undo } from 'lucide-react'
import type { Question, Response } from '@/lib/types/inspection-types'

interface SignatureFieldProps {
  question: Question
  response?: Response
  onResponse: (value: string) => void
}

export function SignatureField({ question, onResponse }: SignatureFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [history, setHistory] = useState<ImageData[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const saveToHistory = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(imageData)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    setIsDrawing(true)
    const rect = canvas.getBoundingClientRect()
    const x =
      'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y =
      'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
  }

  const draw = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const rect = canvas.getBoundingClientRect()
    const x =
      'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
    const y =
      'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

    ctx.lineTo(x, y)
    ctx.stroke()
    setHasSignature(true)
  }

  const endDrawing = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    setIsDrawing(false)
    ctx.closePath()
    saveToHistory()

    // Save signature as base64
    const signatureData = canvas.toDataURL('image/png')
    onResponse(signatureData)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
    setHistory([])
    setHistoryIndex(-1)
    onResponse('')
  }

  const undo = () => {
    if (historyIndex <= 0) {
      clearSignature()
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const newIndex = historyIndex - 1
    if (newIndex >= 0 && history[newIndex]) {
      ctx.putImageData(history[newIndex], 0, 0)
      setHistoryIndex(newIndex)
      const signatureData = canvas.toDataURL('image/png')
      onResponse(signatureData)
    }
  }

  return (
    <div className="space-y-2">
      <Label>
        {question.text}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Pen className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Sign here</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={!hasSignature || historyIndex <= 0}
            >
              <Undo className="h-4 w-4 mr-1" />
              Undo
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearSignature}
              disabled={!hasSignature}
            >
              <Eraser className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          width={600}
          height={200}
          className="w-full border rounded-lg touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
      </div>
    </div>
  )
}
