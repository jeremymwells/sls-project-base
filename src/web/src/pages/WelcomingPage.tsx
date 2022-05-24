import React, { useEffect, useState } from 'react';
import { Fieldset } from 'primereact/fieldset';
import { Button } from 'primereact/button';
import axios from 'axios';

import { config } from '../config';


export function WelcomingPage(props: any) {
  const [message, setMessage] = useState(props.message || '');
  const [organization, setOrganization] = useState(props.organization || '');
  const [header, setHeader] = useState(props.header || '');

  useEffect(() => {
    if (!message) {
      axios.get(`/app?message=Welcome to a full stack app ...`)
        .then((response: any) => {
          setMessage(response.data);
        })
        .catch((error) => {
          setMessage(`The server errored ${JSON.stringify(error)}`);
          console.error(error);
        });
    }
    if (!organization) {
      axios.get(`/organization?orgId=1652913832318`)
        .then((response: any) => {
          setOrganization(response.data);
          setHeader(response.data.name);
        })
        .catch((error) => {
          setOrganization(`The server errored ${JSON.stringify(error)}`);
          console.error(error);
        })
    }
  });

  const getOrganization = () => {
    if (organization && organization.type) {
      return (
        <ul>
          <li>
            type (partition key): <b>{ organization.type }</b>
          </li>
          <li>
            searchName (sort key): <b>{ organization.searchName }</b>
          </li>
          <li>
            address: <b>
              { 
                [
                  `${organization.addresses[0].address1},`,
                  organization.addresses[0].city,
                  organization.addresses[0].state,
                  organization.addresses[0].zip,
                ].join(' ')
              }
            </b>
          </li>
          <li>
            full record:
            <pre>
              {JSON.stringify(organization, null, 4)}
            </pre>
          </li>
        </ul>
      );
    } else if (typeof organization === 'string') {
      return (
        <p>
          { organization }
        </p>
      );
    } else {
      return (
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
          cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      );
    }
  }

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
            { organization ? 'A db record:' : 'Some Stuff' }
          </h2>
          <Fieldset legend={header || 'Header'}>
            {getOrganization()}
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
