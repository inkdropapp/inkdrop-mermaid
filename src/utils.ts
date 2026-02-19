import mermaid, { MermaidConfig, RenderResult } from 'mermaid'
import { useState, useEffect, useRef } from 'react'

export const useConfig = () => {
  const [theme, setTheme] = useState<MermaidConfig['theme']>(
    inkdrop.config.get('mermaid.theme') || 'forest'
  )

  const [autoScale, setAutoScale] = useState<boolean>(
    inkdrop.config.get('mermaid.autoScale') ?? true
  )

  useEffect(() => {
    const themeObserver = inkdrop.config.observe<MermaidConfig['theme']>(
      'mermaid.theme',
      setTheme
    )
    const autoScaleObserver = inkdrop.config.observe<boolean>(
      'mermaid.autoScale',
      setAutoScale
    )
    return () => {
      themeObserver.dispose()
      autoScaleObserver.dispose()
    }
  }, [])

  return { theme, autoScale }
}

let lastInitConfig = ''

const ensureMermaidInitialized = (printMode: boolean) => {
  const theme = printMode
    ? 'default'
    : inkdrop.config.get('mermaid.theme') || 'forest'
  const themeCSS = inkdrop.config.get('mermaid.themeCSS') || ''
  const themeVariablesRaw =
    inkdrop.config.get<string>('mermaid.themeVariables') || '{}'

  const configKey = `${theme}:${themeCSS}:${themeVariablesRaw}:${printMode}`
  if (configKey === lastInitConfig) return

  let themeVariables: Record<string, unknown>
  try {
    themeVariables = JSON.parse(themeVariablesRaw)
  } catch {
    throw new Error(
      `Invalid JSON in 'Custom theme variables' setting: ${themeVariablesRaw}`
    )
  }

  mermaid.initialize({
    startOnLoad: false,
    theme,
    themeCSS,
    themeVariables
  })
  lastInitConfig = configKey
}

const renderDiagram = async (
  id: string,
  code: string,
  printMode: boolean
): Promise<RenderResult> => {
  ensureMermaidInitialized(printMode)
  try {
    return await mermaid.render(id, code)
  } catch (err) {
    if (err instanceof Error) {
      throw err
    }
    throw new Error('Unknown error')
  }
}

export const useMermaidRendering = (
  id: string,
  code: string,
  printMode: boolean,
  theme: MermaidConfig['theme']
) => {
  const [error, setError] = useState<Error | null>(null)

  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!code || !containerRef.current) return
    let cancelled = false
    const container = containerRef.current

    renderDiagram(id, code, printMode)
      .then(({ svg, bindFunctions }) => {
        if (cancelled || !svg.length) return

        // Security note: SVG is sanitised by Mermaid's DOMPurify layer.
        // Keep Mermaid pinned to a known-safe version and audit updates.
        container.innerHTML = svg
        const diagram = container.querySelector<SVGSVGElement>(`#${id}`)
        if (!diagram) return

        diagram.setAttribute('height', '100%')

        bindFunctions?.(container)
        setError(null)
      })
      .catch(err => {
        if (!cancelled) {
          container.innerHTML = ''
          setError(err)
        }
      })

    return () => {
      cancelled = true
    }
  }, [id, code, theme, printMode])

  return { error, containerRef }
}
