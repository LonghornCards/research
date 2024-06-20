// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRouter from './AppRouter';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import { AuthProvider } from './AuthContext';  // Import AuthProvider

Amplify.configure(awsExports);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AuthProvider>  {/* Wrap with AuthProvider */}
            <AppRouter />
        </AuthProvider>
    </React.StrictMode>
);

reportWebVitals();
