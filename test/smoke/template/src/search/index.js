import React from 'react';
import ReactDOM from 'react-dom';
import './search.less'
import logo from '../assets/img/logo.png';
import { a } from './tree-shaking';

import '../common';

class Search extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      Text: null
    };
  }

  handleClick() {
    import('./test').then((Text) => {
      console.log(Text);
      this.setState({ Text: Text.default });
    });
  }

  render() {
    const funcA = a();
    const { Text } = this.state;
    return (
      <div className="search-text">
        <span>search text is test 我不知道谁知道呢{funcA}</span>
        {
          Text ? <Text /> : ''
        }
        <img onClick={this.handleClick.bind(this)} src={ logo } />
      </div>
    )
  }
}

ReactDOM.render(
  <Search />,
  document.getElementById('root')
);