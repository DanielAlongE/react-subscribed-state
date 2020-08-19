# subscribed-state
A custom state reactivity pattern in React.js

With subscribed-state, components can subscribe to fields in the state such that they are able to re-render when the values of such fields change. This will go a long way to eliminate wasted renders as only the components that are required to rerender will do so.

The following are some examples of use cases:
- Complex forms with several moving parts such as Error Messages and Computed properties
- Game score board
- Progress bar that displays progress details
- Spreadsheet 

## Install

```sh
npm i @alonge/subscribed-state
```

## Setup
```javascript
import { useProvider } from "@alonge/subscribed-state";
import { useRef } from "react";

function(){
  const stateRef = useRef({count:0, me:"daniel"}); //define default values
  const { Provider, value } = useProvider(stateRef);

  return (
    <Provider value={value}>
      
    </Provider>
  );
}
```

```javascript
import { useSubscribedState } from "@alonge/subscribed-state";

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
  const stateRef = useRef({count:0, me:"daniel"});
  const { Provider, value } = useProvider(stateRef);

  //only CountField will re-render when IncrementButton is clicked

  return (
    <Provider value={value}>
      <CountField />
      <IncrementButton />
    </Provider>
  );
}
```