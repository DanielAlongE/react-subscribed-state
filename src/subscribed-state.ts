import { createContext, useRef, useCallback, MutableRefObject, useContext, useEffect, useState } from 'react';
import dotProp from './lib/dotProp';

type ValueProp = unknown | ((s:any)=>any);

export type RefFunc = (key:string, value?:any, previousValue?:any)=> void

export type ShouldUpdateFunc = (key:string, value?:any, previousValue?:any)=> boolean

interface ContextProp {
    stateRef?: MutableRefObject<any>
    setStateField?: (field:string, value:ValueProp)=>any
    setStateFields?: (s: Array<[string, ValueProp]>)=>void
    addSubscriber?: (i:RefFunc, d?:number)=>number
    removeSubscriber?: (index:number)=>void
}

const debounce = function (fn:unknown, delay: number = 100) {
  let timeoutID: number;

  if (!isFunction(fn)) {
    throw new Error('Argument not a valid function');
  }

  return function (...args: any[]) {
    if (timeoutID) {
      // console.log("debounce clear ", timeoutID)
      clearTimeout(timeoutID);
    }

    timeoutID = setTimeout(() => {
      // console.log("debounce end ", timeoutID)
      fn(...args)
    }, delay);
    // console.log("debounce start ", timeoutID)
  }
}

export const context = createContext<ContextProp>({})

// eslint-disable-next-line no-undef
const isFunction = (val: unknown): val is Function => typeof val === 'function'

function useWrapper<T = any> (stateRef:MutableRefObject<T>) {
  const subscribersRef: MutableRefObject<Array<RefFunc | null>> = useRef([])
  //    const debounceRef = useRef({})

  const notifySubscribers = useCallback((key:string, value:any, previousValue:any) => {
    subscribersRef.current
      .filter(x => x !== null)
      .forEach((fn) => {
        if (fn) {
          fn(key, value, previousValue);
        }
      })
  }, [])

  const setStateFields = useCallback((stateArray: Array< [ string, ValueProp ] >) => {
    stateArray.forEach(([key, value]) => {
      setStateField(key, value);
    })
  }, [])

  const setStateField = useCallback((key:string, value:ValueProp) => {
    const previousValue = dotProp.get(stateRef.current, key, undefined)
    const val = isFunction(value) ? value(previousValue) : value

    stateRef.current = dotProp.set(stateRef.current, key, val)

    // console.log(stateRef)
    notifySubscribers(key, val, previousValue)
  }, [])

  const addSubscriber = useCallback((referenceFunc: RefFunc, delay:number = 0):number => {
    const index = subscribersRef.current.length;

    if (isFunction(referenceFunc)) {
      subscribersRef.current[index] = debounce(referenceFunc, delay)
      return index;
    }
    return -1;
  }, [])

  const removeSubscriber = useCallback((index) => {
    if (index > -1) {
      subscribersRef.current[index] = null
    }
  }, [])

  return { stateRef, setStateField, setStateFields, addSubscriber, removeSubscriber }
}

export function useProvider<T = any> (stateRef: MutableRefObject<T>) {
  const { setStateField, setStateFields, addSubscriber, removeSubscriber } = useWrapper<T>(stateRef);
  const { Provider } = context;
  const value = { stateRef, setStateField, setStateFields, addSubscriber, removeSubscriber };

  return { Provider, value };
}

export function useSubscribedState (shouldUpdate?:ShouldUpdateFunc, debouce:number = 0) {
  const { stateRef, setStateField, setStateFields, addSubscriber, removeSubscriber } = useContext(context);
  const [, setRender] = useState({})

  const idRef = useRef(-1)

  useEffect(() => {
    if (shouldUpdate && addSubscriber) {
      idRef.current = addSubscriber(referenceFunc, debouce)
    }

    return () => removeSubscriber && removeSubscriber(idRef.current)
  }, [])

  const reRender = useCallback(() => {
    setRender({})
  }, [])

  const referenceFunc: RefFunc = (key, value, preValue) => {
    if (shouldUpdate) {
      const result = shouldUpdate(key, value, preValue)

      if (result) {
        reRender();
      }
    }
  }

  return { stateRef, setStateField, setStateFields, addSubscriber, removeSubscriber, reRender }
}
