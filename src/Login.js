import React from 'react';
import './App.css';
import { Amplify } from 'aws-amplify';
import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';

Amplify.configure(awsExports);

function Login() {
    return (
        <div className="App">
            <Authenticator>
                {({ signOut, user }) => (
                    <main className="auth-container">
                        <header className='App-header'>
                            <h1>Welcome, {user ? user.username : 'Guest'}</h1>
                            <button
                                onClick={() => {
                                    signOut();
                                    window.location.href = '/'; // Redirect to home page
                                }}
                                className="signout-button"
                            >
                                Sign Out
                            </button>
                        </header>
                    </main>
                )}
            </Authenticator>
        </div>
    );
}

export default withAuthenticator(Login);
