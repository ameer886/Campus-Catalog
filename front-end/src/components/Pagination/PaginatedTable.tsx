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
import { FilterPopoverOption } from '../FilterPopover/FilterPopover';
import FilterPopover from '../FilterPopover/FilterPopover';

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
  processResponse: (data: IntentionallyAny) => T[];
  options: FilterPopoverOption[];

  // query table props that must be inherited but are unused here
  model: string;
  columnDefinitions: Array<ColumnDefinitionType<T, K>>;
};

/*
 * Wrapper around QueryTable which also provides pagination
 * into the query
 *
 * Note that this component must also override filtering and sorting
 * This is because without that, you end up with nested useEffects
 * and there is a race condition where an effect could take place during mount
 * Then you update during the effect, and get an "effect on unmounted component"
 * error. This will totally crash the front end.
 * Because of this bug, it's convenient to also do sorting here.
 */
const PaginatedTable = <T extends RowWithIndex, K extends keyof T>({
  options,
  processResponse,
  ...rest
}: PaginationTableProps<T, K>): JSX.Element => {
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filter, setFilter] = useState('');
  const [sortStr, setSortStr] = useState('NONE');

  const processPage = (data: IntentionallyAny) => {
    const responseMeta: PaginationMeta = { ...data[0] };
    setTotalItems(responseMeta.total_items);
    return processResponse(data);
  };

  let pageParams = `page=${page}&per_page=${PAGE_SIZE}`;
  if (sortStr !== 'NONE') {
    pageParams += `&sort=${sortStr.slice(0, -4)}`;
    if (sortStr.includes('dsc')) pageParams += '&desc=True';
  }
  if (filter) pageParams += filter;

  return (
    <>
      <div className={styles.FilterButton}>
        <FilterPopover
          options={options}
          setFilter={(e: string) => {
            if (filter === e) return;
            setPage(1);
            setFilter(e);
          }}
        />
      </div>

      <QueryTable
        params={pageParams}
        processResponse={processPage}
        parentSort={(e) => {
          setPage(1);
          setSortStr(e);
        }}
        parentStr={sortStr}
        {...rest}
      />

      <div className={styles.PaginatedContainer}>
        <PaginationRelay
          curPage={page}
          setPage={setPage}
          pageSize={PAGE_SIZE}
          totalElements={totalItems}
        />
      </div>
    </>
  );
};

export default PaginatedTable;
