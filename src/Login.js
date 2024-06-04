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
                    <main>
                        <header className='App-header'>
                            <h1>Welcome, {user ? user.username : 'Guest'}</h1>
                            {/* Modern Sign Out Button */}
                            <button
                                onClick={() => {
                                    signOut();
                                    window.location.href = '/'; // Redirect to home page
                                }}
                                style={{
                                    margin: '20px',
                                    fontSize: '1rem',
                                    padding: '10px 20px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.3s'
                                }}
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
