import mermaid, { MermaidConfig, RenderResult } from 'mermaid'
import { useState, useEffect, useRef } from 'react'

import { getEnv } from './env'

export const useConfig = () => {
  const { config } = getEnv()

  const [theme, setTheme] = useState<MermaidConfig['theme']>(config.get('mermaid.theme'))
  const [autoScale, setAutoScale] = useState<boolean>(config.get('mermaid.autoScale'))
  const [toolbar, setToolbar] = useState<boolean>(config.get('mermaid.toolbar'))
  const [panZoom, setPanZoom] = useState<boolean>(config.get('mermaid.panZoom'))

  useEffect(() => {
    const themeObserver = config.observe('mermaid.theme', setTheme)
    const autoScaleObserver = config.observe('mermaid.autoScale', setAutoScale)
    const toolbarObserver = config.observe('mermaid.toolbar', setToolbar)
    const panZoomObserver = config.observe('mermaid.panZoom', setPanZoom)
    return () => {
      themeObserver.dispose()
      autoScaleObserver.dispose()
      toolbarObserver.dispose()
      panZoomObserver.dispose()
    }
  }, [config])

  return { theme, autoScale, toolbar, panZoom }
}

const renderDiagram = async (
  id: string,
  code: string,
  printMode: boolean
): Promise<RenderResult> => {
  const { config } = getEnv()
  mermaid.initialize({
    startOnLoad: false,
    suppressErrorRendering: true,
    theme: printMode ? 'default' : config.get('mermaid.theme'),
    themeCSS: config.get('mermaid.themeCSS'),
    themeVariables: JSON.parse(config.get('mermaid.themeVariables') || '{}')
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

export const useMermaidRendering = (
  id: string,
  code: string,
  printMode: boolean,
  theme: MermaidConfig['theme']
) => {
  const [error, setError] = useState<Error | null>(null)
  const [diagramType, setDiagramType] = useState<string | null>(null)
  // Bumped after every successful render so downstream hooks (e.g. pan/zoom)
  // can re-attach to the freshly injected SVG without diffing the DOM.
  const [renderNonce, setRenderNonce] = useState(0)

  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!code || !containerRef.current) return
    let cancelled = false
    const container = containerRef.current

    renderDiagram(id, code, printMode)
      .then(({ svg, bindFunctions, diagramType: type }) => {
        if (cancelled || !svg.length) return

        container.innerHTML = svg
        const diagram = container.querySelector<SVGSVGElement>(`#${id}`)
        if (!diagram) return

        diagram.setAttribute('height', '100%')

        bindFunctions?.(container)
        setDiagramType(type)
        setError(null)
        setRenderNonce(nonce => nonce + 1)
      })
      .catch(err => {
        if (!cancelled) {
          container.innerHTML = ''
          setDiagramType(null)
          setError(err)
        }
      })

    return () => {
      cancelled = true
      container.innerHTML = ''
      document.querySelectorAll('body > div.mermaidTooltip').forEach(el => el.remove())
    }
  }, [id, code, theme, printMode])

  return { error, containerRef, diagramType, renderNonce }
}
