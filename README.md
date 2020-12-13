# react-subscribed-state
A custom state reactivity pattern in React.js

With react-subscribed-state, components can subscribe to fields in the state such that they are able to re-render when the values of such fields change. This will go a long way to eliminate wasted renders as only the components that are required to rerender will do so.

The following are some examples of use cases:
- Complex forms with several moving parts such as Error Messages and Computed properties
- Game score board
- Progress bar that displays progress details
- Spreadsheet 

## Install

```sh
npm i react-subscribed-state
```

## Setup
```javascript
import { Provider } from "react-subscribed-state";

function(){
  const initialState = {count:0, me:"daniel"}; //define initial state

  return (
    <Provider initialState={initialState}>
      
    </Provider>
  );
}
```

```javascript
import { useSubscribedState } from "react-subscribed-state";

function IncrementButton(){
  const { setStateField } = useSubscribedState();
  return <button onClick={()=>setStateField('count', x => !x ? 1 : x+1 )}>Increment</button>
}

function CountField(){
    /*
    *   useSubscribedState receives 2 optional params and returns a boolean 
    *   to determine whether component should re-render
    *   shouldUpdate = (fieldKey, value, previousValue): boolean 
    *   debounce: boolean this might be useful with values that change frequently 
    */
  const { stateRef } = useSubscribedState(()=>true, 500); // or (k) => k == "count"

  const { count } = stateRef.current;

  return <h2>{count}</h2>
}
```


```javascript

function(){
  const initialState = {count:0, me:"daniel"};

  //only CountField will re-render when IncrementButton is clicked

  return (
    <Provider initialState={initialState}>
      <CountField />
      <IncrementButton />
    </Provider>
  );
}
```

## Examples
[Counter](https://codesandbox.io/s/dry-paper-pm1n9?file=/src/App.tsx)