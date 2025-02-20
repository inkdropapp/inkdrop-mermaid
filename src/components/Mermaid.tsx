import React, { useContext, useEffect, useMemo } from 'react'
import MermaidControl from './MermaidControl'
import { useDarkMode, useInkdropConfig, useMermaidRendering } from '../utils'

const Mermaid: React.FC<CodeComponentProps> = ({ children }) => {
  const id = useMemo(
    () =>
      `mermaid-${Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substring(0, 5)}`,
    []
  )

  const code = useMemo(() => {
    if (typeof children === 'string') return children
    if (Array.isArray(children) && typeof children[0] === 'string')
      return children[0]
    return ''
  }, [children])

  const { theme, panZoomMode, additionalUI } = useInkdropConfig()

  const { printMode } = useContext(inkdrop.markdownRenderer.Context)
  const isDarkMode = useDarkMode()

  const { error, diagramType, containerRef, parentRef, panZoomInstance } =
    useMermaidRendering(id, code, printMode, panZoomMode, additionalUI, theme)

  useEffect(() => {
    if (!parentRef.current) return
    const preElement = parentRef.current.parentElement
    if (!preElement && !printMode) return
    preElement?.setAttribute(
      'data-mermaid-theme',
      isDarkMode ? 'dark' : 'light'
    )
  }, [isDarkMode, printMode])

  useEffect(() => {
    if (parentRef.current) {
      parentRef.current.style.paddingTop =
        additionalUI && !printMode ? '40px' : '0'
    }
  }, [additionalUI, printMode])

  const handleZoomIn = () => panZoomInstance?.zoomIn()
  const handleZoomOut = () => panZoomInstance?.zoomOut()
  const handleReset = () => panZoomInstance?.reset()

  return (
    <div className="mermaid-diagram" ref={parentRef}>
      {!printMode && additionalUI && (
        <MermaidControl
          type={diagramType}
          error={error}
          panZoom={panZoomMode}
          onReset={handleReset}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
        />
      )}
      <div ref={containerRef} />
      {error && (
        <div className="ui error message">
          <div className="header">Failed to render Mermaid</div>
          <div>
            <pre>{error.message}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

Mermaid.displayName = 'Mermaid'

export default Mermaid
