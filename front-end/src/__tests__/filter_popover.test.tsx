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

  /*
  it('input test: basic string', () => {
    let s = '';
    const setS = (value: React.SetStateAction<string>) => {
      s = value.toString();
    };
    render(
      <FilterPopover
        setFilter={setS}
        options={[
          {
            header: 'Basic String',
            key: 'key',
            inputValues: [
              {
                displayStr: 'Placeholder Text',
              },
            ],
          },
        ]}
      />,
    );

    openPopover();
    const textInput = screen.getByRole('textbox') as HTMLInputElement;
    expect(textInput).not.toBeNull();

    const applyButton = screen.getByRole('button', { name: 'Close' });
    expect(applyButton).not.toBeNull();

    textInput.value = 'value';
    fireEvent.click(applyButton);

    expect(s).toEqual('test input');
  });
  */
});
