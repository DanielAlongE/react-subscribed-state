import React, { createContext, useRef, useCallback, MutableRefObject, useContext, useEffect, useState } from 'react';

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

/**
 * This is a debounce function
 * @param fn function
 * @param delay time in milliseconds
 * @param limit debounce reset count
 * @returns function that receives optional args
 */
const debounce = function (fn:unknown, delay: number = 100, limit: number = 0) {
  let timeoutID: ReturnType<typeof setTimeout>;
  let debounceCount = 0;

  if (!isFunction(fn)) {
    throw new Error('Argument not a valid function');
  }

  return function (...args: any[]) {
    debounceCount += 1;
    clearTimeout(timeoutID);

    // if limit is reached reset debounce and run function
    if (limit > 0 && debounceCount === limit) {
      debounceCount = 0;
      return fn(...args)
    } else {
      timeoutID = setTimeout(() => {
        // console.log("debounce end ", timeoutID)
        fn(...args)
      }, delay);
    }
  }
}

export const context = createContext<ContextProp>({})

// eslint-disable-next-line no-undef
const isFunction = (val: unknown): val is Function => typeof val === 'function'

function useWrapper<T = any> (stateRef:MutableRefObject<T>) {
  const subscribersRef: MutableRefObject<Array<RefFunc | null>> = useRef([])

  const notifySubscribers = useCallback((key:string, value:any, previousValue:any) => {
    subscribersRef.current
      .filter(x => x !== null)
      .forEach((fn) => {
        if (fn) {
          fn(key, value, previousValue);
        }
      })
  }, [])

  /**
   * @param stateArray Array<[ string, ValueProp ]>
   */
  const setStateFields = useCallback((stateArray: Array< [ string, ValueProp ] >) => {
    stateArray.forEach(([key, value]) => {
      setStateField(key, value);
    })
  }, [])

  /**
   * This will set a field in state
   * @param key string
   * @param value ValueProp
   */
  const setStateField = useCallback((key:string, value:ValueProp) => {
    const previousValue = dotProp.get(stateRef.current, key, undefined)
    const val = isFunction(value) ? value(previousValue) : value

    stateRef.current = dotProp.set(stateRef.current, key, val)

    // console.log(stateRef)
    notifySubscribers(key, val, previousValue)
  }, [])

  /**
   * This will add a new subscriber
   * @param referenceFunc reference reference function
   * @param delay time in milliseconds
   * @returns number reference index
   */
  const addSubscriber = useCallback((referenceFunc: RefFunc):number => {
    const index = subscribersRef.current.length;

    if (isFunction(referenceFunc)) {
      subscribersRef.current[index] = referenceFunc
      return index;
    }
    return -1;
  }, [])

  /**
   * This will remove a subscriber
   * @param index number
   */
  const removeSubscriber = useCallback((index) => {
    if (index > -1) {
      subscribersRef.current[index] = null
    }
  }, [])

  return { stateRef, setStateField, setStateFields, addSubscriber, removeSubscriber }
}

/**
 * This hook will return a Provider and its value
 * @param stateRef MutableRefObject<T>
 * @returns {Provider, value}
 */
export function useProvider<T = any> (stateRef: MutableRefObject<T>) {
  const { setStateField, setStateFields, addSubscriber, removeSubscriber } = useWrapper<T>(stateRef);
  const { Provider } = context;
  const value = { stateRef, setStateField, setStateFields, addSubscriber, removeSubscriber };

  return { Provider, value };
}

/**
 * This hook will expose subscried state objects and modifiers
 * @param shouldUpdate function to determin if component should update
 * @param delay milliseconds
 * @param debounceLimit this is the debounce count at which the debounce will be reset
 */
export function useSubscribedState (shouldUpdate?:ShouldUpdateFunc, delay:number = 0, debounceLimit:number = 0) {
  const { stateRef, setStateField, setStateFields, addSubscriber, removeSubscriber } = useContext(context);
  const [, setRender] = useState({})

  const idRef = useRef(-1)
  const isMounted = useRef(false)

  const _render = debounce(() => isMounted.current && setRender({}), delay, debounceLimit)

  useEffect(() => {
    isMounted.current = true

    if (shouldUpdate && addSubscriber) {
      idRef.current = addSubscriber(referenceFunc)
    }

    return () => {
      isMounted.current = false
      removeSubscriber && removeSubscriber(idRef.current)
    }
  }, [])

  const reRender = useCallback(() => {
    _render()
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

export function SubscribedState ({
  children: Comp,
  fields = [],
  delay = 0
}:{ children: React.FC< ContextProp >, fields?: string[], delay?: number }) {
  const { stateRef, setStateField, setStateFields } = useSubscribedState((key, value, previousValue) => {
    if (fields.includes(key) && value !== previousValue) {
      return true;
    }
    return false;
  }, delay);

  return React.createElement(Comp, { stateRef, setStateField, setStateFields })
}
