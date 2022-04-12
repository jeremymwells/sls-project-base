import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const { getByTestId } = render(<App />);
  const span = getByTestId('author');
  expect(span).toBeDefined();
  expect(span.innerHTML).toBe('Jeremy Wells');
});
