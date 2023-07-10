import React from 'react'
import { mermaidAPI } from 'mermaid/dist/mermaid.js'

export default class Mermaid extends React.Component {
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
