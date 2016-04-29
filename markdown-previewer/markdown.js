/* Markdown Previewer
    - A simple app written with React that uses the Marked script library to
    display a previewer of the Markdown markup language as the user types. A
    FreeCodeCamp challenge.

    www.softwareontheshore.com
*/
'use strict';
const React = require('react');
const ReactDOM = require('react-dom');

// Initial React Class
const MarkdownPreviewer = React.createClass({
  displayName: 'MarkdownPreviewer',

  getInitialState: function getInitialState() {
    return { value: 'Type some *Markdown* here and see what **happens**!' };
  },
  // updates as the user types
  handleChange: function handleChange() {
    this.setState({ value: this.refs.textarea.value });
  },
  // translates the markdown '__html required by dangeriouslySetInnerHTML propTypes'
  rawMarkup: function rawMarkup() {
    return { __html: marked(this.state.value, { sanitize: true }) };
  },
  // render the HTML - uses a Bootstrap row and two columns
  render: function render() {
    return (
      React.createElement('div', { className: 'row' },
        React.createElement('div', { className: 'col-md-6' },
          React.createElement('h3', null, 'Input'),
          React.createElement('textarea', { onChange: this.handleChange, ref: 'textarea',
            defaultValue: this.state.value })
        ),
        React.createElement('div', { className: 'col-md-6' },
          React.createElement('h3', null, 'Output'),
          React.createElement('div', { className: 'content', dangerouslySetInnerHTML: this.rawMarkup() })
        )
      )
    );
  }
});

ReactDOM.render(React.createElement(MarkdownPreviewer, null), document.getElementById('main'));
