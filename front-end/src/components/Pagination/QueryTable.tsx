import React from 'react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import type {
  ColumnDefinitionType,
  RowWithIndex,
} from '../GenericTable/GenericTable';
import type { IntentionallyAny } from '../../utilities';

import GenericTable from '../GenericTable/GenericTable';
import { getAPI } from '../../APIClient';

type QueryTableProps<T extends RowWithIndex, K extends keyof T> = {
  processResponse: (data: IntentionallyAny) => T[];
  model: string;
  params: string;

  // table props that must be inherited but are unused here
  columnDefinitions: Array<ColumnDefinitionType<T, K>>;
  parentSort?: React.Dispatch<React.SetStateAction<string>>;
  parentStr?: string;
};

/*
 * Wrapper class for the generic table that runs queries for you
 */
const QueryTable = <T extends RowWithIndex, K extends keyof T>({
  processResponse,
  model,
  params,
  ...rest
}: QueryTableProps<T, K>): JSX.Element => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Array<T>>([]);

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const data = await getAPI({
          model: model,
          params: params,
        });
        const responseRows = processResponse(data);
        setRows(responseRows);
        setLoading(false);
      } catch (err) {
        history.push('/error');
        console.error(err);
      }
    };

    fetchDataAsync();
  }, []);

  if (loading) return <p>Loading, please be patient.</p>;

  return (
    <div style={{ alignItems: 'center' }}>
      <GenericTable data={rows} {...rest} />
    </div>
  );
};

export default QueryTable;
