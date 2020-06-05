//dependencies
import React, { createContext, useReducer, useEffect } from 'react';
import { shiftConfigurationReducer } from '../reducers/shiftConfigurationReducer';
//functions 
import { generalGetRequest } from '../functions/api';
//routes
import { FETCH_SHIFTS } from '../config/routes';
//types
import { SET_SHIFTS } from '../reducers/shiftConfigurationReducer';

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