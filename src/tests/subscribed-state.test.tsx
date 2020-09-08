/* eslint-disable no-undef */
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { render, act } from '@testing-library/react';
import { useSubscribedState } from '../index';
import { customRender } from './test-utils';

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
    let result: any;

    // eslint-disable-next-line no-unused-vars
    function hookFactory (hook: ()=>any) {
      return function HookWrapper (): JSX.Element {
        result = hook()
        return null;
      }
    }

    const customHook = () => {
      const [count, setCount] = useState(0);
      return { count, setCount };
    }

    const Sample = () => hookFactory(customHook)()

    const check = render(<Sample />);

    const setCount = result.setCount as React.Dispatch<React.SetStateAction<number>>

    act(() => {
      setCount(x => x + 1);
    })

    console.log(check)
    expect(result.count).toBe(1);
  })

  it('useSubscribedState 1', () => {
    let result: any;

    // eslint-disable-next-line no-unused-vars
    function hookFactory (hook: ()=>any) {
      return function HookWrapper (): JSX.Element {
        result = hook()
        return null;
      }
    }

    const customHook = () => {
      const { stateRef, setStateField } = useSubscribedState(() => true);
      return { stateRef, setStateField };
    }

    const Sample = () => hookFactory(customHook)()

    customRender(<Sample />);

    const setStateField = result.setStateField as (f: string, v: unknown)=> void

    act(() => {
      setStateField('one', 100)
    })

    expect(result.stateRef.current.one).toBe(100);
  })
})
