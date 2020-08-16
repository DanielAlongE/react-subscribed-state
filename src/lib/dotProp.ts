
function isNumeric(value:string): boolean {
  return new RegExp(/^\d+$/).test(value);
}

function isObject(value:any): boolean {
  return value && value.constructor.name === "Object";
}

function isDotted(value:string): boolean {
  return value.indexOf(".") > -1;
}

export function stringToArrayProp (param: string ): any[] {

  return param.split(".").map( o => {
    if(isNumeric(o)){
      return parseInt(o);
    }
    return o;
  });
}

export function buildObj(dots:string, last:any){

  const props = stringToArrayProp(dots).reverse();
  let copy:any = last;

  props.forEach( (o, index) => {
    if(isNumeric(o)){
      copy = last;
      last = [];
      last[o] = copy;
    }else{
      copy = last;
      let value = isObject(copy) ? { ...copy} : Array.isArray(copy) ? [...copy] : copy;
      last = {[o]: value }
    }

  });

  return last;
}

export function _set (obj:any, props:any[] | string, value:any, immutable=true) {

  var pathArr = Array.isArray(props) ? props : stringToArrayProp(props);
  const newObj = immutable ? JSON.parse(JSON.stringify(obj)) : obj;

  let clone = newObj;
  for (var i = 0; i < pathArr.length; i++) {
    let p = pathArr[i];
    let next = pathArr[i+1];

    if (!isObject(clone[p])) {
      let arr = Array.isArray(clone[p]) ? clone[p] : [];
      clone[p] = isNumeric(next) ? arr : {};
      //console.log( clone[p] )
    }

    if (i === pathArr.length - 1) {
      clone[p] = value;
    }

    clone = clone[p];
  }
  //console.log(newObj);
  return newObj;//JSON.parse(JSON.stringify(newObj));
}

export function expandObject(obj:any){
  let newObj = {};

  for(let key in obj){
    if(isDotted(key)){
      //console.log(newObj, key, obj[key]);
      newObj = _set(newObj, key, obj[key]);

    }else{
      newObj[key] = obj[key];
    }

  }

  return newObj;
}

function get<T> (obj:any, props:any[] | string, def:any): T {
    if( !isObject(obj) ){
      return def;
    }

    let result = {...obj};

    if(!Array.isArray(props)){
      props = stringToArrayProp(props);
    }

    for(const key of props){
      if( ( isObject(result) || Array.isArray(result) ) && result.hasOwnProperty(key) ){
        result = result[key];
      }else{
        return def;
      }
    }
    return result;
}

function _del(obj:any, props:any[] | string): any {

  props = Array.isArray(props) ? props : stringToArrayProp(props);
  let result = {...obj};
  const count = props.length;

  for(const key of props){
    if(result.hasOwnProperty(key)){

      if(props[count-1] === key){

        if(Array.isArray(result)){
            const arr = result.filter((o,i)=>i!==key);
            const p = props.filter((o)=>o!==key);
            console.log("new props", p, arr);
            return _set(obj, p, arr);
        }
        else{
            delete result[key];
        }
    }else{
      result = result[key];
    }

    }
  }
  return obj;
}

export function del ( obj:any, props:any[] | string ) {

  var pathArr = Array.isArray(props) ? props : stringToArrayProp(props);
  const count = pathArr.length;
  const last = pathArr[count-1];
  const newPathArr = pathArr.slice(0, (count-1));

  if(Number.isInteger(last)){
    let arr:any[] = get(obj, newPathArr, []);
    arr = arr.filter((o,i) => i!==last );
    return _set(obj, newPathArr, arr);
  }
  else {
    let _obj:any = get(obj, newPathArr, {});
    delete _obj[last];
    return _set(obj, newPathArr, _obj);
  }

}

export default {
  get:get,
  set: _set,
  delete: del
};