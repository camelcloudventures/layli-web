"use client"

import { useState, useRef, useEffect } from "react"

type TooltipPosition = "right" | "top" | "left" | "bottom"

interface TooltipProps {
  text: string
  position?: TooltipPosition
}

export default function Tooltip({ text, position = "right" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>(position)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768)
      checkPosition()
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const checkPosition = () => {
    if (isMobileView || !containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const tooltipWidth = 420 // Maximum tooltip width from our classes

    // Check if there's enough space on the right
    const spaceOnRight = viewportWidth - containerRect.right
    const spaceOnLeft = containerRect.left

    // Determine the best position based on available space
    if (position === 'right' && spaceOnRight < tooltipWidth + 40) { // 40px buffer
      setTooltipPosition('left')
    } else if (position === 'left' && spaceOnLeft < tooltipWidth + 40) {
      setTooltipPosition('right')
    } else {
      setTooltipPosition(position)
    }
  }

  useEffect(() => {
    if (!isVisible || isMobileView) return

    const handleMouseMove = () => {
      checkPosition()
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [isVisible, isMobileView, position])

  useEffect(() => {
    if (!isMobileView) return

    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsVisible(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobileView])

  const getPositionClasses = (pos: TooltipPosition): string => {
    if (isMobileView) {
      return ""
    }
    
    switch (pos) {
      case "right":
        return "left-6 top-1/2 -translate-y-1/2"
      case "left":
        return "right-6 top-1/2 -translate-y-1/2"
      case "top":
        return "bottom-6 left-1/2 -translate-x-1/2"
      case "bottom":
        return "top-6 left-1/2 -translate-x-1/2"
      default:
        return "left-6 top-1/2 -translate-y-1/2"
    }
  }

  const handleInteraction = (event: React.MouseEvent | React.TouchEvent) => {
    if (isMobileView) {
      event.preventDefault()
      setIsVisible(!isVisible)
    }
  }

  const handleMouseEnter = () => {
    if (!isMobileView) {
      checkPosition()
      setIsVisible(true)
    }
  }

  return (
    <div className="relative inline-flex items-center h-full" ref={containerRef}>
      <span
        className="inline-flex items-center text-muted-foreground cursor-help"
        onClick={handleInteraction}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => !isMobileView && setIsVisible(false)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="21"
          fill="currentColor"
          className="bi bi-question-circle"
          viewBox="0 0 16 16"
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
          <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94" />
        </svg>
      </span>
      {isVisible && (
        <>
          {isMobileView && (
            <div 
              className="fixed inset-0 bg-black/50 z-40" 
              onClick={() => setIsVisible(false)}
            />
          )}
          
          <div
            ref={contentRef}
            className={`
              ${isMobileView
                ? "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm z-50 bg-white dark:bg-gray-800"
                : "absolute bg-gray-200 dark:bg-gray-600 min-w-[300px] md:min-w-[400px] lg:min-w-[420px]"
              }
              m-1 px-4 py-3 text-sm font-normal text-gray-700 dark:text-gray-100 
              border border-gray-300 dark:border-gray-500 rounded-lg shadow-lg
              transition-opacity duration-300 ease-in-out opacity-100
              ${!isMobileView && getPositionClasses(tooltipPosition)}
            `}
          >
            {isMobileView ? (
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">{text}</div>
                <div 
                  onClick={() => setIsVisible(false)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setIsVisible(false)}
                  className="flex-shrink-0 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
              </div>
            ) : (
              text
            )}
          </div>
        </>
      )}
    </div>
  )
}

