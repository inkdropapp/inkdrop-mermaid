import type { ButtonProps } from '@inkdropapp/types'
import React from 'react'

import { getEnv } from './env'
import { ExpandIcon, ResetIcon, ZoomInIcon, ZoomOutIcon } from './icons'
import type { PanZoomControls } from './use-panzoom'

interface MermaidToolbarProps {
  /** Set when rendering failed; the controls are hidden (nothing to operate). */
  error: Error | null
  /** Resolved `panZoom` flag; the zoom buttons render only when it is on. */
  panZoom: boolean
  /** Imperative zoom controls from `usePanZoom`. */
  controls: PanZoomControls
  /** When set, show an Expand button that opens the full-screen viewer. */
  onExpand?: () => void
}

/**
 * Floating controls overlaid on a rendered diagram, hidden until the diagram is
 * hovered (the fade-in lives in styles/mermaid.css).
 *
 * It renders as a sibling of `.mermaid-diagram-content` (the pan/zoom owner) —
 * never inside it — so panzoom, which binds its gesture listeners on that
 * content wrapper, never receives the toolbar's pointer events. The buttons are
 * Inkdrop's `Button` component (resolved through the captured env, not the
 * global `inkdrop`), rendered `bare` so the dark-pill styling applies instead of
 * the default `ui button` look.
 *
 * The zoom buttons appear only when pan/zoom is enabled; `onExpand` adds an
 * expand button (inline view). Renders nothing without a `Button` class, on
 * error, or when there is no button to show.
 */
export const MermaidToolbar: React.FC<MermaidToolbarProps> = ({
  error,
  panZoom,
  controls,
  onExpand
}) => {
  const Button = getEnv().components.getComponentClass<ButtonProps>('Button')
  if (error || !Button) return null
  if (!panZoom && !onExpand) return null

  return (
    <div className="mermaid-toolbar">
      <div className="mermaid-toolbar-controls">
        {panZoom && (
          <>
            <Button bare aria-label="Zoom in" tooltip="Zoom in" onClick={controls.zoomIn}>
              <ZoomInIcon />
            </Button>
            <Button bare aria-label="Reset zoom" tooltip="Reset zoom" onClick={controls.reset}>
              <ResetIcon />
            </Button>
            <Button bare aria-label="Zoom out" tooltip="Zoom out" onClick={controls.zoomOut}>
              <ZoomOutIcon />
            </Button>
          </>
        )}
        {onExpand && (
          <Button bare aria-label="Full screen" tooltip="Full screen" onClick={onExpand}>
            <ExpandIcon />
          </Button>
        )}
      </div>
    </div>
  )
}

MermaidToolbar.displayName = 'MermaidToolbar'
