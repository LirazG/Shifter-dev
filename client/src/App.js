//dependencies
import React, { useEffect, useState, useContext, useReducer, createContext } from 'react';
import Cookies from 'js-cookie';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
//components
import Auth from './components/layouts/Auth/Auth';
import MainController from './components/layouts/MainController/MainController';
//keys
import { AUTH_COOKIE } from './config/keys';
//routes
import { VALIDATE_USER } from './config/routes';
//api
import { generalGetRequest } from './functions/api';
//context 
import UserDataContextProvider, { UserDataContext } from './contexts/UserDataContext';
import ShiftConfigurationContext from './contexts/ShiftConfigurationContext';

const App = () => {
    return (
        <Router>
            <UserDataContextProvider>
                <UserDataContext.Consumer>{(context) => {
                    return context.userData == null ?
                        null :
                        context.userData._id ?
                            <ShiftConfigurationContext>
                                <Route path="/" component={MainController} />
                            </ShiftConfigurationContext>
                            :
                            <Route path="/" component={Auth} />
                }}
                </UserDataContext.Consumer>
            </UserDataContextProvider>
        </Router>
    );
}

export default App;


