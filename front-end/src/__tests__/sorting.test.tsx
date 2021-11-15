import React from 'react';
import {
  render,
  screen,
  fireEvent,
  cleanup,
} from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import type { ColumnDefinitionType } from '../components/GenericTable/GenericTable';

import GenericTable from '../components/GenericTable/GenericTable';

type Datum = {
  name: string;
  min: number;
  max: number;
  id: string;
};

const genericTableHeaders: ColumnDefinitionType<
  Datum,
  keyof Datum
>[] = [
  {
    key: 'name',
    header: 'Name',
  },
  {
    key: 'min',
    header: 'Min',
  },
  {
    key: 'max',
    header: 'Max',
  },
  {
    key: 'id',
    header: 'ID',
  },
];

configure({ adapter: new Adapter() });

const clickColumn = (
  column: number,
  cont: { str: string },
  setStr: (s: string) => void,
) => {
  const col = screen.getAllByRole('columnheader')[column];
  expect(column).not.toBeNull();
  act(() => {
    fireEvent.click(col);
    cleanup();
    render(
      <GenericTable
        data={[]}
        columnDefinitions={genericTableHeaders}
        parentStr={cont.str}
        parentSort={setStr}
      />,
    );
  });
};

describe('Generic Table Sorting Test Suite', () => {
  it('headers run sort on click', () => {
    let str = 'NONE';
    const testObj = {
      setStr: (s: string) => {
        str = s;
      },
    };
    const spy = jest.spyOn(testObj, 'setStr');
    render(
      <GenericTable
        data={[]}
        columnDefinitions={genericTableHeaders}
        parentStr={str}
        parentSort={testObj.setStr}
      />,
    );

    const headers = screen.getAllByRole('columnheader');
    expect(headers).not.toBeNull();
    expect(headers).toHaveLength(genericTableHeaders.length);
    for (let i = 0; i < genericTableHeaders.length; i++) {
      fireEvent.click(headers[i]);
      expect(spy).toBeCalledTimes(i + 1);
    }
  });

  it('sort cycles correctly', () => {
    const t = { str: 'NONE' };
    const setStr = (s: string) => {
      t.str = s;
    };
    render(
      <GenericTable
        data={[]}
        columnDefinitions={genericTableHeaders}
        parentStr={t.str}
        parentSort={setStr}
      />,
    );

    clickColumn(0, t, setStr);
    expect(t.str).toEqual(`${genericTableHeaders[0].key}_asc`);

    clickColumn(0, t, setStr);
    expect(t.str).toEqual(`${genericTableHeaders[0].key}_dsc`);

    clickColumn(0, t, setStr);
    expect(t.str).toEqual('NONE');
  });

  it('sort builds correct strings', () => {
    const t = { str: 'NONE' };
    const testObj = {
      setStr: (s: string) => {
        t.str = s;
      },
    };
    const spy = jest.spyOn(testObj, 'setStr');
    render(
      <GenericTable
        data={[]}
        columnDefinitions={genericTableHeaders}
        parentStr={t.str}
        parentSort={testObj.setStr}
      />,
    );

    const headers = screen.getAllByRole('columnheader');
    expect(headers).not.toBeNull();
    expect(headers).toHaveLength(genericTableHeaders.length);
    for (let i = 0; i < genericTableHeaders.length; i++) {
      clickColumn(i, t, testObj.setStr);
      expect(spy).lastCalledWith(`${genericTableHeaders[i].key}_asc`);
      clickColumn(i, t, testObj.setStr);
      expect(spy).lastCalledWith(`${genericTableHeaders[i].key}_dsc`);
    }
  });

  it('changing sort col always defaults to asc', () => {
    const t = { str: 'NONE' };
    const testObj = {
      setStr: (s: string) => {
        t.str = s;
      },
    };
    const spy = jest.spyOn(testObj, 'setStr');
    render(
      <GenericTable
        data={[]}
        columnDefinitions={genericTableHeaders}
        parentStr={t.str}
        parentSort={testObj.setStr}
      />,
    );

    clickColumn(0, t, testObj.setStr);
    expect(spy).lastCalledWith(`${genericTableHeaders[0].key}_asc`);

    clickColumn(1, t, testObj.setStr);
    expect(spy).lastCalledWith(`${genericTableHeaders[1].key}_asc`);
    clickColumn(1, t, testObj.setStr);
    expect(spy).lastCalledWith(`${genericTableHeaders[1].key}_dsc`);

    clickColumn(2, t, testObj.setStr);
    expect(spy).lastCalledWith(`${genericTableHeaders[2].key}_asc`);
    clickColumn(2, t, testObj.setStr);
    clickColumn(2, t, testObj.setStr);
    expect(spy).lastCalledWith('NONE');

    clickColumn(3, t, testObj.setStr);
    expect(spy).lastCalledWith(`${genericTableHeaders[3].key}_asc`);
  });

  // if you really wanted, you could try adding a unit test that makes
  // sure that the table displays the correct arrow on the correct
  // column here but I don't think we need it or really have time for it
});
