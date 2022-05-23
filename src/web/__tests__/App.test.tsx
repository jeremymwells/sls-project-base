import React from 'react';
import { render } from '@testing-library/react';

import App from '../src/App';

test('renders app with author', () => {
  const { getByTestId } = render(<App />);
  const span = getByTestId('author');
  expect(span).toBeDefined();
  expect(span.innerHTML).toBe('Jeremy Wells');
});
