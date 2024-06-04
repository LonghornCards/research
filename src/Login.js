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
                            {/* Sign Out Button */}
                            <button
                                onClick={signOut}
                                style={{
                                    margin: '20px',
                                    fontSize: '0.8rem',
                                    padding: '5px 10px',
                                    marginTop: '20px'
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
