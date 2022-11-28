'use babel'

const React = require('react')
const { mermaidAPI } = require('mermaid/dist/mermaid.js')
const { markdownRenderer } = require('inkdrop')

class Mermaid extends React.Component {
  constructor(props) {
    super(props)
    this.mermaidId =
      'mermaid-' +
      Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(0, 5)
    this.state = { svg: '', error: null }
  }
  componentDidMount() {
    this.renderDiagram()
    this.subs = inkdrop.config.observe('mermaid.theme', this.renderDiagram)
  }
  componentDidUpdate(prevProps) {
    if (prevProps.children[0] !== this.props.children[0]) {
      this.renderDiagram()
    }
  }
  componentWillUnmount() {
    this.cleanupMermaidDiv()
    this.subs.dispose()
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.children[0] !== this.props.children[0] ||
      nextState.svg !== this.state.svg ||
      nextState.error !== this.state.error
    )
  }
  render() {
    const themeName = inkdrop.config.get('mermaid.theme')
    const autoScale = inkdrop.config.get('mermaid.autoScale')
    const { error } = this.state

    return (
      <div
        className={`mermaid-diagram theme-${themeName} ${
          autoScale ? '' : 'disable-auto-scale'
        }`}
      >
        <div dangerouslySetInnerHTML={{ __html: this.state.svg }} />
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
  renderDiagram = () => {
    const code = this.props.children[0]
    try {
      this.cleanupMermaidDiv()
      mermaidAPI.render(this.mermaidId, code, svg =>
        this.setState({ svg, error: null })
      )
    } catch (e) {
      this.setState({ error: e, svg: '' })
    }
  }
  cleanupMermaidDiv() {
    const el = document.querySelector(`#${this.mermaidId}`)
    if (el) el.remove()
    const el2 = document.querySelector(`#d${this.mermaidId}`)
    if (el2) el2.remove()
  }
}

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
    function initMermaid() {
      mermaidAPI.initialize({
        startOnLoad: false,
        theme: inkdrop.config.get('mermaid.theme'),
        themeCSS: inkdrop.config.get('mermaid.themeCSS'),
        themeVariables: JSON.parse(
          inkdrop.config.get('mermaid.themeVariables') || '{}'
        )
      })
    }

    this.subs = inkdrop.config.observe('mermaid.theme', initMermaid)
    initMermaid()

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
