import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Eraser, PenTool, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface SignatureCanvasHandle {
  clear: () => void
  isEmpty: () => boolean
  toDataURL: () => string
}

interface SignaturePadProps {
  onStrokeChange?: (hasDrawn: boolean) => void
  disabled?: boolean
}

export const SignaturePad = forwardRef<SignatureCanvasHandle, SignaturePadProps>(
  ({ onStrokeChange, disabled = false }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [hasDrawn, setHasDrawn] = useState(false)

    useImperativeHandle(ref, () => ({
      clear: () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        setHasDrawn(false)
        onStrokeChange?.(false)
      },
      isEmpty: () => !hasDrawn,
      toDataURL: () => {
        const canvas = canvasRef.current
        if (!canvas || !hasDrawn) return ''
        return canvas.toDataURL('image/png')
      },
    }))

    const getCanvasCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return { x: 0, y: 0 }
      const rect = canvas.getBoundingClientRect()
      const scaleX = canvas.width / rect.width
      const scaleY = canvas.height / rect.height

      let clientX = 0
      let clientY = 0

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else if ('clientX' in e) {
        clientX = e.clientX
        clientY = e.clientY
      }

      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      }
    }

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
      if (disabled) return
      e.preventDefault()
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const coords = getCanvasCoordinates(e)
      ctx.beginPath()
      ctx.moveTo(coords.x, coords.y)
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.strokeStyle = '#002B49'
      setIsDrawing(true)
    }

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing || disabled) return
      e.preventDefault()
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const coords = getCanvasCoordinates(e)
      ctx.lineTo(coords.x, coords.y)
      ctx.stroke()
      if (!hasDrawn) {
        setHasDrawn(true)
        onStrokeChange?.(true)
      }
    }

    const stopDrawing = () => {
      if (!isDrawing) return
      setIsDrawing(false)
    }

    const handleClear = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setHasDrawn(false)
      onStrokeChange?.(false)
    }

    return (
      <div className="space-y-2">
        <div className="relative border-2 border-dashed border-slate-300 rounded-lg bg-white overflow-hidden shadow-inner touch-none">
          <canvas
            ref={canvasRef}
            width={600}
            height={180}
            className="w-full h-36 cursor-crosshair bg-slate-50/50"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          {!hasDrawn && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-400 text-xs gap-1.5 select-none">
              <PenTool className="h-4 w-4" />
              <span>Desenhe sua assinatura nesta área</span>
            </div>
          )}
          <div className="absolute bottom-1 right-2 pointer-events-none text-[10px] text-slate-300 font-mono select-none">
            Área de rubrica / firma
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Rubrica manual capturada via tela</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={!hasDrawn || disabled}
            className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
          >
            <Eraser className="h-3.5 w-3.5 mr-1" />
            Limpar traço
          </Button>
        </div>
      </div>
    )
  },
)

SignaturePad.displayName = 'SignaturePad'
