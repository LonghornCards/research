// Login.js
import React from 'react';
import './App.css';
import { Amplify } from 'aws-amplify';
import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';  // Import useAuth

Amplify.configure(awsExports);

function Login() {
    const location = useLocation();
    const navigate = useNavigate();
    const { login, setUser } = useAuth();  // Use the login function from AuthContext

    const redirectTo = location.state?.from?.pathname || '/';

    return (
        <div className="App">
            <Authenticator initialState="signUp">
                {({ signOut, user }) => {
                    if (user) {
                        setUser(user);  // Set user details including sub
                        login();  // Call login when user is authenticated
                        navigate(redirectTo);
                    }
                    return (
                        <main className="auth-container">
                            <header className='App-header'>
                                <h1>Welcome to Longhorn Cards, {user ? user.username : 'User'}!</h1>
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
                    );
                }}
            </Authenticator>
        </div>
    );
}

export default withAuthenticator(Login);
