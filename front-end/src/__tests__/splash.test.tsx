import React from 'react';
import { render, screen } from '@testing-library/react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import CampCatSplashPage from '../views/SplashPage/CampCatSplashPage';

configure({ adapter: new Adapter() });

describe('Splash Page Test Suite', () => {
  // Snapshot test makes sure output "looks" right
  // To update snapshot (ONLY AFTER INTENTIONAL CHANGE):
  // delete the corresponding .snap file under __snapshots__
  // then run yarn test again
  it('snapshot test', () => {
    const snap = shallow(<CampCatSplashPage />);
    expect(snap).toMatchSnapshot();
  });

  // Basic test to show how you might use elements
  it('page displays title', () => {
    render(<CampCatSplashPage />);
    const textElement = screen.getByText(/Campus Catalog/i);
    expect(textElement).toBeInTheDocument();
  });

  // You can also mock functions using jest.mock, but
  // it wasn't necessary for this suite. It might become
  // more necessary for the model pages.
});
