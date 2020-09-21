import React from 'react';
import { Provider } from '../index';
import { render } from '@testing-library/react';

// export function Provider ({ children }:{ children: any }) {
//   const { Provider, value } = useProvider({})

//   return (<Provider value={value}>{children}</Provider>)
// }

const TestProvider = ({ children }:{ children: any }) => {
  return <Provider initialState={{}}>{children}</Provider>
}

export const renderWithProvider = (ui: React.ReactElement, options?: any) => {
  return render(ui, { wrapper: TestProvider, ...options })
}

export const sleep = (delay:number) => {
  return new Promise(resolve => setTimeout(resolve, delay))
}
