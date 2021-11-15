import React from 'react';

import {
  render,
  screen,
  fireEvent,
  cleanup,
} from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import type { FilterPopoverOption } from '../components/FilterPopover/FilterPopover';

import FilterPopover from '../components/FilterPopover/FilterPopover';

import { popoverOptions as housingOptions } from '../components/ApartmentTable/ApartmentTable';
import { popoverOptions as amenityOptions } from '../components/EntertainmentTable/EntertainmentTable';
import { popoverOptions as univOptions } from '../views/Universities/UniversitiesPage';

configure({ adapter: new Adapter() });

const openPopover = async () => {
  const popoverBtn = screen.getByRole('button', { name: 'Show' });
  expect(popoverBtn).not.toBeNull();
  await act(async () => {
    fireEvent.click(popoverBtn);
  });
};

const clickApply = async () => {
  const applyBtn = screen.getByRole('button', { name: 'Close' });
  expect(applyBtn).not.toBeNull();
  await act(async () => {
    fireEvent.click(applyBtn);
  });

  // Okay for some bizarre reason, clicking the document or apply button
  // doesn't actually close the popover (something to do with Jest?) but
  // clicking the popover button will 'toggle' the popover.
  // Hence this wack click.
  await openPopover();
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

  it('popover closes on apply', async () => {
    render(
      <FilterPopover
        options={[]}
        setFilter={() => {
          return;
        }}
      />,
    );
    await openPopover();
    await clickApply();

    expect(
      screen.queryByText('Filter Options'),
    ).not.toBeInTheDocument();
  });

  it('input test: basic string', async () => {
    const options: FilterPopoverOption[] = [
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
    let textInput = screen.getByRole('textbox') as HTMLInputElement;
    expect(textInput).not.toBeNull();

    fireEvent.change(textInput, { target: { value: 'value' } });
    await clickApply();

    expect(s).toEqual('&key=value');

    // Value should persist if we open it again!
    cleanup();
    render(
      <FilterPopover
        setFilter={(value: string) => {
          s = value;
        }}
        options={options}
      />,
    );
    await openPopover();
    textInput = screen.getByRole('textbox') as HTMLInputElement;
    expect(textInput.value).toEqual('value');
  });

  it('clean func works', async () => {
    const options: FilterPopoverOption[] = [
      {
        header: 'Basic String',
        key: 'key',
        inputValues: [
          {
            displayStr: 'Placeholder Text',
            cleanFunc: (s) => s.slice(0, 5),
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

    fireEvent.change(textInput, {
      target: { value: '0123456789abcdef' },
    });
    await clickApply();

    expect(s).toEqual('&key=01234');
  });

  it('input test: basic number', async () => {
    const min = 0;
    const max = 5;
    const options: FilterPopoverOption[] = [
      {
        header: 'Basic String',
        key: 'number',
        inputValues: [
          {
            displayStr: 'Placeholder Text',
            type: 'number',
            min: min,
            max: max,
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
    let textInput = screen.getByRole(
      'spinbutton',
    ) as HTMLInputElement;
    expect(textInput).not.toBeNull();

    fireEvent.change(textInput, { target: { value: '2' } });
    await clickApply();
    expect(s).toEqual('&number=2');

    // Value should persist if we render again!
    cleanup();
    render(
      <FilterPopover
        setFilter={(value: string) => {
          s = value;
        }}
        options={options}
      />,
    );
    await openPopover();
    textInput = screen.getByRole('spinbutton') as HTMLInputElement;
    expect(textInput.value).toEqual('2');

    // Max/min should also work
    expect(textInput.min).toEqual(min.toString());
    expect(textInput.max).toEqual(max.toString());
  });

  it('input test: min-max pair', async () => {
    const options: FilterPopoverOption[] = [
      {
        header: 'Basic String',
        key: 'number',
        inputValues: [
          {
            displayStr: 'min',
            type: 'number',
          },
          {
            displayStr: 'max',
            type: 'number',
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
    let textInput = screen.getAllByRole(
      'spinbutton',
    ) as HTMLInputElement[];
    expect(textInput).not.toBeNull();
    expect(textInput).toHaveLength(2);

    // LHS works
    fireEvent.change(textInput[0], { target: { value: '2' } });
    await clickApply();
    expect(s).toEqual('&min_number=2');

    // Note: we could test RHS alone here but that would require
    // way more processing than it's worth (i.e. a cleanup, a render,
    // a new options object, etc) because of how the data persists

    // both work
    s = '';
    await openPopover();
    textInput = screen.getAllByRole(
      'spinbutton',
    ) as HTMLInputElement[];
    fireEvent.change(textInput[0], { target: { value: '0' } });
    fireEvent.change(textInput[1], { target: { value: '1' } });
    await clickApply();
    expect(s).toEqual('&min_number=0&max_number=1');
  });

  it('input test: checkboxes', async () => {
    const options: FilterPopoverOption[] = [
      {
        header: 'Basic String',
        key: 'enums',
        variant: 'checkbox',
        boxValues: [
          { displayStr: '1', value: '1', __checked: true },
          { displayStr: '2', value: '2', __checked: true },
          { displayStr: '3', value: '3' },
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
    let boxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
    expect(boxes).not.toBeNull();
    expect(boxes).toHaveLength(3);
    expect(boxes[0].checked).toBe(true);
    expect(boxes[1].checked).toBe(true);
    expect(boxes[2].checked).toBe(false);

    fireEvent.click(boxes[0]);
    await clickApply();
    expect(s).toEqual('&enums=2');

    cleanup();
    render(
      <FilterPopover
        setFilter={(value: string) => {
          s = value;
        }}
        options={options}
      />,
    );

    await openPopover();
    boxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
    expect(boxes[0].checked).toBe(false);
    expect(boxes[1].checked).toBe(true);
    expect(boxes[2].checked).toBe(false);
    fireEvent.click(boxes[0]);
    fireEvent.click(boxes[2]);
    await clickApply();
    expect(s).toEqual('&enums=1,2,3');
  });

  it('input test: radio', async () => {
    const options: FilterPopoverOption[] = [
      {
        header: 'Basic String',
        key: 'enums',
        variant: 'radio',
        boxValues: [
          { displayStr: '1', value: '1' },
          { displayStr: '2', value: '2', __checked: true },
          { displayStr: '3', value: '3' },
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
    let boxes = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(boxes).not.toBeNull();
    expect(boxes).toHaveLength(3);
    expect(boxes[0].checked).toBe(false);
    expect(boxes[1].checked).toBe(true);
    expect(boxes[2].checked).toBe(false);

    fireEvent.click(boxes[0]);
    await clickApply();
    expect(s).toEqual('&enums=1');

    cleanup();
    render(
      <FilterPopover
        setFilter={(value: string) => {
          s = value;
        }}
        options={options}
      />,
    );

    await openPopover();
    boxes = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(boxes[0].checked).toBe(true);
    expect(boxes[1].checked).toBe(false);
    expect(boxes[2].checked).toBe(false);
    fireEvent.click(boxes[1]);
    fireEvent.click(boxes[2]);
    await clickApply();
    expect(s).toEqual('&enums=3');
  });
});
