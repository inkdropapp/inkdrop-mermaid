import { useState, useEffect } from 'react'

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
