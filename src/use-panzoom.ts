import panzoom, { type PanZoom, type Transform } from 'panzoom'
import { type RefObject, useCallback, useEffect, useRef } from 'react'

const MIN_ZOOM = 0.2
const MAX_ZOOM = 8
const ZOOM_STEP = 1.4
const BOUNDS_PADDING = 0.15

export interface PanZoomControls {
  zoomIn: () => void
  zoomOut: () => void
  reset: () => void
}

/** True once the element has real layout size — never pan/zoom a 0×0 node. */
const hasSize = (el: Element): boolean => {
  const { width, height } = el.getBoundingClientRect()
  return width > 0 && height > 0
}

/**
 * Attach a gesture pan/zoom for a rendered Mermaid diagram.
 *
 * @param containerRef - Div holding the injected Mermaid SVG (the pan/zoom scene).
 * @param renderNonce - Bumped by `useMermaidRendering` after each render.
 * @param enabled - Resolved `panZoom` flag; when false the hook is inert.
 * @returns Imperative `zoomIn` / `zoomOut` / `reset` controls for the toolbar.
 */
export const usePanZoom = (
  containerRef: RefObject<HTMLDivElement | null>,
  renderNonce: number,
  enabled: boolean
): PanZoomControls => {
  const instanceRef = useRef<PanZoom | null>(null)
  // The transform captured right after init (identity in DOM mode), restored by reset().
  const initialRef = useRef<Transform | null>(null)

  useEffect(() => {
    if (!enabled) return
    const container = containerRef.current
    if (!container || !container.parentElement || !container.querySelector('svg')) return

    let observer: IntersectionObserver | null = null

    const init = () => {
      if (instanceRef.current || !hasSize(container)) return
      const instance = panzoom(container, {
        minZoom: MIN_ZOOM,
        maxZoom: MAX_ZOOM,
        // Keep at least BOUNDS_PADDING of the diagram within the viewport so it
        // can't be panned or zoomed entirely out of view.
        bounds: true,
        boundsPadding: BOUNDS_PADDING,
        // Plain wheel scrolls the note; only Ctrl/Cmd + wheel zooms the diagram.
        beforeWheel: e => !e.ctrlKey && !e.metaKey,
        // Ctrl/Cmd + mouse-down selects diagram text instead of panning.
        beforeMouseDown: e => e.ctrlKey || e.metaKey
      })
      instanceRef.current = instance
      const { x, y, scale } = instance.getTransform()
      initialRef.current = { x, y, scale }
      observer?.disconnect()
      observer = null
    }

    // Init immediately if visible; otherwise wait until the pane gains size.
    init()
    if (!instanceRef.current) {
      observer = new IntersectionObserver(() => init())
      observer.observe(container)
    }

    return () => {
      observer?.disconnect()
      instanceRef.current?.dispose()
      instanceRef.current = null
      initialRef.current = null
      // panzoom leaves its last CSS transform on the div; clear it so the next
      // render (which reuses this element) starts from the natural position.
      container.style.transform = ''
      container.style.transformOrigin = ''
    }
  }, [containerRef, renderNonce, enabled])

  /**
   * Runs `fn` only when a live instance is attached to a visible, sized
   * container. `viewport` is panzoom's owner (the container's parent); its
   * centre is the zoom anchor, so toolbar zoom keeps the view centred.
   */
  const run = useCallback(
    (fn: (instance: PanZoom, viewport: HTMLElement) => void) => {
      const instance = instanceRef.current
      const container = containerRef.current
      const viewport = container?.parentElement
      if (!instance || !container || !viewport || !hasSize(container)) return
      fn(instance, viewport)
    },
    [containerRef]
  )

  const zoomIn = useCallback(
    () =>
      run((instance, viewport) => {
        const { width, height } = viewport.getBoundingClientRect()
        instance.smoothZoom(width / 2, height / 2, ZOOM_STEP)
      }),
    [run]
  )

  const zoomOut = useCallback(
    () =>
      run((instance, viewport) => {
        const { width, height } = viewport.getBoundingClientRect()
        instance.smoothZoom(width / 2, height / 2, 1 / ZOOM_STEP)
      }),
    [run]
  )

  const reset = useCallback(
    () =>
      run(instance => {
        const initial = initialRef.current
        if (!initial) return
        // Restore the natural (identity) transform captured at init — no fit().
        instance.zoomAbs(0, 0, initial.scale)
        instance.moveTo(initial.x, initial.y)
      }),
    [run]
  )

  return { zoomIn, zoomOut, reset }
}
