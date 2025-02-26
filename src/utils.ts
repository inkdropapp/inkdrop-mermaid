import mermaid, { MermaidConfig, RenderResult } from 'mermaid'
import { useState, useEffect, useRef } from 'react'

// export const useDarkMode = () => {
//   const [isDarkMode, setIsDarkMode] = useState(() => {
//     if (typeof document !== 'undefined' && document.body) {
//       return document.body.classList.contains('dark-mode')
//     }
//     return false
//   })

//   useEffect(() => {
//     if (typeof document === 'undefined' || !document.body) return

//     const body = document.body

//     const observer = new MutationObserver(mutations => {
//       for (const mutation of mutations) {
//         if (
//           mutation.type === 'attributes' &&
//           mutation.attributeName === 'class'
//         ) {
//           setIsDarkMode(body.classList.contains('dark-mode'))
//         }
//       }
//     })

//     observer.observe(body, {
//       attributes: true,
//       attributeFilter: ['class']
//     })

//     return () => observer.disconnect()
//   }, [])

//   return isDarkMode
// }

export const useConfig = () => {
  const [theme, setTheme] = useState<MermaidConfig['theme']>(
    inkdrop.config.get('mermaid.theme') || 'default'
  )

  const [autoScale, setAutoScale] = useState<boolean>(
    inkdrop.config.get('mermaid.autoScale')
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
        diagram.style.display = 'block'
        diagram.style.maxWidth = '100%'

        bindFunctions?.(container)
        setError(null)
      })
      .catch(err => {
        if (!cancelled) {
          setError(err)
        }
      })

    return () => {
      cancelled = true
    }
  }, [id, code, theme, printMode])

  return { error, containerRef }
}
