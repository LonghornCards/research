import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRouter from './AppRouter';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import { AuthProvider } from './AuthContext';  // Import AuthProvider
import Modal from 'react-modal';  // Import Modal from react-modal

Amplify.configure(awsExports);

// Set the app element for react-modal to improve accessibility
Modal.setAppElement('#root');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AuthProvider>  {/* Wrap with AuthProvider */}
            <AppRouter />
        </AuthProvider>
    </React.StrictMode>
);

reportWebVitals();
