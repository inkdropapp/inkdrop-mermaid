import mermaid, { MermaidConfig, RenderResult } from 'mermaid'
import SvgPanZoom from 'svg-pan-zoom'
import { useState, useEffect, useRef } from 'react'

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof document !== 'undefined' && document.body) {
      return document.body.classList.contains('dark-mode')
    }
    return false
  })

  useEffect(() => {
    if (typeof document === 'undefined' || !document.body) return

    const body = document.body

    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          setIsDarkMode(body.classList.contains('dark-mode'))
        }
      }
    })

    observer.observe(body, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  return isDarkMode
}

export const useInkdropConfig = () => {
  const [theme, setTheme] = useState<MermaidConfig['theme']>(
    inkdrop.config.get('mermaid.theme') || 'default'
  )
  const [panZoomMode, setPanZoomMode] = useState<boolean>(
    inkdrop.config.get('mermaid.panZoom')
  )
  const [additionalUI, setAdditionalUI] = useState<boolean>(
    inkdrop.config.get('mermaid.additionalUI')
  )

  useEffect(() => {
    const themeObserver = inkdrop.config.observe<MermaidConfig['theme']>(
      'mermaid.theme',
      setTheme
    )
    const panZoomObserver = inkdrop.config.observe<boolean>(
      'mermaid.panZoom',
      setPanZoomMode
    )
    const uiObserver = inkdrop.config.observe<boolean>(
      'mermaid.additionalUI',
      setAdditionalUI
    )
    return () => {
      themeObserver.dispose()
      panZoomObserver.dispose()
      uiObserver.dispose()
    }
  }, [])

  return { theme, panZoomMode, additionalUI }
}

const renderDiagram = async (
  id: string,
  code: string,
  printMode: boolean
): Promise<RenderResult> => {
  mermaid.initialize({
    startOnLoad: false,
    theme: printMode ? 'default' : inkdrop.config.get('mermaid.theme'),
    themeCSS: inkdrop.config.get('mermaid.themeCSS'),
    themeVariables: JSON.parse(
      inkdrop.config.get<string>('mermaid.themeVariables') || '{}'
    )
  })
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
  panZoomMode: boolean,
  additionalUI: boolean,
  theme: MermaidConfig['theme']
) => {
  const [error, setError] = useState<Error | null>(null)
  const [diagramType, setDiagramType] = useState<string>('')
  const [panZoomInstance, setPanZoomInstance] = useState<ReturnType<
    typeof SvgPanZoom
  > | null>(null)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const parentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!code || !containerRef.current) return
    let cancelled = false
    let resizeObserver: ResizeObserver | null = null
    const container = containerRef.current
    const parent = parentRef.current

    renderDiagram(id, code, printMode)
      .then(({ svg, diagramType, bindFunctions }) => {
        if (cancelled || !svg.length) return

        container.innerHTML = svg
        const diagram = container.querySelector<SVGSVGElement>(`#${id}`)
        if (!diagram) return

        const viewBox = diagram.getAttribute('viewBox')
        if (!viewBox) return
        const [, , vbWidth, vbHeight] = viewBox
          .trim()
          .split(/[\s,]+/)
          .map(parseFloat)
        if ([vbWidth, vbHeight].some(isNaN)) return

        diagram.setAttribute('height', '100%')
        diagram.style.display = 'block'
        diagram.style.maxWidth = '100%'

        bindFunctions?.(container)

        const recalcDimensions = () => {
          const parentWidth = parent?.clientWidth || container.clientWidth
          container.style.width = `${parentWidth}px`
          container.style.height = `${Math.ceil(parentWidth * (vbHeight / vbWidth))}px`
        }

        recalcDimensions()
        resizeObserver = new ResizeObserver(recalcDimensions)
        resizeObserver.observe(container.parentElement!)

        if (panZoomMode && !printMode && additionalUI) {
          setPanZoomInstance(
            SvgPanZoom(diagram, {
              zoomEnabled: true,
              mouseWheelZoomEnabled: false
            })
          )
        }

        setDiagramType(diagramType)
        setError(null)
      })
      .catch(err => {
        if (!cancelled) {
          setError(err)
        }
      })

    return () => {
      cancelled = true
      resizeObserver?.disconnect()
    }
  }, [id, code, theme, printMode, panZoomMode, additionalUI])

  useEffect(() => {
    if (!panZoomInstance || !containerRef.current) return
    const resizeObserver = new ResizeObserver(() => {
      panZoomInstance.resize()
      panZoomInstance.center()
      panZoomInstance.fit()
    })
    resizeObserver.observe(containerRef.current)
    return () => {
      resizeObserver.disconnect()
    }
  }, [panZoomInstance])

  return { error, diagramType, containerRef, parentRef, panZoomInstance }
}
