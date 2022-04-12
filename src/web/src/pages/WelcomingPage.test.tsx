import React from 'react';
import { render, act } from '@testing-library/react';
import WelcomingPage from './WelcomingPage';
import axios from 'axios';

describe('Welcoming page', () => {

  // let axiosMock = new MockAdapter(config.http);
  // jest.mock('axios');


  let elem, container, getByTestId;
  const fakeResponse = { data: 'oh yes i did' };
  beforeEach(async () => {
    axios.get = jest.fn().mockImplementation(() => Promise.resolve(fakeResponse));
  });
  
  const messages = [
    'Welcome to a full stack app ...',
    'Eat it. Just eat it. Get yourself an egg and beat it',
    'Locked and loaded'
  ];

  it.each(messages)(`Displays welcome message from props: %s`, async (message) => {
    await act(async () => {
      elem = message ? render(<WelcomingPage message={message} />): render(<WelcomingPage />);
      container = elem.container;
      getByTestId = elem.getByTestId;
    });

    const header = container.querySelector('header');
    const footer = container.querySelector('footer');
    const pageContainer = getByTestId('welcoming-container');
    expect(header).toBeDefined();
    expect(footer).toBeDefined();
    expect(pageContainer).toBeDefined();
    expect(pageContainer).toHaveTextContent(message);
  });

  const errors = [
    'Welcome to a full stack app ...',
    'Eat it. Just eat it. Get yourself an egg and beat it',
    'Locked and loaded'
  ];

  it(`loads the page and fetches welcome message from server`, async () => {
    
    await act(async () => {
      elem = render(<WelcomingPage />);
      container = elem.container;
      getByTestId = elem.getByTestId;
    });
    const header = container.querySelector('header');
    const footer = container.querySelector('footer');
    const pageContainer = getByTestId('welcoming-container');

    expect(header).toBeDefined();
    expect(footer).toBeDefined();
    expect(pageContainer).toBeDefined();
    expect(pageContainer).toHaveTextContent(fakeResponse.data);
  });

  it(`shows default message when api call fails`, async () => {
    axios.get = jest.fn().mockImplementation(() => Promise.reject(fakeResponse));
    const cons = jest.spyOn(console, 'error').mockImplementation(() => {});
    await act(async () => {
      elem = render(<WelcomingPage message={''} />);
      container = elem.container;
      getByTestId = elem.getByTestId;
    });

    const header = container.querySelector('header');
    const footer = container.querySelector('footer');
    const pageContainer = getByTestId('welcoming-container');
    expect(cons).toHaveBeenCalled();
    expect(header).toBeDefined();
    expect(footer).toBeDefined();
    expect(pageContainer).toBeDefined();
    expect(pageContainer).toHaveTextContent(fakeResponse.data);
  });

});
