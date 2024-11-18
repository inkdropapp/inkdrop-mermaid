import React, { useEffect, useContext } from 'react'
import mermaid from 'mermaid'

export function initMermaid(isPrintMode) {
  const { mermaidAPI } = require('mermaid/dist/mermaid.js')
  mermaidAPI.initialize({
    startOnLoad: false,
    theme: isPrintMode ? 'forest' : inkdrop.config.get('mermaid.theme'),
    themeCSS: inkdrop.config.get('mermaid.themeCSS'),
    themeVariables: JSON.parse(
      inkdrop.config.get('mermaid.themeVariables') || '{}'
    )
  })
}

export class Mermaid extends React.Component {
  constructor(props) {
    super(props)
    this.mermaidId =
      'mermaid-' +
      Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(0, 5)
    this.state = { error: null }
    this.refContainer = React.createRef()
  }
  componentDidMount() {
    this.subs = inkdrop.config.observe('mermaid.theme', this.renderDiagram)
  }
  componentDidUpdate(prevProps) {
    if (prevProps.children[0] !== this.props.children[0]) {
      this.renderDiagram()
    }
  }
  componentWillUnmount() {
    this.subs.dispose()
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.children[0] !== this.props.children[0] ||
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
        <div ref={this.refContainer} />
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
  renderDiagram = async () => {
    const { children } = this.props
    const [code] = children || []
    try {
      if (typeof code === 'string') {
        const elContainer = this.refContainer.current
        const { svg } = await mermaid.render(this.mermaidId, code)
        elContainer.innerHTML = svg
        this.setState({ error: null })
      }
    } catch (e) {
      this.setState({ error: e })
    }
  }
}

const MermaidThemeProvider = props => {
  const { printMode } = useContext(inkdrop.markdownRenderer.Context)

  useEffect(() => {
    initMermaid(printMode)
  }, [printMode])

  return <Mermaid {...props} />
}

export default MermaidThemeProvider
