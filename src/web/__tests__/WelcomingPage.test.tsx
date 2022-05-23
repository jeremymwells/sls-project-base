import React from 'react';
import { render, act } from '@testing-library/react';

import WelcomingPage from '../src/pages/WelcomingPage';

const mockedAxios = getMockAxios();

const fakeFSResponse = { data: 'oh yes i did' };
const fakeOrganizationResponse = { data: [{
  addresses: [{
    zip: '00001',
    state: 'ST',
    address2: '',
    city: 'Townville',
    address1: '123 Street Ave'
  }],
  id: 'abcdefgh',
  searchName: 'greenez mowing',
  name: 'GreenEZ Mowing',
  type: 'landscaping'
}] };

describe('Welcoming page', () => {
  let elem, container, getByTestId, mockApi1, mockApi2;

  describe('Happy Path', () => {

    beforeEach(async () => {
      jest.resetAllMocks();
      mockedAxios.resetMatches();
      mockApi1 = mockedAxios.matchGet('/app?message', fakeFSResponse);
      mockApi2 = mockedAxios.matchGet('/organization', fakeOrganizationResponse);
    });

    const messages = [
      'Welcome to a full stack app ...',
      'Eat it. Just eat it. Get yourself an egg and beat it',
      'Locked and loaded'
    ];

    it.each(messages)('Displays welcome message from props: %s', async message => {
      await act(async () => {
        elem = render(<WelcomingPage message={message} />);
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

    it('Displays welcome message from server & record from DB', async () => {

      await act(async () => {
        elem = render(<WelcomingPage />);
        container = elem.container;
        getByTestId = elem.getByTestId;
      });

      const header = container.querySelector('header');
      const footer = container.querySelector('footer');
      const pageContainer = getByTestId('welcoming-container') as HTMLElement;

      expect(header).toBeDefined();
      expect(footer).toBeDefined();
      expect(pageContainer).toBeDefined();
      expect(pageContainer).toHaveTextContent(fakeFSResponse.data);
      expect(pageContainer).toHaveTextContent(fakeOrganizationResponse.data[0].id);
      expect(mockApi1).toHaveBeenCalled();
      expect(mockApi2).toHaveBeenCalled();
    });
  });

  describe('Sad Path', () => {

    const theError = { data: 'danger will robinson' };

    beforeEach(() => {
      jest.resetAllMocks();
      mockedAxios.resetMatches();
      mockedAxios.matchGet('/app?message', () => Promise.reject(theError));
    });

    it('Displays error message when no props and server call fails', async () => {
      console.error = jest.fn();
      await act(async () => {
        elem = render(<WelcomingPage organization={fakeOrganizationResponse} />);
        container = elem.container;
        getByTestId = elem.getByTestId;
      });

      const header = container.querySelector('header');
      const footer = container.querySelector('footer');
      const pageContainer = getByTestId('welcoming-container');
      expect(console.error).toHaveBeenCalled();
      expect(header).toBeDefined();
      expect(footer).toBeDefined();
      expect(pageContainer).toBeDefined();
      expect(pageContainer).toHaveTextContent(theError.data);
    });

  });

});
