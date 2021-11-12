import React from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Table from 'react-bootstrap/Table';
import { BsArrowUp, BsArrowDown } from 'react-icons/bs';

import './GenericTable.css';

/*
 * This component is a stylized table made to be as generic as I can
 * You should be able to pass basically anything reasonable into the table
 *
 * The logic behind this takes a lot of TypeScript knowledge, so I'll try
 * to be as detailed as I possibly can
 */

export interface RowWithIndex {
  id: number | string;
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
                  <Nav.Link href={curPath + '/' + row.id}>
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
  const [sortStr, setSortStr] = useState('NONE');
  const applySort = (s: string) => {
    const reapply = sortStr.includes(s);
    if (reapply && sortStr.includes('asc')) setSortStr(s + '_desc');
    else if (reapply) setSortStr('NONE');
    else setSortStr(s + '_asc');
  };
  console.log(sortStr);

  return (
    <>
      <Table className="GenericTable" bordered hover>
        {/* GenericHeader is here so that it has access to state */}
        <thead className="bg-dark text-white">
          <tr>
            {columnDefinitions.map((col, index) => (
              <th
                className="pointer"
                key={`TH${index}`}
                onClick={() => applySort(col.key.toString())}
                style={{ position: 'relative' }}
              >
                <>
                  {col.key}
                  {sortStr === `${col.key.toString()}_asc` && (
                    <BsArrowUp
                      style={{ position: 'absolute', right: '8px' }}
                    />
                  )}
                  {sortStr === `${col.key.toString()}_desc` && (
                    <BsArrowDown
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '16px',
                      }}
                    />
                  )}
                </>
              </th>
            ))}
          </tr>
        </thead>
        {data.length > 0 && (
          <GenericRows
            columnDefinitions={columnDefinitions}
            data={data}
          />
        )}
      </Table>
      {data.length === 0 && (
        <p>Sorry, we found no data matching this filter.</p>
      )}
    </>
  );
};

export default GenericTable;
