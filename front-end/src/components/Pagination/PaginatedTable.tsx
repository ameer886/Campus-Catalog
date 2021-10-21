import React from 'react';
import { useState, useMemo } from 'react';

import styles from './PaginatedTable.module.css';

import GenericTable from '../GenericTable/GenericTable';
import type {
  GenericTableProps,
  RowWithIndex,
} from '../GenericTable/GenericTable';

const PAGE_SIZE = 10;

const PaginatedTable = <T extends RowWithIndex, K extends keyof T>({
  columnDefinitions,
  data,
}: GenericTableProps<T, K>): JSX.Element => {
  const [page, setPage] = useState(0);
  const pageData = useMemo(() => {
    const slice = data.slice(
      page * PAGE_SIZE,
      (page + 1) * PAGE_SIZE,
    );

    return slice;
  }, [page, PAGE_SIZE, data]);

  return (
    <div className={styles.PaginatedContainer}>
      <GenericTable
        columnDefinitions={columnDefinitions}
        data={pageData}
      />
      <button onClick={() => setPage(page + 1)}>Click me!</button>
    </div>
  );
};

export default PaginatedTable;
