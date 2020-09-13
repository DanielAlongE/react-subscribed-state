import { isObject } from './dotProp';

type ObjectOrArray = Record<string, unknown> | Array<any>
export function stateToKeyValuePairs (obj: ObjectOrArray) {
  const result: Array<any[]> = [];
  const data = Array.isArray(obj) ? obj.map((v, k) => [k, v]) : Object.entries(obj)

  data.forEach(([key, value]) => {
    if (isObject(value) || Array.isArray(value)) {
      stateToKeyValuePairs(value).forEach(([k, v]) => result.push([`${key}.${k}`, v]))
    } else {
      result.push([key, value]);
    }
  })

  return result;
}
