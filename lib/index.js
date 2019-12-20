"use strict";

var _propTypes = _interopRequireDefault(require("prop-types"));

var React = _interopRequireWildcard(require("react"));

var _mermaid = require("mermaid");

var _inkdrop = require("inkdrop");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Mermaid extends React.Component {
  constructor(props) {
    super(props);
    this.mermaidId = 'mermaid-' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    this.state = {
      svg: '',
      error: null
    };
  }

  componentDidMount() {
    this.renderDiagram(this.props.children[0]);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.children[0] !== this.props.children[0]) {
      this.renderDiagram(this.props.children[0]);
    }
  }

  componentWillUnmount() {
    this.cleanupMermaidDiv();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.children[0] !== this.props.children[0] || nextState.svg !== this.state.svg || nextState.error !== this.state.error;
  }

  render() {
    const {
      error
    } = this.state;
    console.log('MERMAID: render error', error);
    return React.createElement("div", {
      className: "mermaid-diagram"
    }, React.createElement("div", {
      dangerouslySetInnerHTML: {
        __html: this.state.svg
      }
    }), error && React.createElement("div", {
      className: "ui error message"
    }, React.createElement("div", {
      className: "header"
    }, "Failed to render Marmaid"), React.createElement("div", null, React.createElement("pre", null, error.message))));
  }

  renderDiagram(code) {
    try {
      this.cleanupMermaidDiv();

      _mermaid.mermaidAPI.render(this.mermaidId, code, svg => this.setState({
        svg,
        error: null
      }));
    } catch (e) {
      this.setState({
        error: e,
        svg: ''
      });
    }
  }

  cleanupMermaidDiv() {
    const el = document.querySelector(`#${this.mermaidId}`);
    if (el) el.remove();
    const el2 = document.querySelector(`#d${this.mermaidId}`);
    if (el2) el2.remove();
  }

}

_defineProperty(Mermaid, "propTypes", {
  children: _propTypes.default.arrayOf(_propTypes.default.string)
});

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

    if (_inkdrop.markdownRenderer) {
      _inkdrop.markdownRenderer.remarkCodeComponents.mermaid = Mermaid;
    }
  },

  deactivate() {
    if (_inkdrop.markdownRenderer) {
      _inkdrop.markdownRenderer.remarkCodeComponents.mermaid = null;
    }
  }

};