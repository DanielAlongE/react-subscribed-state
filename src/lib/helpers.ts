export function isNumeric (value:string): boolean {
  return new RegExp(/^\d+$/).test(value);
}

export function isObject (value:any): boolean {
  return value && value.constructor.name === 'Object';
}

export function isDotted (value:string): boolean {
  return value.indexOf('.') > -1;
}

type ObjectOrArray = Record<string, unknown> | Array<any>
export function stateToKeyValuePairs (obj: ObjectOrArray) {
  const result: Array<any[]> = [];
  const data = Array.isArray(obj) ? obj.map((v, k) => [`${k}`, v]) : Object.entries(obj)

  data.forEach(([key, value]) => {
    if (isObject(value) || Array.isArray(value)) {
      stateToKeyValuePairs(value).forEach(([k, v]) => result.push([`${key}.${k}`, v]))
    } else {
      result.push([key, value]);
    }
  })

  return result;
}

export function stringToArrayProp (param:string): any[] {
  const result = param.split('.').map(o => {
    if (isNumeric(o)) {
      return +o;
    }
    return o;
  });
  return result
}
