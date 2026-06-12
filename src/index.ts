import type { ConfigSchema, Environment, IInkdropPlugin } from '@inkdropapp/types'
import { lazy } from 'react'

import { setEnv } from './env'

const Mermaid = lazy(() => import('./Mermaid'))

class InkdropPlugin implements IInkdropPlugin {
  config: Record<string, ConfigSchema> = {
    autoScale: {
      title: 'Auto Scale',
      type: 'boolean',
      description: 'Automatically shrink diagrams to fit window width',
      default: true
    },
    theme: {
      title: 'Theme',
      type: 'string',
      default: 'forest',
      description: 'Mermaid diagram colour theme',
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
  }

  activate(env: Environment) {
    const app = env?.appVersion ? env : inkdrop // backward compatibility for v5
    setEnv(app)
    if (app.markdownRenderer) {
      app.markdownRenderer.remarkCodeComponents.mermaid = Mermaid
    }
  }

  deactivate(env: Environment) {
    const app = env?.appVersion ? env : inkdrop // backward compatibility for v5
    if (app.markdownRenderer) {
      app.markdownRenderer.remarkCodeComponents.mermaid = null
    }
    setEnv(undefined)
  }
}

export default new InkdropPlugin()
