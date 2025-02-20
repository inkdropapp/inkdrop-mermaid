import { lazy } from 'react'
import { markdownRenderer } from 'inkdrop'

const Mermaid = lazy(() => import('./components/Mermaid'))

export default {
  config: {
    additionalUI: {
      title: 'Additional UI',
      type: 'boolean',
      description: 'Additional UI for the Mermaid diagram',
      default: true
    },
    panZoom: {
      title: 'Pan/Zoom mode',
      type: 'boolean',
      description: 'Pan and Zoom mode for the Mermaid diagram',
      default: false
    },
    theme: {
      title: 'Theme',
      type: 'string',
      default: 'forest',
      enum: ['forest', 'default', 'neutral', 'dark', 'base', 'null']
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
