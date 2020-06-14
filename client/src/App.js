//dependencies
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
//components
import Auth from './components/layouts/Auth/Auth';
import MainController from './components/layouts/MainController/MainController';
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


