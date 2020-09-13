/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { render, act, cleanup, fireEvent } from '@testing-library/react';
import { useSubscribedState, SubscribedState } from '../index';
import { customRender } from './test-utils';

function App () {
  return <div></div>
}
describe('see your life', () => {
  afterEach(() => {
    cleanup()
  })

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

  it('useSubscribedState 1', async () => {
    let result: any;

    // eslint-disable-next-line no-unused-vars
    function hookFactory (hook: ()=>any) {
      return function HookWrapper (): JSX.Element {
        result = hook()
        const [text, setText] = useState('')

        useEffect(() => {
          setTimeout(() => setText('Done'), 2000)
        }, [])
        return <div>{text}</div>
      }
    }

    let renderCount = 0;
    const customHook = () => {
      const { stateRef, setState, setStateField } = useSubscribedState(() => {
        return true
      }, 0, 2);
      renderCount += 1;

      return { stateRef, setState, setStateField };
    }

    const Sample = () => hookFactory(customHook)()

    customRender(<Sample />);

    // const setStateField = result.setStateField as (f: string, v: unknown)=> void
    const setState = result.setState as (v: unknown)=> void

    act(() => {
      // setStateField('one', 100)
      // setStateField('err.arr.0', 'oops!')
      // setStateField('err.arr.1', 'oops!')
      setState({
        one: 100,
        err: {
          arr: ['oops!', 'oops!']
        }
      })
    })

    expect(renderCount).toBe(2);

    expect(result.stateRef.current.one).toBe(100);
  })

  it('useSubscribedState check subscriber calls', () => {
    let result: any;
    const reRender = jest.fn();
    // eslint-disable-next-line no-unused-vars
    function hookFactory (hook: ()=>any) {
      return function HookWrapper (): JSX.Element {
        result = hook()
        return null;
      }
    }

    const customHook = () => {
      const { stateRef, setStateField } = useSubscribedState((k) => {
        console.log('reRender', k)
        reRender(k)
        return true
      });
      return { stateRef, setStateField };
    }

    const Sample = () => hookFactory(customHook)()

    customRender(<Sample />);

    const setStateField = result.setStateField as (f: string, v: unknown)=> void

    act(() => {
      setStateField('one', 100)
      setStateField('err.arr.0', 'oops!')
    })

    expect(reRender.mock.calls.length).toBe(2);
    expect(reRender.mock.calls[0][0]).toBe('one');
    expect(reRender.mock.calls[1][0]).toBe('err.arr.0');
  })

  it('SubscribedState', async () => {
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
        console.log(some)
        return (<>
          <button data-testid="btn" onClick={() => setStateField('some', 'something')}>Click</button>
          <div data-testid="custom-element">{some}</div>
        </>)
      }}
    </SubscribedState>)

    const { getByTestId, findByText } = customRender(<Sample />);

    const expectedText = 'something';
    fireEvent.click(getByTestId('btn'));
    const result = await findByText(expectedText);
    // console.log(result)
    expect(result.textContent).toBe(expectedText)
  })
})
