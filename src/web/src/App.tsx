import React from 'react';
// import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Amplify from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import { config } from './config';
// import WelcomingPage from './pages/WelcomingPage';

import './App.scss';
import Signup from './pages/Signup';
// userPoolName: process.env.REACT_APP_COGNITO_USERPOOL_NAME,
// userPoolClientName: process.env.REACT_APP_COGNITO_USERPOOL_CLIENT_NAME,
// region:
function App ({ signOut, user }) {
  Amplify.configure({
    Auth: {
      mandatorySignIn: true,
      region: config.cognito.region,
      userPoolId: config.cognito.userPoolName,
      // identityPoolId: config.cognito.IDENTITY_POOL_ID,
      userPoolWebClientId: config.cognito.userPoolClientName
    }
  });
  // return (
  //   <>
  //     <span data-testid="author" className="author">Jeremy Wells</span>
  //     <BrowserRouter basename={config.baseHref}>
  //       <Routes>
  //         <Route path="/signup" element={< Signup />} />
  //         {/* <Route path="/signin" element={< Login />} /> */}
  //         {/* <Route path="/confirmation" element={< Confirmation />} /> */}
  //         <Route path="/" element={<Navigate to="/welcome" replace />} />
  //         <Route path="/welcome" element={ < WelcomingPage /> } />
  //         <Route path="*" element={<Navigate to="/" replace />} />
  //       </Routes>
  //     </BrowserRouter>
  //   </>
  // );

  return (
    <>
      <h1>Hello {user.username}</h1>
      <button onClick={signOut}>Sign out</button>
    </>
  );

}

export default withAuthenticator(App);
