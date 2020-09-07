/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
// import useSubscribedState from '../src/subscribed-state';

function App () {
  return <div></div>
}
describe('see your life', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });

  it('something crazy', () => {
    expect(1).toBe(1);
  })

  it('hooks', () => {
    // let result;

    // eslint-disable-next-line no-unused-vars
    function hookFactory (hook: ()=>void) {
      return function HookWrapper (): any {
        // result = hook()
        return null;
      }
    }

    const Sample = () => <div>Jesus is Lord</div>
    const div = document.createElement('div');
    ReactDOM.render(<Sample />, div);
    // console.log(result)
    expect(1).toBe(1);
  })
})
