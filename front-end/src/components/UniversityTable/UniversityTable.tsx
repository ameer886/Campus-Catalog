import React from 'react';

import GenericTable, {
  ColumnDefinitionType,
} from '../../components/GenericTable/GenericTable';
import { UniversityType } from '../../views/Universities/UniversitiesPage';
import { formatNumberToMoney } from '../../utilities';
import './UniversityTable.css';

type UniversityTableProps = {
  rows: Array<UniversityType>;
};

const universityTableHeaders: ColumnDefinitionType<
  UniversityType,
  keyof UniversityType
>[] = [
  {
    key: 'schoolName',
    header: 'School Name',
    sortFunc: (a, b) => a.schoolName.localeCompare(b.schoolName),
  },
  {
    key: 'state',
    header: 'State',
    sortFunc: (a, b) => {
      if (!a.state) return -1;
      if (!b.state) return 1;
      return a.state.localeCompare(b.state);
    },
  },
  {
    key: 'inStateTuition',
    header: 'In-State Tuition',
    sortFunc: (a, b) => {
      if (!a.inStateTuition) return -1;
      if (!b.inStateTuition) return 1;
      return a.inStateTuition - b.inStateTuition;
    },
    printFunc: (a) => formatNumberToMoney(a.inStateTuition),
  },
  {
    key: 'outStateTuition',
    header: 'Out-of-State Tuition',
    sortFunc: (a, b) => {
      if (!a.outStateTuition) return -1;
      if (!b.outStateTuition) return 1;
      return a.outStateTuition - b.outStateTuition;
    },
    printFunc: (a) => formatNumberToMoney(a.outStateTuition),
  },
  {
    key: 'ranking',
    header: 'Ranking',
    sortFunc: (a, b) => {
      if (!a.ranking) return -1;
      if (!b.ranking) return 1;
      return a.ranking - b.ranking;
    },
  },
];

const UniversityTable: React.FunctionComponent<UniversityTableProps> =
  ({ rows }: UniversityTableProps) => {
    return (
      <div className="UniversityTable">
        <GenericTable
          columnDefinitions={universityTableHeaders}
          data={rows}
        />
      </div>
    );
  };

export default UniversityTable;
