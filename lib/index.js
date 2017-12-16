'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _mermaid = require('mermaid');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let Mermaid = class Mermaid extends _react2.default.Component {
  constructor(props) {
    super(props);
    this.mermaidId = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    this.state = { svg: '' };
  }
  componentDidMount() {
    this.renderDiagram(this.props.children[0]);
  }
  componentWillUpdate(nextProps) {
    if (nextProps.children[0] !== this.props.children[0]) {
      this.renderDiagram(nextProps.children[0]);
    }
  }
  componentWillUnmount() {
    this.cleanupMermaidDiv();
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.children[0] !== this.props.children[0] || nextState.svg !== this.state.svg;
  }
  render() {
    return _react2.default.createElement('div', { className: 'mermaid-diagram', dangerouslySetInnerHTML: { __html: this.state.svg } });
  }
  renderDiagram(code) {
    this.cleanupMermaidDiv();
    _mermaid.mermaidAPI.render(this.mermaidId, code, svg => this.setState({ svg }));
  }
  cleanupMermaidDiv() {
    const el = document.querySelector(`#${this.mermaidId}`);
    if (el) el.remove();
  }
};


module.exports = {
  config: {
    theme: {
      title: 'Theme',
      type: 'string',
      default: 'forest'
    }
  },

  activate() {
    _mermaid.mermaidAPI.initialize({
      startOnLoad: false,
      theme: inkdrop.config.get('mermaid.theme')
    });

    const { MDEPreview } = inkdrop.components.classes;
    if (MDEPreview) {
      MDEPreview.remarkCodeComponents.mermaid = Mermaid;
    }
  },

  deactivate() {
    const { MDEPreview } = inkdrop.components.classes;
    if (MDEPreview) {
      MDEPreview.remarkCodeComponents.mermaid = null;
    }
  }
};