import React, { useEffect, useState } from 'react';
import { Fieldset } from 'primereact/fieldset';
import { Button } from 'primereact/button';

import axios from 'axios';
import { config } from '../config';

export function WelcomingPage(_props: any) {
  const [message, setMessage] = useState('')
  
  useEffect(() => {
    if (!message) {
      axios.get(`${config.apiRoot}/app?message=Welcome to a working full stack app ...`)
        .then((response: any) => {
          setMessage(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  })

  
  return (
    <>
      <div className="welcoming-container">
        <header>
          <p>
            header
          </p>
        </header>
        <h1>
          {message || 'Welcome to the client app...'}
        </h1>
        <div className="inner-container">
          <h2>
            Some Stuff:
          </h2>
          <Fieldset legend="Header">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </Fieldset>
          <div className="submit-row">
            <Button label="Got it!" icon="pi pi-check" className="p-button-lg"/>
          </div>
        </div>
        <footer>
          <p>
            footer
          </p>
        </footer>
      </div>
    </>
  )
}

export default WelcomingPage;
