import mermaid, { RenderResult } from 'mermaid'
import { useState, useEffect, useRef } from 'react'

import { getEnv } from './env'
import { buildInkdropThemeVariables } from './theme'

export const useConfig = () => {
  const { config } = getEnv()

  const [toolbar, setToolbar] = useState<boolean>(config.get('mermaid.toolbar'))
  const [panZoom, setPanZoom] = useState<boolean>(config.get('mermaid.panZoom'))

  useEffect(() => {
    const toolbarObserver = config.observe('mermaid.toolbar', setToolbar)
    const panZoomObserver = config.observe('mermaid.panZoom', setPanZoom)
    return () => {
      toolbarObserver.dispose()
      panZoomObserver.dispose()
    }
  }, [config])

  return { toolbar, panZoom }
}

/**
 * Resolve Mermaid's `themeVariables` from Inkdrop's `--mermaid-*` CSS variables.
 *
 * We can't read the custom properties directly: their values are `light-dark()`
 * / nested `var()` expressions that only collapse to a colour when *used*. So we
 * assign each `var(--mermaid-<token>)` to a throwaway probe's `color` and read
 * the browser-computed `rgb(...)` back — exactly the colour the active theme
 * paints, light/dark included. Passing concrete colours (not `var()`) is what
 * lets Mermaid's `base` theme run them through khroma without crashing.
 *
 * Resolving per render means a diagram picks up the theme active when it renders.
 *
 * @param forceLightMode - Pin the probe to `color-scheme: light` so every
 *   `light-dark()` resolves to its light branch regardless of the app theme.
 *   Used for print/export, where diagrams should render for white paper.
 */
const resolveInkdropThemeVariables = (forceLightMode: boolean) => {
  const probe = document.createElement('span')
  probe.style.cssText = 'position:absolute;width:0;height:0;visibility:hidden;pointer-events:none'
  if (forceLightMode) probe.style.colorScheme = 'light'
  document.body.appendChild(probe)
  try {
    return buildInkdropThemeVariables(token => {
      probe.style.color = `var(--mermaid-${token})`
      return getComputedStyle(probe).color
    })
  } finally {
    probe.remove()
  }
}

const renderDiagram = async (
  id: string,
  code: string,
  printMode: boolean
): Promise<RenderResult> => {
  mermaid.initialize({
    startOnLoad: false,
    suppressErrorRendering: true,
    theme: 'base',
    themeVariables: resolveInkdropThemeVariables(printMode)
  })
  try {
    return await mermaid.render(id, code)
  } catch (err) {
    if (err instanceof Error) {
      throw err
    }
    throw new Error('Unknown error', { cause: err })
  }
}

export const useMermaidRendering = (id: string, code: string, printMode: boolean) => {
  const [error, setError] = useState<Error | null>(null)
  // Bumped after every successful render so downstream hooks (e.g. pan/zoom)
  // can re-attach to the freshly injected SVG without diffing the DOM.
  const [renderNonce, setRenderNonce] = useState(0)

  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!code || !containerRef.current) return
    let cancelled = false
    const container = containerRef.current

    renderDiagram(id, code, printMode)
      .then(({ svg, bindFunctions }) => {
        if (cancelled || !svg.length) return

        container.innerHTML = svg
        const diagram = container.querySelector<SVGSVGElement>(`#${id}`)
        if (!diagram) return

        bindFunctions?.(container)
        setError(null)
        setRenderNonce(nonce => nonce + 1)
      })
      .catch(err => {
        if (!cancelled) {
          container.innerHTML = ''
          setError(err)
        }
      })

    return () => {
      cancelled = true
      container.innerHTML = ''
      document.querySelectorAll('body > div.mermaidTooltip').forEach(el => el.remove())
    }
  }, [id, code, printMode])

  return { error, containerRef, renderNonce }
}
