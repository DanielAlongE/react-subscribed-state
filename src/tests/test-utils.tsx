import React, { useRef } from 'react';
import { useProvider, useProvider2 } from '../index';
import { render } from '@testing-library/react';

export function Provider1 ({ children }:{ children: any }) {
  const stateRef = useRef({});
  const { Provider, value } = useProvider(stateRef)

  return (<Provider value={value}>{children}</Provider>)
}

export function Provider ({ children }:{ children: any }) {
  const { SubscribedStateProvider } = useProvider2({})

  return (<SubscribedStateProvider>{children}</SubscribedStateProvider>)
}

export const renderWithProvider = (ui: React.ReactElement, options?: any) => {
  return render(ui, { wrapper: Provider, ...options })
}

export const sleep = (delay:number) => {
  return new Promise(resolve => setTimeout(resolve, delay))
}
