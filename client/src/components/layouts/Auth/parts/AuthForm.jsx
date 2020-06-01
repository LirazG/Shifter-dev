import React, { useState, useContext } from 'react';
import Cookies from 'js-cookie';
import CustomInput from '../../../globals/formComponents/CustomInput';
import { generalPostRequest } from '../../../../functions/api';
import { AUTH_COOKIE } from '../../../../config/keys';
import { AUTH_ROUTES_REGISTER, AUTH_ROUTES_LOGIN } from '../../../../config/routes';
import { UserDataContext } from '../../../../contexts/UserDataContext';
import { FETCH_USER_DATA } from '../../../../reducers/userDataReducer';

const registerFormFieldsData = [
    {
        name: 'fullName',
        placeholder: 'full name'
    },
    {
        name: 'email',
        placeholder: 'email'
    },
    {
        name: 'password',
        placeholder: 'password',
        type: 'password'
    },
    {
        name: 'passwordConfirmation',
        placeholder: 'password confirmation',
        type: 'password'
    }
];

const loginFormFieldsData = [
    {
        name: 'email',
        placeholder: 'email'
    },
    {
        name: 'password',
        placeholder: 'password',
        type: 'password'
    }
];

const initialRegisterData = {
    fullName: '',
    email: '',
    password: '',
    passwordConfirmation: ''
};

const initialLoginData = {
    email: '',
    password: ''
};


const AuthForm = (props) => {
    const { userData, userDataDispatch } = useContext(UserDataContext);

    const [registerFormData, setRegisterFormData] = useState(initialRegisterData);
    const [loginFormData, setLoginFormData] = useState(initialLoginData);

    const [registerFormErrors, setRegisterFormErrors] = useState(null);
    const [loginFormErrors, setLoginFormErrors] = useState(null);

    const registerChangeHandler = (name, value) => {
        setRegisterFormData({ ...registerFormData, [name]: value });
    };

    const loginChangeHandler = (name, value) => {
        setLoginFormData({ ...loginFormData, [name]: value });
    };

    const authFormSubmit = async (e) => {
        e.preventDefault();
        // check if login / register form is active
        if (!props.authState) {
            //register
            let registerRes = await generalPostRequest(AUTH_ROUTES_REGISTER, registerFormData);
            if (registerRes.data) {
                //set errors in state for display
                let errors = {}
                registerRes.data.errors.map(err => { errors[err.param] = err.msg })
                setRegisterFormErrors(errors);
                return;
            } else {
                setRegisterFormErrors(null);
            }

            Cookies.set(AUTH_COOKIE, registerRes.token, { expires: 7 });
            userDataDispatch({ type: FETCH_USER_DATA, payload: registerRes.userData });

        } else {
            //login
            let loginRes = await generalPostRequest(AUTH_ROUTES_LOGIN, loginFormData);
            if (loginRes.data) {
                //set errors in state for display
                let errors = {}
                loginRes.data.errors.map(err => { errors[err.param] = err.msg })
                setLoginFormErrors(errors);
                return;
            } else {
                setLoginFormErrors(null);
            }

            Cookies.set(AUTH_COOKIE, loginRes.token, { expires: 7 });
            userDataDispatch({ type: FETCH_USER_DATA, payload: loginRes.userData });
        }

    }

    const demoLogin = async () => {
        let demoCredentials = {
            email: 'demo@gmail.com',
            password: '111111'
        };
        let loginRes = await generalPostRequest(AUTH_ROUTES_LOGIN, demoCredentials);
        Cookies.set(AUTH_COOKIE, loginRes.token, { expires: 7 });
        userDataDispatch({ type: FETCH_USER_DATA, payload: loginRes.userData });
    }

    return (
        <form className="auth-page__form" onSubmit={authFormSubmit}>
            <div className={!props.authState ? "auth-page__form__wrapper auth-page__form__wrapper--active" : "auth-page__form__wrapper"}>
                <h1>Create Free Account</h1>
                <div className="auth-page__form__wrapper__group">
                    <figure></figure>
                </div>

                {registerFormFieldsData.map(data =>
                    <div className="auth-page__form__wrapper__group">
                        <CustomInput {...data} onChange={registerChangeHandler} value={registerFormData[data.name]} />
                        <p className="auth-page__form__wrapper__group__error">
                            {registerFormErrors && registerFormErrors[data.name] ? registerFormErrors[data.name] : null}
                        </p>
                    </div>
                )}

                <button><span>sign up</span></button>
            </div>

            <div className={props.authState ? "auth-page__form__wrapper auth-page__form__wrapper--active" : "auth-page__form__wrapper"}>
                <h1>Login to Your Account</h1>
                <div className="auth-page__form__wrapper__group">
                    <figure></figure>
                </div>

                {loginFormFieldsData.map(data =>
                    <div className="auth-page__form__wrapper__group">
                        <CustomInput {...data} onChange={loginChangeHandler} value={loginFormData[data.name]} />
                        <p className="auth-page__form__wrapper__group__error">
                            {loginFormErrors && loginFormErrors[data.name] ? loginFormErrors[data.name] : null}
                        </p>
                    </div>
                )}

                <button><span>sign in</span></button>

                <p className="auth-page__form__wrapper__demo-login" onClick={demoLogin}>Take a tour with demo user here!</p>
            </div>

        </form>
    )
}

export default AuthForm
