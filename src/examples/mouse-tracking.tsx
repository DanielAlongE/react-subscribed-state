import React, { useRef, useEffect } from 'react';
import { useProvider, useSubscribedState } from '../subscribed-state';

const MouseParentComp = ({children}:{children:any}) => {
    const { setStateField } = useSubscribedState();

    const handleMousePosition = (e:{clientX: number, clientY: number}) => {

        if(e){
            const { clientX, clientY } = e;
            if(clientX){
                setStateField("x", clientX);
            }
            

            if(clientY)
            setStateField("y", clientY);
        }
    }

    useEffect(() => {
        window.addEventListener("mousemove", handleMousePosition);

        return ()=>window.removeEventListener("mousemove", handleMousePosition);
    }, []);

    return (
        <>{children}</>
    )
}

const MousePositionDisplay = () =>  {
    const { stateRef } = useSubscribedState((field) => {
        const fields = ["x", "y"];
        
        if(fields.indexOf(field) > -1){
            return true;
        }

        return false;
    }, 100);

    const {x, y} = stateRef && stateRef.current;

    return (
        <div>
            <h2>Mouse Position</h2>
            <p>X:{x}</p>
            <p>Y:{y}</p>
        </div>
    )
}

export default function(){
    const stateRef = useRef({x:0, y:0});
    const { Provider, value } = useProvider(stateRef);

    return (
    <Provider value={value}>
        <MouseParentComp>
            <MousePositionDisplay />            
        </MouseParentComp>
    </Provider>
    )
}