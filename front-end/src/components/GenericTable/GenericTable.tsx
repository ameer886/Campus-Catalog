import React from 'react';
import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';

import './GenericTable.css';

import Table from 'react-bootstrap/Table';

/*
 * This component is a stylized table made to be as generic as I can
 * You should be able to pass basically anything reasonable into the table
 *
 * The logic behind this takes a lot of TypeScript knowledge, so I'll try
 * to be as detailed as I possibly can
 */

export interface RowWithIndex {
  id: number;
}

/*
 * This type tells you what a single column type is
 * The header is the name of the column
 * The key is the key of the object accessed, i.e. obj[key]
 *
 * Using this "K extends keyof T" ensures that key is always a key for T
 * That way you can't build a column using things that aren't keys
 *
 * Provide a sort function if you want a column to be sortable.
 * For those unfamiliar, sort functions take two objects and compare them
 * Return a negative number if a < b, positive if a > b, and 0 if a = b
 *
 * Provide a print function if you want a column to be formatted uniquely
 * For example: print number as money, rather than as a raw int
 * It should return a string version of that specific cell
 */
export type ColumnDefinitionType<
  T extends RowWithIndex,
  K extends keyof T,
> = {
  header: string;
  key: K;
  // I'd love for a and b to be the type of the column
  // but it's impossible to statically type these generic columns
  // so instead we can compare entire rows uniquely on columns
  sortFunc?: (a: T, b: T) => number;
  printFunc?: (a: T) => string;
};

/*
 * This type represents all the props that should be passed to the table
 * columnDefinitions tells the table what the columns should look like
 * data is the data actually being displayed
 */
export type GenericTableProps<
  T extends RowWithIndex,
  K extends keyof T,
> = {
  columnDefinitions: Array<ColumnDefinitionType<T, K>>;
  data: Array<T>;
};

// Builds the table itself
const GenericRows = <T extends RowWithIndex, K extends keyof T>({
  data,
  columnDefinitions,
}: GenericTableProps<T, K>): JSX.Element => {
  // Get the current URL Router path
  const location = useLocation();
  const curPath = location.pathname;

  return (
    <tbody>
      {/* For each data point, make a row */}
      {data.map((row, index) => (
        <tr key={`TB${index}`}>
          {/* For each column definition, build a cell */}
          {columnDefinitions.map((def, index2) => {
            const cellStr = def.printFunc
              ? def.printFunc(row)
              : row[def.key];

            if (index2 === 0) {
              // Special return: make a link on first column
              return (
                <td key={`cell${index2}`}>
                  <Nav.Link href={curPath + '/id=' + row.id}>
                    {cellStr}
                  </Nav.Link>
                </td>
              );
            }

            return (
              <td key={`cell${index2}`}>
                {/* Format cell if available; otherwise print */}
                {def.printFunc ? def.printFunc(row) : row[def.key]}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
};

/*
 * The data prop should just be an array of all the table values
 * The columnDefinitions prop is more complicated.
 * The columnDefinitions depends on the type T of the data you pass in.
 *   It should be an array of objects of the form
 *   {
 *     key: <any key of T>,
 *     header: string, // the string displayed in the header
 *     sortFunc?: compare function
 *   }
 */
const GenericTable = <T extends RowWithIndex, K extends keyof T>({
  columnDefinitions,
  data,
}: GenericTableProps<T, K>): JSX.Element => {
  /*
   * This state allows us to track our current sort state
   * We know for certain that all keys K are unique, so the states are:
   * - null for no sort
   * - keyasc for ascending on key column
   * - keydesc for descending on key column
   */
  const [curSort, setSort] = useState<null | string>(null);

  /*
   * Memoize sorted data based on key, sort calculation is expensive
   */
  const sortedData = useMemo(() => {
    let copy = data;
    if (curSort) {
      columnDefinitions.forEach((col) => {
        if (col.sortFunc && curSort.includes(col.key.toString())) {
          /*
           * If we're actually sorting, we need to make a copy because
           * otherwise we could lose the "original" order and be stuck
           * only doing ascending or descending.
           * Conversely, if that's desirable behavior then we can
           * both get rid of the null sort state and this copy.
           */
          copy = JSON.parse(JSON.stringify(data));
          copy.sort(col.sortFunc);
          if (curSort.includes('desc')) {
            copy.reverse();
          }
        }
      });
    }
    return copy;
  }, [curSort, data, columnDefinitions]);

  // This is a useful wrapper on how to change our sort order
  const changeSortFunc = (key: string) => {
    if (!curSort) {
      setSort(`${key}asc`);
    } else if (curSort.includes(`${key}asc`)) {
      setSort(`${key}desc`);
    } else {
      setSort(null);
    }
    console.log(curSort);
  };

  return (
    <>
      <Table className="GenericTable" bordered hover>
        {/* GenericHeader is here so that it has access to state */}
        <thead className="bg-dark text-white">
          <tr>
            {columnDefinitions.map((col, index) => (
              <th
                className="pointer"
                onClick={() => changeSortFunc(col.key.toString())}
                key={`TH${index}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <GenericRows
          columnDefinitions={columnDefinitions}
          data={sortedData}
        />
      </Table>
      <p>Found a total of {sortedData.length} elements.</p>
    </>
  );
};

export default GenericTable;
