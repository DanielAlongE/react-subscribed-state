/* eslint-disable no-undef */
import React, { useEffect } from 'react';
import { act, cleanup, fireEvent } from '@testing-library/react';
import { useSubscribedState, SubscribedState, ContextProp } from '../index';
import { renderWithProvider } from './test-utils';

describe('useSubscribedState', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders without crashing', () => {
    renderWithProvider(<div></div>)
  });

  it('counter using setStateField', () => {
    let hookObj: any;
    function hookFactory (hook: ()=>any): JSX.Element {
      // eslint-disable-next-line no-unused-vars
      hookObj = hook()
      return null
    }

    const customHook = () => {
      const { stateRef, setStateField } = useSubscribedState(() => true)
      return { stateRef, setStateField }
    }

    const App = () => hookFactory(customHook)

    renderWithProvider(<App />);

    const setStateField = hookObj.setStateField as ContextProp['setStateField']
    let counter = 0

    act(() => {
      setStateField('counter', 1);
      setStateField('counter', (x:number) => {
        counter = x
        return x
      });
    })

    expect(counter).toBe(1);
  })

  it('counter check reRender', async () => {
    const App = () => {
      const { stateRef, setStateField } = useSubscribedState(() => true)
      const { counter = 0 } = stateRef.current

      useEffect(() => {
        setStateField('counter', 1)
      }, [])

      return <div>{counter}</div>
    }

    const { findByText } = renderWithProvider(<App />);
    const expected = '1'
    const result = await findByText(expected)

    expect(result.textContent).toBe(expected);
  })

  it('useSubscribedState 1', async () => {
    let hookObj: any;
    function hookFactory (hook: ()=>any): JSX.Element {
      // eslint-disable-next-line no-unused-vars
      hookObj = hook()
      return null
    }

    let renderCount = 0;
    const customHook = () => {
      const { stateRef, setState, setStateField } = useSubscribedState((k) => {
        return true
      });
      renderCount += 1;

      return { stateRef, setState, setStateField };
    }

    const Sample = () => hookFactory(customHook)

    renderWithProvider(<Sample />);

    const setStateField = hookObj.setStateField as ContextProp['setStateField']
    // const setState = hookObj.setState as ContextProp['setState']

    act(() => {
      setStateField('one', 100)
      setStateField('err.arr.0', 'oops!')
      setStateField('err.arr.1', 'oops!')
      // setState({
      //   one: 100,
      //   err: {
      //     arr: ['oops!', 'oops!']
      //   }
      // })
    })

    expect(renderCount).toBe(1);

    expect(hookObj.stateRef.current.one).toBe(100);
  })

  it('useSubscribedState check subscriber calls', () => {
    const reRender = jest.fn();
    let hookObj: any;
    function hookFactory (hook: ()=>any): JSX.Element {
      // eslint-disable-next-line no-unused-vars
      hookObj = hook()
      return null
    }

    const customHook = () => {
      const { stateRef, setStateField } = useSubscribedState((k) => {
        reRender(k)
        return true
      });
      return { stateRef, setStateField };
    }

    const Sample = () => hookFactory(customHook)

    renderWithProvider(<Sample />);

    const setStateField = hookObj.setStateField as ContextProp['setStateField']

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
        return (<>
          <button data-testid="btn" onClick={() => setStateField('some', 'something')}>Click</button>
          <div data-testid="custom-element">{some}</div>
        </>)
      }}
    </SubscribedState>)

    const { getByTestId, findByText } = renderWithProvider(<Sample />);

    const expectedText = 'something';
    fireEvent.click(getByTestId('btn'));
    const result = await findByText(expectedText);
    expect(result.textContent).toBe(expectedText)
  })

  it('getState returns entire state', () => {
    let hookObj: any;
    function hookFactory (hook: ()=>any): JSX.Element {
      // eslint-disable-next-line no-unused-vars
      hookObj = hook()
      return null
    }

    const customHook = () => {
      const { getState, setState } = useSubscribedState(() => true)
      return { getState, setState }
    }

    const App = () => hookFactory(customHook)

    renderWithProvider(<App />);

    const getState = hookObj.getState as ContextProp['getState']

    let state:any

    act(() => {
      state = getState()
    })

    expect(JSON.stringify(state)).toBe('{}');
  })

  it('getState returns fields from state', () => {
    let hookObj: any;
    function hookFactory (hook: ()=>any): JSX.Element {
      // eslint-disable-next-line no-unused-vars
      hookObj = hook()
      return null
    }

    const customHook = () => {
      const { getState, setState } = useSubscribedState(() => true)
      return { getState, setState }
    }

    const App = () => hookFactory(customHook)

    renderWithProvider(<App />);

    const getState = hookObj.getState as ContextProp['getState']
    const setState = hookObj.setState as ContextProp['setState']

    let one:number
    let two:number
    let three:number

    act(() => {
      setState({ one: 1, two: 2, three: 3 });
      // await sleep(1000)
      one = getState('one')
      two = getState('two')
      three = getState('three')
    })

    expect(one).toBe(1);
    expect(two).toBe(2);
    expect(three).toBe(3);
  })
})
