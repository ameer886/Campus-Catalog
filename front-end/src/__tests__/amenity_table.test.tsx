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
const NUM_COLUMNS = 6;

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/amenities',
  }),
}));

describe('Apartment Table Test Suite', () => {
  it('snapshot test', () => {
    const snap = shallow(<EntertainmentTable rows={EXAMPLE_ROWS} />);
    expect(snap).toMatchSnapshot();
  });

  it('page displays cur page and total', () => {
    render(<EntertainmentTable rows={EXAMPLE_ROWS} />);
    const textElement = screen.getByText('Showing items 1 - 3 of 3.');
    expect(textElement).toBeInTheDocument();
  });

  it('links have correct href', () => {
    render(
      <MemoryRouter initialEntries={['/housing']}>
        <EntertainmentTable rows={EXAMPLE_ROWS} />
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

  // Only tests amenity name
  // it's too much code to test all five columns...
  it('sort function works', () => {
    render(<EntertainmentTable rows={EXAMPLE_ROWS} />);

    let tableBody = screen.getByRole('table')?.children[1];
    expect(tableBody).not.toBeNull();
    expect(tableBody.childElementCount).toBe(EXAMPLE_ROWS.length);
    for (let i = 0; i < EXAMPLE_ROWS.length; i++) {
      const row = tableBody.children[i];
      expect(row).not.toBeNull();
      expect(row.childElementCount).toBe(NUM_COLUMNS);
      expect(row.children[0].textContent).toEqual(
        EXAMPLE_ROWS[i].amen_name,
      );
    }

    const thead = screen.getByRole('columnheader', {
      name: 'Amenity Name',
    });
    expect(thead).not.toBeNull();

    fireEvent.click(thead);
    tableBody = screen.getByRole('table')?.children[1];
    expect(tableBody).not.toBeNull();
    expect(tableBody.childElementCount).toBe(EXAMPLE_ROWS.length);
    const sortedRows = EXAMPLE_ROWS.sort((a, b) =>
      a.amen_name.localeCompare(b.amen_name),
    );
    for (let i = 0; i < EXAMPLE_ROWS.length; i++) {
      const row = tableBody.children[i];
      expect(row).not.toBeNull();
      expect(row.childElementCount).toBe(NUM_COLUMNS);
      expect(row.children[0].textContent).toEqual(
        sortedRows[i].amen_name,
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
        sortedRows[i].amen_name,
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
        EXAMPLE_ROWS[i].amen_name,
      );
    }
  });

  it('pagination works', () => {
    const rows = [];
    for (let i = 0; i < 25; i++) {
      rows.push(EXAMPLE_ROWS[0]);
    }
    render(<EntertainmentTable rows={rows} />);

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

    fireEvent.click(nextBtn);
    textElement = screen.getByText('Showing items 11 - 20 of 25.');
    expect(textElement).toBeInTheDocument();

    fireEvent.click(lastBtn);
    textElement = screen.getByText('Showing items 21 - 25 of 25.');
    expect(textElement).toBeInTheDocument();

    fireEvent.click(prevBtn);
    textElement = screen.getByText('Showing items 11 - 20 of 25.');
    expect(textElement).toBeInTheDocument();

    fireEvent.click(firstBtn);
    textElement = screen.getByText('Showing items 1 - 10 of 25.');
    expect(textElement).toBeInTheDocument();
  });
});
