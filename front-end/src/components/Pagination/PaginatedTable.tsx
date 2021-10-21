import React from 'react';
import { useState, useMemo } from 'react';

import styles from './PaginatedTable.module.css';

import GenericTable from '../GenericTable/GenericTable';
import type {
  GenericTableProps,
  RowWithIndex,
} from '../GenericTable/GenericTable';
import PaginationRelay from './PaginationRelay';

const PAGE_SIZE = 10;

/*
 * Wrapper class for the generic table that also adds pagination
 * Pages are currently set to be 10 rows long
 * You should be able to at least move forward and backward one page
 */
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

      <PaginationRelay
        curPage={page}
        setPage={setPage}
        pageSize={PAGE_SIZE}
        totalElements={data.length}
      />
    </div>
  );
};

export default PaginatedTable;
