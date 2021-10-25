import React from 'react';
import { render, screen } from '@testing-library/react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router-dom';

import type { UniversityRowType } from '../views/Universities/UniversitiesPage';
import UniversityGrid from '../components/UniversityGrid/UniversityGrid';

configure({ adapter: new Adapter() });

const EXAMPLE_ROWS: Array<UniversityRowType> = [
  {
    acceptance_rate: 0.7366,
    avg_cost_attendance: 24495.0,
    city: 'Birmingham',
    ownership_id: 'Public',
    rank: 148,
    state: 'AL',
    tuition_in_st: 8568,
    tuition_out_st: 20400,
    univ_id: '100663',
    univ_name: 'University of Alabama at Birmingham',

    id: '100663',
  },
  {
    acceptance_rate: 0.3182,
    avg_cost_attendance: 26254.0,
    city: 'Austin',
    ownership_id: 'Public',
    rank: 38,
    state: 'TX',
    tuition_in_st: 10824,
    tuition_out_st: 38326,
    univ_id: '228778',
    univ_name: 'The University of Texas at Austin',

    id: '228778',
  },
  {
    acceptance_rate: 0.0464,
    avg_cost_attendance: 73485.0,
    city: 'Cambridge',
    ownership_id: 'Private Non-Profit',
    rank: 2,
    state: 'MA',
    tuition_in_st: 51925,
    tuition_out_st: 51925,
    univ_id: '166027',
    univ_name: 'Harvard University',

    id: '166027',
  },
];

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/universities',
  }),
}));

describe('University Grid Test Suite', () => {
  it('snapshot test', () => {
    const snap = shallow(<UniversityGrid cards={EXAMPLE_ROWS} />);
    expect(snap).toMatchSnapshot();
  });

  /*
   * Note: we cannot test the sorting here because it's tied to
   * the UniversitiesPage model page file. We'd have to mock the
   * axios backend to test that file, so for now the sorting will
   * have to go untested.
   */

  /*
   * Similarly, pagination is tied to the parent file so we won't
   * be able to test changing pages here
   */

  it('links have correct href', () => {
    render(
      <MemoryRouter initialEntries={['/amenities']}>
        <UniversityGrid cards={EXAMPLE_ROWS} />
      </MemoryRouter>,
    );

    for (let i = 0; i < EXAMPLE_ROWS.length; i++) {
      const aptLink = screen.getByRole('link', {
        name: EXAMPLE_ROWS[i].univ_name + ' link',
      });
      expect(aptLink).not.toBeNull();
      expect(aptLink.getAttribute('href')).toBe(
        `/universities/${EXAMPLE_ROWS[i].id}`,
      );
    }
  });
});
