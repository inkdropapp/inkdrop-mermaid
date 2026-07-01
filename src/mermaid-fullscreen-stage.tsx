import React, { useMemo } from 'react'

import { MermaidToolbar } from './mermaid-toolbar'
import { usePanZoom } from './use-panzoom'
import { useMermaidRendering } from './utils'

interface MermaidFullscreenStageProps {
  /** The diagram source; re-rendered at a fresh id. */
  code: string
  /** Resolved `panZoom` flag, mirrored from the inline view. */
  panZoom: boolean
}

/**
 * The heavy half of the full-screen viewer: a second, independent copy of the
 * diagram with its own `mermaid.render` + pan/zoom instance.
 *
 * Lazy-loaded by {@link MermaidFullscreen} so `mermaid` stays out of the eager
 * entry bundle — the host (registered at startup) imports nothing heavy.
 */
export const MermaidFullscreenStage: React.FC<MermaidFullscreenStageProps> = ({
  code,
  panZoom
}) => {
  const id = useMemo(
    () =>
      `mermaid-fs-${Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substring(0, 5)}`,
    []
  )
  const { error, containerRef, renderNonce } = useMermaidRendering(id, code, false)
  const controls = usePanZoom(containerRef, renderNonce, panZoom)

  return (
    <>
      <div className="mermaid-diagram-content">
        <div ref={containerRef} />
      </div>
      <MermaidToolbar error={error} panZoom={panZoom} controls={controls} />
      {error && (
        <div className="ui error message">
          <div className="header">Failed to render Mermaid</div>
          <div>
            <pre>{error.message}</pre>
          </div>
        </div>
      )}
    </>
  )
}

MermaidFullscreenStage.displayName = 'MermaidFullscreenStage'
