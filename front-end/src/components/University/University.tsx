import React from 'react';
import './University.css';

import { formatNumberToMoney } from '../../utilities';

import { UniversityType } from '../../views/Universities/UniversitiesPage';

type UniversityProps = {
  uniQuery: UniversityType;
};

// Function to print out a readable location
function formatLocation(
  state?: string,
  city?: string,
  zipCode?: string,
) {
  if (!state || !city) {
    return 'ERR: Location unavailable!';
  }

  let str = `Located in ${city}, ${state}`;
  if (zipCode) str += ' ' + zipCode;
  str += '.';
  return str;
}

type PricesAndRankingType = {
  inStateTuition?: number;
  outStateTuition?: number;
  ranking?: number;
};

// Component that should show the
// prices and ranking of this school
const PricesAndRanking: React.FunctionComponent<PricesAndRankingType> =
  ({
    inStateTuition,
    outStateTuition,
    ranking,
  }: PricesAndRankingType) => {
    const inState = formatNumberToMoney(inStateTuition);
    const outState = formatNumberToMoney(outStateTuition);

    return (
      <div className="Centering">
        <div className="PricesAndRankingContainer">
          <div className="PricesContainer">
            <div style={{ width: '100%' }}>
              <div className="SinglePrice">
                <p className="Tuition InState">In-State Tuition:</p>
                <p className="Tuition Cost">{inState}</p>
              </div>
              <div className="SinglePrice">
                <p className="Tuition OutState">
                  Out-of-State Tuition:
                </p>
                <p className="Tuition Cost">{outState}</p>
              </div>
            </div>
          </div>

          <div className="RankingContainer">
            <p className="RankingLabel">Ranking</p>
            <p className="Ranking">{ranking}</p>
          </div>
        </div>
      </div>
    );
  };

// Indicates whether the school is public or private
const PublicityIndicator: React.FunctionComponent = () => {
  return <div />;
};

/*
 * The instance page for a single university
 * Should contain a list of media relevant to this university
 * Any attribute information should be passed in as a property
 */
const University: React.FunctionComponent<UniversityProps> = ({
  uniQuery,
}: UniversityProps) => {
  const location = formatLocation(
    uniQuery.state,
    uniQuery.city,
    uniQuery.zipCode,
  );

  return (
    <div>
      <h1 className="UniversityName">{uniQuery.schoolName}</h1>
      <h3 className="UniversityLocation">{location}</h3>
      <PricesAndRanking
        ranking={uniQuery.ranking}
        inStateTuition={uniQuery.inStateTuition}
        outStateTuition={uniQuery.outStateTuition}
      />
      <PublicityIndicator />
    </div>
  );
};

export default University;
