import React, { useContext, useMemo } from 'react'
import { useConfig, useMermaidRendering } from './utils'

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

  const { theme, autoScale } = useConfig()

  const { printMode } = useContext(inkdrop.markdownRenderer.Context)

  const { error, containerRef } = useMermaidRendering(
    id,
    code,
    printMode,
    theme
  )

  return (
    <div
      className={`mermaid-diagram theme-${theme} ${autoScale ? '' : 'disable-auto-scale'}`}
    >
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
