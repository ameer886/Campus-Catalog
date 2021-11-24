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
        setLoading(true);
        let adjust = params;
        if (params.slice(0, 1) === '&') adjust = params.slice(1);
        const data = await getAPI({
          model: model,
          params: adjust,
        });
        const responseRows = processResponse(data);
        // await new Promise((resolve) => setTimeout(resolve, 100000));
        setRows(responseRows);
        setLoading(false);
      } catch (err) {
        console.error(err);
        history.push('/error');
      }
    };

    fetchDataAsync();
  }, [params]);

  if (loading)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          marginBottom: '8px',
        }}
      >
        Loading, please be patient.
      </div>
    );

  return (
    <div style={{ alignItems: 'center' }}>
      <GenericTable data={rows} {...rest} />
    </div>
  );
};

export default QueryTable;
