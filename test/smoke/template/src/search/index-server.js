// import React from 'react';
// import './search.less'
// import logo from '../assets/img/logo.png';

const React = require('react');
const logo = require('../assets/img/logo.png');
require('./search.less');

class Search extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      Text: null
    };
  }

  handleClick() {
    import('./test').then((Text) => {
      this.setState({ Text: Text.default });
    });
  }

  render() {
    const { Text } = this.state;
    console.log(logo);
    return (
      <div className="search-text">
        <span>search text is test 我不知道</span>
        {
          Text ? <Text /> : ''
        }
        <img onClick={this.handleClick.bind(this)} src={ logo } />
      </div>
    )
  }
}

module.exports = <Search />;