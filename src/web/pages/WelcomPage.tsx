import React, { useEffect, useState } from 'react';  
import { Redirect, Route, Switch, useHistory, useRouteMatch, withRouter } from 'react-router-dom';


import App from '../App';
import { tap } from 'rxjs/operators';
import axios from 'axios';
import { config } from '../config';

export function WelcomingPage(props) {
  const [message, setMessage] = useState('')
  
  useEffect(() => {
    if (!message) {
      axios.get(`${config.apiRoot}/app?message=Welcome to a working full stack app`)
        .then((response: any) => {
          setMessage(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  })

  
  return (
    <div className="welcoming-container">
      <h1>
        {message || 'Welcome to the client app'}
      </h1>
      <footer>
        <p>footer</p>
      </footer>
    </div>
  )
}

export default WelcomingPage;
