//dependencies
import React, { createContext, useReducer, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { userDataReducer } from '../reducers/userDataReducer';
//keys
import { AUTH_COOKIE } from '../config/keys';
//functions 
import { generalGetRequest } from '../functions/api';
//routes
import { VALIDATE_USER } from '../config/routes';
//types
import { FETCH_USER_DATA } from '../reducers/userDataReducer';

export const UserDataContext = createContext();

const UserDataContextProvider = (props) => {
    const [userData, userDataDispatch] = useReducer(userDataReducer, null);

    useEffect(() => {
        (async () => {
            let validatedUser = await generalGetRequest(VALIDATE_USER)
            if (validatedUser) {
                userDataDispatch({ type: FETCH_USER_DATA, payload: { ...validatedUser } });
            } else {
                userDataDispatch({ type: FETCH_USER_DATA, payload: null });
            }
        })();
    }, []);

    return (
        <UserDataContext.Provider value={{ userData, userDataDispatch }} >
            {props.children}
        </UserDataContext.Provider>
    )
}

export default UserDataContextProvider