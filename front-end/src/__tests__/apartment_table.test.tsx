import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router-dom';

import type { ApartmentRowType } from '../views/Apartments/ApartmentsPage';
import ApartmentTable from '../components/ApartmentTable/ApartmentTable';

configure({ adapter: new Adapter() });

const EXAMPLE_ROWS: Array<ApartmentRowType> = [
  {
    bed: {
      min: 1,
      max: 2,
    },
    city: 'Auburn',
    property_id: '35erbsf',
    property_name: '343 S Gay St',
    property_type: 'condo',
    rating: 0.0,
    rent: {
      min: 0,
      max: 800,
    },
    state: 'AL',
    transit_score: 0,
    walk_score: 62,

    id: '35erbsf',
  },
  {
    bed: {
      min: 2,
      max: 2,
    },
    city: 'Burlington',
    property_id: 'sqj5kb7',
    property_name: '161 S Prospect St',
    property_type: 'condo',
    rating: 0.0,
    rent: {
      min: 999,
      max: 1100,
    },
    state: 'VT',
    transit_score: 47,
    walk_score: 77,

    id: 'sqj5kb7',
  },
  {
    bed: {
      min: 0,
      max: 4,
    },
    city: 'Tempe',
    property_id: 'z7hmtvy',
    property_name: '700 W University Dr',
    property_type: 'condo',
    rating: 0.0,
    rent: {
      min: 600,
      max: 1350,
    },
    state: 'AZ',
    transit_score: 59,
    walk_score: 83,

    id: 'z7hmtvy',
  },
];

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/housing',
  }),
}));

describe('Apartment Table Test Suite', () => {
  it('snapshot test', () => {
    const snap = shallow(<ApartmentTable testRows={EXAMPLE_ROWS} />);
    expect(snap).toMatchSnapshot();
  });

  it('page displays cur page and total', () => {
    render(<ApartmentTable testRows={EXAMPLE_ROWS} />);
    const textElement = screen.getByText('Showing items 1 - 3 of 3.');
    expect(textElement).toBeInTheDocument();
  });

  it('links have correct href', () => {
    render(
      <MemoryRouter initialEntries={['/housing']}>
        <ApartmentTable testRows={EXAMPLE_ROWS} />
      </MemoryRouter>,
    );

    for (let i = 0; i < EXAMPLE_ROWS.length; i++) {
      const aptLink = screen.getByRole('link', {
        name: EXAMPLE_ROWS[i].property_name,
      });
      expect(aptLink).not.toBeNull();
      expect(aptLink.getAttribute('href')).toBe(
        `/housing/${EXAMPLE_ROWS[i].id}`,
      );
    }
  });

  it('pagination works', () => {
    const rows = [];
    for (let i = 0; i < 25; i++) {
      rows.push(EXAMPLE_ROWS[0]);
    }
    render(<ApartmentTable testRows={rows} />);

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
