import React from 'react';

function Testing ({ children }:{children:React.FC<{one: string}>}): React.FunctionComponentElement<any> {
  console.log(children);
  return null;
}

export default function SimpleForm () {
  return (<div>
    <Testing>{
      ({ one }) => <div>{one}</div>
    }</Testing>
  </div>)
}
