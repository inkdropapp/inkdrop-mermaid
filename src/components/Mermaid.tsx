import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { MermaidConfig, RenderResult } from 'mermaid'
import mermaid from 'mermaid'
import SvgPanZoom from 'svg-pan-zoom'

import MermaidControl from './MermaidControl'
import { useDarkMode } from '../utils'

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

const Mermaid: React.FC<CodeComponentProps> = ({ children }) => {
  const id = useMemo(
    () =>
      `mermaid-${Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substring(0, 5)}`,
    []
  )

  const observerTheme = useRef<Disposable | null>(null)
  const observerPanZoom = useRef<Disposable | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const parentRef = useRef<HTMLDivElement | null>(null)

  const [theme, setTheme] = useState<MermaidConfig['theme']>(
    inkdrop.config.get('mermaid.theme') || 'default'
  )
  const [type, setType] = useState<string>('')
  const { printMode } = useContext(inkdrop.markdownRenderer.Context)
  const [panZoomMode, setPanZoomMode] = useState<boolean>(
    inkdrop.config.get('mermaid.panZoom')
  )
  const [panZoomInstance, setPanZoomInstance] = useState<ReturnType<
    typeof SvgPanZoom
  > | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const isDarkMode = useDarkMode()

  useEffect(() => {
    observerTheme.current = inkdrop.config.observe<MermaidConfig['theme']>(
      'mermaid.theme',
      theme => setTheme(theme)
    )

    observerPanZoom.current = inkdrop.config.observe<boolean>(
      'mermaid.panZoom',
      panZoom => setPanZoomMode(panZoom)
    )

    return () => {
      observerTheme.current?.dispose()
      observerPanZoom.current?.dispose()
    }
  }, [])

  useEffect(() => {
    if (!parentRef.current && printMode) return

    const preElement = parentRef.current?.parentElement
    if (!preElement) return

    if (isDarkMode) {
      preElement.setAttribute('data-mermaid-theme', 'dark')
    } else {
      preElement.setAttribute('data-mermaid-theme', 'light')
    }
  }, [isDarkMode])

  useEffect(() => {
    const code =
      typeof children === 'string'
        ? children
        : Array.isArray(children) && typeof children[0] === 'string'
          ? children[0]
          : ''

    if (!code || !containerRef.current) return

    let cancelled = false
    let resizeObserver: ResizeObserver | null = null

    const container = containerRef.current
    const parrent = parentRef.current
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
          const parentWidth = parrent?.clientWidth || container.clientWidth
          container.style.width = `${parentWidth}px`
          container.style.height = `${Math.ceil(parentWidth * (vbHeight / vbWidth))}px`
        }

        recalcDimensions()
        resizeObserver = new ResizeObserver(recalcDimensions)
        resizeObserver.observe(container.parentElement!)

        if (panZoomMode && !printMode) {
          setPanZoomInstance(
            SvgPanZoom(diagram, {
              zoomEnabled: true,
              mouseWheelZoomEnabled: false
            })
          )
        }

        setType(diagramType)
        setError(null)
      })
      .catch(err => !cancelled && setError(err))

    return () => {
      cancelled = true
      resizeObserver?.disconnect()
    }
  }, [children, theme, printMode, panZoomMode])

  useEffect(() => {
    if (!panZoomInstance || !containerRef.current) return

    const resizeObserver = new ResizeObserver(() => {
      panZoomInstance.resize()
      panZoomInstance.contain()
      panZoomInstance.fit()
    })

    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [panZoomInstance])

  const handleZoomIn = () => {
    panZoomInstance?.zoomIn()
  }

  const handleZoomOut = () => {
    panZoomInstance?.zoomOut()
  }

  const handleReset = () => {
    panZoomInstance?.reset()
  }

  return (
    <div className="mermaid-diagram" ref={parentRef}>
      {!printMode && (
        <MermaidControl
          type={type}
          error={error}
          panZoom={panZoomMode}
          onReset={handleReset}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
        />
      )}
      <div ref={containerRef} />
      {error && (
        <div className="ui error message">
          <div className="header">Failed to render Mermaid</div>
          <div>
            <pre>{error.message}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

Mermaid.displayName = 'Mermaid'

export default Mermaid
