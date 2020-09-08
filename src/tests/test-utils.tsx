import React, { useRef } from 'react';
import { useProvider } from '../index';
import { render } from '@testing-library/react';

function Provider ({ children }:{ children: any }) {
  const stateRef = useRef({});
  const { Provider, value } = useProvider(stateRef)

  return (<Provider value={value}>{children}</Provider>)
}

export const customRender = (ui: React.ReactElement, options?: any) => {
  return render(ui, { wrapper: Provider, ...options })
}
