//dependencies
import React, { createContext, useReducer } from 'react';
import { shiftConfigurationReducer } from '../reducers/shiftConfigurationReducer';

export const ShiftConfigurationContext = createContext();

const ShiftConfigurationContextProvider = (props) => {
    const [shiftConfigs, shiftConfigsDispatch] = useReducer(shiftConfigurationReducer, []);

    return (
        <ShiftConfigurationContext.Provider value={{ shiftConfigs, shiftConfigsDispatch }} >
            {props.children}
        </ShiftConfigurationContext.Provider>
    )
}

export default ShiftConfigurationContextProvider;