import type { ButtonProps, ModalProps } from '@inkdropapp/types'
import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react'

import { getEnv } from './env'

/** Payload of the command that opens the full-screen viewer. */
export interface OpenFullscreenDetail {
  code: string
  panZoom: boolean
}

export type MermaidCommands = {
  'mermaid:open-fullscreen': OpenFullscreenDetail
}

// Lazy-loaded so `mermaid` (pulled in transitively by the stage) stays out of
// the eager entry bundle — the host below imports nothing heavy.
const MermaidFullscreenStage = lazy(() =>
  import('./mermaid-fullscreen-stage').then(m => ({ default: m.MermaidFullscreenStage }))
)

/**
 * Top-level singleton full-screen viewer, registered into the `modal` layout in
 * index.ts. Mounting it at that top-level region (rather than deep in the note
 * preview) is what lets Inkdrop's `Modal` — which positions its overlay
 * `absolute`ly over the window — cover the screen without a React portal.
 *
 * It listens for the `mermaid:open-fullscreen` command, which a diagram's expand
 * button dispatches with that diagram's `code` / `panZoom`, and shows it in the
 * modal. Esc / backdrop / the close button dismiss it.
 */
export const MermaidFullscreen: React.FC = () => {
  const Modal = getEnv().components.getComponentClass<ModalProps>('Modal')!
  const Button = getEnv().components.getComponentClass<ButtonProps>('Button')!
  const [diagram, setDiagram] = useState<OpenFullscreenDetail | null>(null)
  const close = useCallback(() => setDiagram(null), [])

  useEffect(() => {
    const sub = getEnv().commands.add<MermaidCommands>(document.body, {
      'mermaid:open-fullscreen': {
        hiddenInCommandPalette: true,
        didDispatch: e => {
          if (e.detail) setDiagram(e.detail)
        }
      }
    })
    return () => sub.dispose()
  }, [])

  return (
    <Modal
      visible={!!diagram}
      autofocus
      className="mermaid-fullscreen"
      onBackdropClick={close}
      onEscKeyDown={close}
    >
      <div className="mermaid-fullscreen-stage mermaid-diagram">
        {diagram && (
          <Suspense fallback={null}>
            <MermaidFullscreenStage code={diagram.code} panZoom={diagram.panZoom} />
          </Suspense>
        )}
        <Button className="close-button" icon="close" tooltip="Close" onClick={close} />
      </div>
    </Modal>
  )
}

MermaidFullscreen.displayName = 'MermaidFullscreen'
