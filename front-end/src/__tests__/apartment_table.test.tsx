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
    city: 'Auburn',
    max_rent: 800,
    max_sqft: 1000.0,
    property_id: '35erbsf',
    property_name: '343 S Gay St',
    property_type: 'condo',
    rating: 0.0,
    state: 'AL',
    transit_score: 0,
    walk_score: 62,

    id: '35erbsf',
  },
  {
    city: 'Burlington',
    max_rent: 1100,
    max_sqft: 220.0,
    property_id: 'sqj5kb7',
    property_name: '161 S Prospect St',
    property_type: 'condo',
    rating: 0.0,
    state: 'VT',
    transit_score: 47,
    walk_score: 77,

    id: 'sqj5kb7',
  },
  {
    city: 'Tempe',
    max_rent: 1350,
    max_sqft: 840.0,
    property_id: 'z7hmtvy',
    property_name: '700 W University Dr',
    property_type: 'condo',
    rating: 0.0,
    state: 'AZ',
    transit_score: 59,
    walk_score: 83,

    id: 'z7hmtvy',
  },
];
const NUM_COLUMNS = 5;

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/housing',
  }),
}));

describe('Apartment Table Test Suite', () => {
  it('snapshot test', () => {
    const snap = shallow(<ApartmentTable rows={EXAMPLE_ROWS} />);
    expect(snap).toMatchSnapshot();
  });

  it('page displays cur page and total', () => {
    render(<ApartmentTable rows={EXAMPLE_ROWS} />);
    const textElement = screen.getByText('Showing items 1 - 3 of 3.');
    expect(textElement).toBeInTheDocument();
  });

  it('links have correct href', () => {
    render(
      <MemoryRouter initialEntries={['/housing']}>
        <ApartmentTable rows={EXAMPLE_ROWS} />
      </MemoryRouter>,
    );

    const aptLink1 = screen.getByRole('link', {
      name: /343 S Gay St/i,
    });
    expect(aptLink1).not.toBeNull();
    expect(aptLink1.getAttribute('href')).toBe('/housing/35erbsf');

    const aptLink2 = screen.getByRole('link', {
      name: /161 S Prospect St/i,
    });
    expect(aptLink2).not.toBeNull();
    expect(aptLink2.getAttribute('href')).toBe('/housing/sqj5kb7');

    const aptLink3 = screen.getByRole('link', {
      name: /700 W University Dr/i,
    });
    expect(aptLink3).not.toBeNull();
    expect(aptLink3.getAttribute('href')).toBe('/housing/z7hmtvy');
  });

  // Only tests property name
  // it's too much code to test all five columns...
  it('sort function works', () => {
    render(<ApartmentTable rows={EXAMPLE_ROWS} />);

    let tableBody = screen.getByRole('table')?.children[1];
    expect(tableBody).not.toBeNull();
    expect(tableBody.childElementCount).toBe(EXAMPLE_ROWS.length);
    for (let i = 0; i < EXAMPLE_ROWS.length; i++) {
      const row = tableBody.children[i];
      expect(row).not.toBeNull();
      expect(row.childElementCount).toBe(NUM_COLUMNS);
      expect(row.children[0].textContent).toEqual(
        EXAMPLE_ROWS[i].property_name,
      );
    }

    const thead = screen.getByRole('columnheader', {
      name: 'Property Name',
    });
    expect(thead).not.toBeNull();

    fireEvent.click(thead);
    tableBody = screen.getByRole('table')?.children[1];
    expect(tableBody).not.toBeNull();
    expect(tableBody.childElementCount).toBe(EXAMPLE_ROWS.length);
    const sortedRows = EXAMPLE_ROWS.sort((a, b) =>
      a.property_name.localeCompare(b.property_name),
    );
    for (let i = 0; i < EXAMPLE_ROWS.length; i++) {
      const row = tableBody.children[i];
      expect(row).not.toBeNull();
      expect(row.childElementCount).toBe(NUM_COLUMNS);
      expect(row.children[0].textContent).toEqual(
        sortedRows[i].property_name,
      );
    }

    fireEvent.click(thead);
    tableBody = screen.getByRole('table')?.children[1];
    expect(tableBody).not.toBeNull();
    expect(tableBody.childElementCount).toBe(EXAMPLE_ROWS.length);
    sortedRows.reverse();
    for (let i = 0; i < EXAMPLE_ROWS.length; i++) {
      const row = tableBody.children[i];
      expect(row).not.toBeNull();
      expect(row.childElementCount).toBe(NUM_COLUMNS);
      expect(row.children[0].textContent).toEqual(
        sortedRows[i].property_name,
      );
    }

    fireEvent.click(thead);
    tableBody = screen.getByRole('table')?.children[1];
    expect(tableBody).not.toBeNull();
    expect(tableBody.childElementCount).toBe(EXAMPLE_ROWS.length);
    for (let i = 0; i < EXAMPLE_ROWS.length; i++) {
      const row = tableBody.children[i];
      expect(row).not.toBeNull();
      expect(row.childElementCount).toBe(NUM_COLUMNS);
      expect(row.children[0].textContent).toEqual(
        EXAMPLE_ROWS[i].property_name,
      );
    }
  });

  it('pagination works', () => {
    const rows = [];
    for (let i = 0; i < 25; i++) {
      rows.push(EXAMPLE_ROWS[0]);
    }
    render(<ApartmentTable rows={rows} />);

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

    let textElement = screen.getByText('Showing items 1 - 11 of 25.');
    expect(textElement).toBeInTheDocument();

    fireEvent.click(nextBtn);
    textElement = screen.getByText('Showing items 11 - 21 of 25.');
    expect(textElement).toBeInTheDocument();

    fireEvent.click(lastBtn);
    textElement = screen.getByText('Showing items 21 - 25 of 25.');
    expect(textElement).toBeInTheDocument();

    fireEvent.click(prevBtn);
    textElement = screen.getByText('Showing items 11 - 21 of 25.');
    expect(textElement).toBeInTheDocument();

    fireEvent.click(firstBtn);
    textElement = screen.getByText('Showing items 1 - 11 of 25.');
    expect(textElement).toBeInTheDocument();
  });
});
