import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import FilterPopover from '../components/FilterPopover/FilterPopover';

import { popoverOptions as housingOptions } from '../components/ApartmentTable/ApartmentTable';
import { popoverOptions as amenityOptions } from '../components/EntertainmentTable/EntertainmentTable';
import { popoverOptions as univOptions } from '../views/Universities/UniversitiesPage';

configure({ adapter: new Adapter() });

const openPopover = async () => {
  const popoverBtn = screen.getByRole('button');
  expect(popoverBtn).not.toBeNull();
  await act(async () => {
    fireEvent.click(popoverBtn);
  });
};

describe('Filter Popover Test Suite', () => {
  it('snapshot test: housing options', () => {
    const snap = shallow(
      <FilterPopover
        options={housingOptions}
        setFilter={() => {
          return;
        }}
      />,
    );
    expect(snap).toMatchSnapshot();
  });

  it('snapshot test: amenity options', () => {
    const snap = shallow(
      <FilterPopover
        options={amenityOptions}
        setFilter={() => {
          return;
        }}
      />,
    );
    expect(snap).toMatchSnapshot();
  });

  it('snapshot test: university options', () => {
    const snap = shallow(
      <FilterPopover
        options={univOptions}
        setFilter={() => {
          return;
        }}
      />,
    );
    expect(snap).toMatchSnapshot();
  });

  it('button opens popover', async () => {
    render(
      <FilterPopover
        options={[]}
        setFilter={() => {
          return;
        }}
      />,
    );
    await openPopover();
    expect(screen.getByText('Filter Options')).toBeInTheDocument();
  });

  it('input test: basic string', async () => {
    const options = [
      {
        header: 'Basic String',
        key: 'key',
        inputValues: [
          {
            displayStr: 'Placeholder Text',
          },
        ],
      },
    ];

    let s = '';
    render(
      <FilterPopover
        setFilter={(value: string) => {
          s = value;
        }}
        options={options}
      />,
    );

    await openPopover();
    const textInput = screen.getByRole('textbox') as HTMLInputElement;
    expect(textInput).not.toBeNull();

    const applyButton = screen.getByRole('button', { name: 'Close' });
    expect(applyButton).not.toBeNull();

    fireEvent.change(textInput, { target: { value: 'value' } });
    fireEvent.click(applyButton);

    expect(s).toEqual('&key=value');
  });
});
