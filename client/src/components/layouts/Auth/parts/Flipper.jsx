import React from 'react'

const Flipper = (props) => {

    const toggleAuthState = () => {
        props.toggleAuthState(!props.authState)
    }

    return (
        <div className="auth-page__flipper">

            <figure className="auth-page__flipper__shape"></figure>
            <figure className="auth-page__flipper__shape"></figure>
            <figure className="auth-page__flipper__shape"></figure>

            <div className="auth-page__flipper__main-text">
                <div className={props.authState ? "auth-page__flipper__text-fade auth-page__flipper__text-fade--active" : "auth-page__flipper__text-fade"}>
                    <h1>already registered?</h1>
                    <p>
                        If you already have an account, just sign in. We've missed you!
                    </p>
                </div>

                <div className={!props.authState ? "auth-page__flipper__text-fade auth-page__flipper__text-fade--active" : "auth-page__flipper__text-fade"}>
                    <h1>first time with us?</h1>
                    <p>
                        Sign up to discover our free shift orginizer!
                    </p>
                </div>
            </div>


            <button onClick={toggleAuthState}>
                <span className={props.authState ? "auth-page__flipper__text-fade auth-page__flipper__text-fade--active" : "auth-page__flipper__text-fade"}>
                    sign in
                </span>
                <span className={!props.authState ? "auth-page__flipper__text-fade auth-page__flipper__text-fade--active" : "auth-page__flipper__text-fade"}>
                    sign up
                </span>
            </button>
        </div >
    )
}

export default Flipper
