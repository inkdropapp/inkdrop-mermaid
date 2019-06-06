import PropTypes from 'prop-types'
import * as React from 'react'
import { mermaidAPI } from 'mermaid'
import { markdownRenderer } from 'inkdrop'

class Mermaid extends React.Component {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.string)
  }

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
    this.renderDiagram(this.props.children[0])
  }
  componentDidUpdate(prevProps) {
    if (prevProps.children[0] !== this.props.children[0]) {
      this.renderDiagram(this.props.children[0])
    }
  }
  componentWillUnmount() {
    this.cleanupMermaidDiv()
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.children[0] !== this.props.children[0] ||
      nextState.svg !== this.state.svg ||
      nextState.error !== this.state.error
    )
  }
  render() {
    const { error } = this.state
    console.log('MERMAID: render error', error)

    return (
      <div className="mermaid-diagram">
        <div dangerouslySetInnerHTML={{ __html: this.state.svg }} />
        {error && (
          <div className="ui error message">
            <div className="header">Failed to render Marmaid</div>
            <div>
              <pre>{error.message}</pre>
            </div>
          </div>
        )}
      </div>
    )
  }
  renderDiagram(code) {
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
    theme: {
      title: 'Theme',
      type: 'string',
      default: 'forest'
    }
  },

  activate() {
    mermaidAPI.initialize({
      startOnLoad: false,
      theme: inkdrop.config.get('mermaid.theme')
    })

    if (markdownRenderer) {
      markdownRenderer.remarkCodeComponents.mermaid = Mermaid
    }
  },

  deactivate() {
    if (markdownRenderer) {
      markdownRenderer.remarkCodeComponents.mermaid = null
    }
  }
}
