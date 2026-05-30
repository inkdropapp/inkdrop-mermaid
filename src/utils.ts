import mermaid, { MermaidConfig, RenderResult } from 'mermaid'
import { useState, useEffect, useRef } from 'react'
import { getEnv } from './env'

export const useConfig = () => {
  const { config } = getEnv()

  const [theme, setTheme] = useState<MermaidConfig['theme']>(
    config.get('mermaid.theme')
  )
  const [autoScale, setAutoScale] = useState<boolean>(
    config.get('mermaid.autoScale')
  )

  useEffect(() => {
    const themeObserver = config.observe('mermaid.theme', setTheme)
    const autoScaleObserver = config.observe('mermaid.autoScale', setAutoScale)
    return () => {
      themeObserver.dispose()
      autoScaleObserver.dispose()
    }
  }, [])

  return { theme, autoScale }
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
