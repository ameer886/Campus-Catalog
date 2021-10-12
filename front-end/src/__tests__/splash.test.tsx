import React from 'react';
import { render, screen } from '@testing-library/react';

import CampCatSplashPage from '../views/SplashPage/CampCatSplashPage';

describe('Splash Page Test Suite', () => {
  it('page displays title', () => {
    render(<CampCatSplashPage />);
    const textElement = screen.getByText(/Campus Catalog/i);
    expect(textElement).toBeInTheDocument();
  });
});
