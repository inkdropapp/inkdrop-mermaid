'use babel'

const { lazy } = require('react')
const { markdownRenderer } = require('inkdrop')

function initMermaid() {
  const { mermaidAPI } = require('mermaid/dist/mermaid.js')
  mermaidAPI.initialize({
    startOnLoad: false,
    theme: inkdrop.config.get('mermaid.theme'),
    themeCSS: inkdrop.config.get('mermaid.themeCSS'),
    themeVariables: JSON.parse(
      inkdrop.config.get('mermaid.themeVariables') || '{}'
    )
  })
}

const Mermaid = lazy(() => {
  initMermaid()
  return Promise.resolve(require('./mermaid'))
})

module.exports = {
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
      default: 'forest',
      enum: ['default', 'forest', 'neutral', 'dark']
    },
    themeCSS: {
      title: 'Custom theme CSS',
      type: 'string',
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
    let isFirstCall = true
    this.subs = inkdrop.config.observe('mermaid.theme', () => {
      if (isFirstCall) isFirstCall = false
      else initMermaid()
    })

    if (markdownRenderer) {
      markdownRenderer.remarkCodeComponents.mermaid = Mermaid
    }
  },

  deactivate() {
    this.subs.dispose()

    if (markdownRenderer) {
      markdownRenderer.remarkCodeComponents.mermaid = null
    }
  }
}
