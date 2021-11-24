import React from 'react';
import { useState } from 'react';

import styles from './PaginatedTable.module.css';

import type {
  ColumnDefinitionType,
  RowWithIndex,
} from '../GenericTable/GenericTable';
import type { IntentionallyAny } from '../../utilities';
import QueryTable from './QueryTable';
import PaginationRelay from './PaginationRelay';

export const PAGE_SIZE = 10;

export type PaginationMeta = {
  page: number;
  per_page: number;
  max_page: number;
  total_items: number;
};

type PaginationTableProps<
  T extends RowWithIndex,
  K extends keyof T,
> = {
  params: string;
  processResponse: (data: IntentionallyAny) => T[];

  // query table props that must be inherited but are unused here
  model: string;
  columnDefinitions: Array<ColumnDefinitionType<T, K>>;
  parentSort?: React.Dispatch<React.SetStateAction<string>>;
  parentStr?: string;
};

/*
 * Wrapper around QueryTable which also provides pagination
 * into the query
 */
const PaginatedTable = <T extends RowWithIndex, K extends keyof T>({
  params,
  processResponse,
  ...rest
}: PaginationTableProps<T, K>): JSX.Element => {
  const [page, setPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const processPage = (data: IntentionallyAny) => {
    const responseMeta: PaginationMeta = { ...data[0] };
    setTotalItems(responseMeta.total_items);
    return processResponse(data[1]);
  };

  const pageParams = `page=${page}&per_page=${PAGE_SIZE}` + params;
  return (
    <div className={styles.PaginatedContainer}>
      <QueryTable
        params={pageParams}
        processResponse={processPage}
        {...rest}
      />

      <PaginationRelay
        curPage={page}
        setPage={setPage}
        pageSize={PAGE_SIZE}
        totalElements={totalItems}
      />
    </div>
  );
};

export default PaginatedTable;
