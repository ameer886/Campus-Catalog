import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router-dom';

import type { EntertainmentRowType } from '../views/Entertainments/EntertainmentsPage';
import EntertainmentTable from '../components/EntertainmentTable/EntertainmentTable';

configure({ adapter: new Adapter() });

const EXAMPLE_ROWS: Array<EntertainmentRowType> = [
  {
    amen_id: 621884499,
    amen_name: 'Pinballz Arcade',
    city: 'Austin',
    deliver: false,
    num_review: 516,
    pricing: 'N/A',
    rating: 4.5,
    state: 'TX',
    takeout: false,

    id: 621884499,
  },
  {
    amen_id: 485770102,
    amen_name: 'Blue Starlite Mini Urban Drive-In',
    city: 'Austin',
    deliver: false,
    num_review: 149,
    pricing: 'N/A',
    rating: 4.5,
    state: 'TX',
    takeout: false,

    id: 485770102,
  },
  {
    amen_id: 462165312,
    amen_name: 'Elephant Room',
    city: 'Austin',
    deliver: false,
    num_review: 431,
    pricing: '$$',
    rating: 4.0,
    state: 'TX',
    takeout: false,

    id: 462165312,
  },
];

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/amenities',
  }),
}));

describe('Amenity Table Test Suite', () => {
  it('snapshot test', () => {
    const snap = shallow(
      <EntertainmentTable testRows={EXAMPLE_ROWS} />,
    );
    expect(snap).toMatchSnapshot();
  });

  it('page displays cur page and total', () => {
    render(<EntertainmentTable testRows={EXAMPLE_ROWS} />);
    const textElement = screen.getByText('Showing items 1 - 3 of 3.');
    expect(textElement).toBeInTheDocument();
  });

  it('links have correct href', () => {
    render(
      <MemoryRouter initialEntries={['/housing']}>
        <EntertainmentTable testRows={EXAMPLE_ROWS} />
      </MemoryRouter>,
    );

    for (let i = 0; i < EXAMPLE_ROWS.length; i++) {
      const aptLink = screen.getByRole('link', {
        name: EXAMPLE_ROWS[i].amen_name,
      });
      expect(aptLink).not.toBeNull();
      expect(aptLink.getAttribute('href')).toBe(
        `/amenities/${EXAMPLE_ROWS[i].id}`,
      );
    }
  });

  it('pagination works', () => {
    const rows = [];
    for (let i = 0; i < 25; i++) {
      rows.push(EXAMPLE_ROWS[0]);
    }
    render(<EntertainmentTable testRows={rows} />);

    const firstBtn = screen.getByRole('button', {
      name: 'first',
    });
    expect(firstBtn).not.toBeNull();
    const prevBtn = screen.getByRole('button', {
      name: 'prev',
    });
    expect(prevBtn).not.toBeNull();
    const nextBtn = screen.getByRole('button', {
      name: 'next',
    });
    expect(nextBtn).not.toBeNull();
    const lastBtn = screen.getByRole('button', {
      name: 'last',
    });
    expect(lastBtn).not.toBeNull();

    let textElement = screen.getByText('Showing items 1 - 10 of 25.');
    expect(textElement).toBeInTheDocument();
    expect(firstBtn).toBeDisabled();
    expect(prevBtn).toBeDisabled();

    let tbody = screen.getByRole('table').children[1];
    expect(tbody.childElementCount).toEqual(10);

    expect(nextBtn).not.toBeDisabled();
    fireEvent.click(nextBtn);
    textElement = screen.getByText('Showing items 11 - 20 of 25.');
    expect(textElement).toBeInTheDocument();

    expect(lastBtn).not.toBeDisabled();
    fireEvent.click(lastBtn);
    textElement = screen.getByText('Showing items 21 - 25 of 25.');
    expect(textElement).toBeInTheDocument();
    expect(nextBtn).toBeDisabled();
    expect(lastBtn).toBeDisabled();

    tbody = screen.getByRole('table').children[1];
    expect(tbody.childElementCount).toEqual(5);

    expect(prevBtn).not.toBeDisabled();
    fireEvent.click(prevBtn);
    textElement = screen.getByText('Showing items 11 - 20 of 25.');
    expect(textElement).toBeInTheDocument();

    expect(firstBtn).not.toBeDisabled();
    fireEvent.click(firstBtn);
    textElement = screen.getByText('Showing items 1 - 10 of 25.');
    expect(textElement).toBeInTheDocument();
  });
});
