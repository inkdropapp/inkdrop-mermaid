import { lazy, Suspense, createElement } from 'react'
import { markdownRenderer } from 'inkdrop'

const MermaidLazy = lazy(() => import('./Mermaid'))

const Mermaid = (props: CodeComponentProps) =>
  createElement(Suspense, { fallback: null }, createElement(MermaidLazy, props))

export default {
  config: {
    autoScale: {
      title: 'Auto Scale',
      type: 'boolean',
      description: 'Automatically shrink diagrams to fit window width',
      default: true
    },
    theme: {
      title: 'Theme',
      type: 'string',
      description: 'Mermaid diagram colour theme',
      default: 'forest',
      enum: ['forest', 'default', 'neutral', 'dark', 'base']
    },
    themeCSS: {
      title: 'Custom theme CSS',
      type: 'string',
      default: '',
      description: 'Example: text { font-size: 30px !important; }'
    },
    themeVariables: {
      title: 'Custom theme variables (JSON)',
      type: 'string',
      description: 'Example: { "primaryColor": "#ff0000" }',
      default: '{}'
    }
  },
  activate() {
    if (markdownRenderer) {
      markdownRenderer.remarkCodeComponents.mermaid = Mermaid
    }
  },
  deactivate() {
    if (markdownRenderer) {
      markdownRenderer.remarkCodeComponents.mermaid = null
    }
  }
} satisfies Inkdrop.Plugin
