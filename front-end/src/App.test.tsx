import React from 'react';
import { render, screen } from '@testing-library/react';
import CampCatSplashPage from './views/SplashPage/CampCatSplashPage';

test('renders basic text', () => {
  render(<CampCatSplashPage />);
  const textElement = screen.getByText(/Hello World!/i);
  expect(textElement).toBeInTheDocument();
});
