import type { ButtonProps } from '@inkdropapp/types'
import React from 'react'

import { getEnv } from './env'
import { ResetIcon, ZoomInIcon, ZoomOutIcon } from './icons'
import type { PanZoomControls } from './use-panzoom'

interface MermaidToolbarProps {
  /** Set when rendering failed; the controls are hidden (nothing to zoom). */
  error: Error | null
  /** Resolved `panZoom` flag; the controls render only when it is on. */
  panZoom: boolean
  /** Imperative zoom controls from `usePanZoom`. */
  controls: PanZoomControls
}

/**
 * Floating zoom controls (zoom-in / reset / zoom-out) overlaid on a rendered
 * diagram, hidden until the diagram is hovered (the fade-in lives in
 * styles/mermaid.css).
 */
export const MermaidToolbar: React.FC<MermaidToolbarProps> = ({ error, panZoom, controls }) => {
  const Button = getEnv().components.getComponentClass<ButtonProps>('Button')
  if (error || !panZoom || !Button) return null

  return (
    <div className="mermaid-toolbar">
      <div className="mermaid-toolbar-controls">
        <Button bare aria-label="Zoom in" tooltip="Zoom in" onClick={controls.zoomIn}>
          <ZoomInIcon />
        </Button>
        <Button bare aria-label="Reset zoom" tooltip="Reset zoom" onClick={controls.reset}>
          <ResetIcon />
        </Button>
        <Button bare aria-label="Zoom out" tooltip="Zoom out" onClick={controls.zoomOut}>
          <ZoomOutIcon />
        </Button>
      </div>
    </div>
  )
}

MermaidToolbar.displayName = 'MermaidToolbar'
