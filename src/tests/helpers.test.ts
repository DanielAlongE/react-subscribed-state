/* eslint-disable no-undef */

import { stateToKeyValuePairs } from '../lib/helpers'

describe('helpers -> stateToKeyValuePairs', () => {
  const obj = {
    first: 'this is a string',
    second: {
      one: 1,
      two: 2
    },
    third: [1, 2, 3]
  }
  it('return 6 results', () => {
    const a = stateToKeyValuePairs(obj)
    expect(a.length).toBe(6)
  })
})
