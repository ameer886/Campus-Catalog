import React from 'react';
import { render, screen } from '@testing-library/react';
import CampCatSplashPage from './views/SplashPage/CampCatSplashPage';
import EntertainmentsPage from './views/Entertainments/EntertainmentsPage';

test('renders basic text in splash', () => {
  render(<CampCatSplashPage />);
  const textElement = screen.getByText(/Hello World!/i);
  expect(textElement).toBeInTheDocument();
});

