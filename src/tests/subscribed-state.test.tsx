/* eslint-disable no-undef */
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { render, act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSubscribedState, SubscribedState } from '../index';
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

    render(<Sample />);

    const setCount = result.setCount as React.Dispatch<React.SetStateAction<number>>

    act(() => {
      setCount(x => x + 1);
    })

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
      setStateField('err.arr.0', 'oops!')
    })

    expect(result.stateRef.current.one).toBe(100);
  })

  it('useSubscribedState 2', () => {
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

    console.log('before', result.stateRef)
    act(() => {
      setStateField('one', 100)
      setStateField('err.arr.0', 'oops!')
    })
    console.log('before', result.stateRef)
    expect(result.stateRef.current.one).toBe(100);
  })

  it('SubscribedState', () => {
    /*    let result: any;

    // eslint-disable-next-line no-unused-vars

    function hookFactory (hook: ()=>any) {
      return function HookWrapper (): JSX.Element {
        result = hook()
        return null;
      }
    }
    */

    const Sample = () => (<SubscribedState fields={['some']}>
      {({ stateRef, setStateField }) => {
        const { some = 'nothing' } = stateRef.current;
        return (<>
          <button onClick={() => setStateField('some', 'something')}>Click</button>
          <div data-testid="custom-element">{some}</div>
        </>)
      }}
    </SubscribedState>)

    customRender(<Sample />);

    (async function () {
      const result = await screen.findByTestId('custom-element');
      console.log(result);
    })()

    act(() => {
    })

    expect(100).toBe(100);
  })
})
