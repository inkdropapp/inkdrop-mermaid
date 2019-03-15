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
    this.mermaidId = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substr(0, 5)
    this.state = { svg: '' }
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
      nextState.svg !== this.state.svg
    )
  }
  render() {
    return (
      <div
        className="mermaid-diagram"
        dangerouslySetInnerHTML={{ __html: this.state.svg }}
      />
    )
  }
  renderDiagram(code) {
    this.cleanupMermaidDiv()
    mermaidAPI.render(this.mermaidId, code, svg => this.setState({ svg }))
  }
  cleanupMermaidDiv() {
    const el = document.querySelector(`#${this.mermaidId}`)
    if (el) el.remove()
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
