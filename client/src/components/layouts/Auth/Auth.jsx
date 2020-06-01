import React, { useState } from 'react';
import Flipper from './parts/Flipper';
import AuthForm from './parts/AuthForm';

const Auth = () => {
    const [authState, setAuthState] = useState(true);
    return (
        <div className="auth-page">
            <div className="auth-page__placeholder">
                <Flipper
                    authState={authState}
                    toggleAuthState={setAuthState}
                />
            </div>

            <section className="auth-page__content">
                <AuthForm authState={authState} />
            </section>
        </div>
    )
}

export default Auth
