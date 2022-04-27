import React, { useEffect, useState } from 'react';
import { Fieldset } from 'primereact/fieldset';
import { Button } from 'primereact/button';

import { config } from '../config';
import axios from 'axios';

export function WelcomingPage(props: any) {
  const [message, setMessage] = useState(props.message);
  const [organization, setOrganization] = useState(props.organization);
  
  useEffect(() => {
    if (!message) {
      axios.get(`${config.apiRoot}/app?message=Welcome to a full stack app ...`)
        .then((response: any) => {
          setMessage(response.data);
        })
        .catch((error) => {
          setMessage(`The server errored ${JSON.stringify(error)}`);
          console.error(error);
        });
    }
    if (!organization) {
      axios.get(`${config.apiRoot}/organization?name=GreenEZ Mowing&type=landscaping`)
        .then((response: any) => {
          setOrganization(response.data);
        })
        .catch((error) => {
          setOrganization(`The server errored ${JSON.stringify(error)}`);
          console.error(error);
        });
    }
  })

  
  return (
    <>
      <div data-testid="welcoming-container" className="welcoming-container">
        <header>
          <p>
          {config.version} header
          </p>
        </header>
        <h1>
          {message}
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
