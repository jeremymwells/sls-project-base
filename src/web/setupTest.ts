import axios from 'axios';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

jest.mock('axios');
Object.keys(axios).forEach((key) => { axios[key] = jest.fn().mockResolvedValue({then: () => undefined}) });

(global as any).getMockAxios = () => {
  jest.resetAllMocks();
  jest.mock('axios');
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  let responses = {};

  const mockResponseHandler = (method, matchUrl, response) => {
    responses[matchUrl] = response;
    return mockedAxios[method].mockImplementation((url) => {
      const foundKeys = Object.keys(responses).filter((k) => url.includes(k));
      if (foundKeys.length && foundKeys.length === 1) {
        if (typeof response === 'function') {
          return responses[foundKeys[0]]();
        }
        return Promise.resolve(responses[foundKeys[0]]);
      } else if (foundKeys.length > 1) {
        throw new Error('You have multiple urls');
      } else {
        return Promise.resolve()
      }
    });
  };

  return {
    ...mockedAxios,
    resetMatches: () => {
      responses = {};
    },
    matchGet: (urlToMatch, response) => mockResponseHandler('get', urlToMatch, response),
    matchPost: (urlToMatch, response) => mockResponseHandler('post', urlToMatch, response),
    matchPut: (urlToMatch, response) => mockResponseHandler('put', urlToMatch, response),
  }
};