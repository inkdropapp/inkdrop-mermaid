import type { CodeComponentProps } from '@inkdropapp/types'
import React, { useContext, useMemo } from 'react'

import { getEnv } from './env'
import type { MermaidCommands } from './mermaid-fullscreen'
import { MermaidToolbar } from './mermaid-toolbar'
import { usePanZoom } from './use-panzoom'
import { useConfig, useMermaidRendering } from './utils'

const Mermaid: React.FC<CodeComponentProps> = ({ children }) => {
  const { markdownRenderer, commands } = getEnv()
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
    if (Array.isArray(children) && typeof children[0] === 'string') return children[0]
    return ''
  }, [children])

  const { theme, toolbar, panZoom } = useConfig()
  const { printMode } = useContext(markdownRenderer.Context)
  const { error, containerRef, renderNonce } = useMermaidRendering(id, code, printMode, theme)

  const controls = usePanZoom(containerRef, renderNonce, panZoom && !printMode)

  const openFullscreen = () =>
    commands.dispatch<MermaidCommands>(
      containerRef.current ?? document.body,
      'mermaid:open-fullscreen',
      { code, theme, panZoom }
    )

  return (
    <div className={`mermaid-diagram theme-${theme}`}>
      <div className="mermaid-diagram-content">
        <div ref={containerRef} />
      </div>
      {toolbar && !printMode && (
        <MermaidToolbar
          error={error}
          panZoom={panZoom}
          controls={controls}
          onExpand={openFullscreen}
        />
      )}
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
