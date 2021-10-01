import React from 'react';

import Table from 'react-bootstrap/Table';

/*
 * This component is a stylized table made to be as generic as I can
 * You should be able to pass basically anything reasonable into the table
 *
 * The logic behind this takes a lot of TypeScript knowledge, so I'll try
 * to be as detailed as I possibly can
 */

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
 */
export type ColumnDefinitionType<T, K extends keyof T> = {
  header: string;
  key: K;
  // It's impossible to statically type check params on this sort function
  // The types will be T[K] but the compiler can only expand that
  // to all possible keys, not a specific key
  // Thus this any is intentional
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sortFunc?: (a: any, b: any) => number;
};

/*
 * This type represents all the props that should be passed to the table
 * columnDefinitions tells the table what the columns should look like
 * data is the data actually being displayed
 */
type GenericTableProps<T, K extends keyof T> = {
  columnDefinitions: Array<ColumnDefinitionType<T, K>>;
  data: Array<T>;
};

// Header is fussy and needs a more specific type
// too bad we can't $Diff these like in Flow
type GenericHeaderProps<T, K extends keyof T> = {
  columnDefinitions: Array<ColumnDefinitionType<T, K>>;
};

// Builds the header row
const GenericHeader = <T, K extends keyof T>({
  columnDefinitions,
}: GenericHeaderProps<T, K>): JSX.Element => {
  return (
    <thead className="bg-dark text-white">
      <tr>
        {columnDefinitions.map((col, index) => (
          <th onClick={() => alert(col.header)} key={`TH${index}`}>
            {col.header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

// Builds the table itself
const GenericRows = <T, K extends keyof T>({
  data,
  columnDefinitions,
}: GenericTableProps<T, K>): JSX.Element => {
  return (
    <tbody>
      {data.map((row, index) => (
        <tr key={`TB${index}`}>
          {columnDefinitions.map((def, index2) => (
            <td key={`cell${index2}`}>{row[def.key]}</td>
          ))}
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
const GenericTable = <T, K extends keyof T>({
  columnDefinitions,
  data,
}: GenericTableProps<T, K>): JSX.Element => {
  return (
    <Table className="GenericTable" bordered hover>
      <GenericHeader columnDefinitions={columnDefinitions} />
      <GenericRows
        columnDefinitions={columnDefinitions}
        data={data}
      />
    </Table>
  );
};

export default GenericTable;
