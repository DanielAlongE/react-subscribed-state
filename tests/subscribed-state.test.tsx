/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';

function App () {
  return <div></div>
}

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
