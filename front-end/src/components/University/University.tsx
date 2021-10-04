import React from 'react';
import './University.css';

import { formatNumberToMoney } from '../../utilities';

import { UniversityType } from '../../views/Universities/UniversitiesPage';

const UNAVAILABLE = (
  <p>We couldn&#39;t find any information on this topic.</p>
);

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

type PricesAndRankingProps = {
  inStateTuition?: number;
  outStateTuition?: number;
  ranking?: number;
};

// Component that should show the
// prices and ranking of this school
const PricesAndRanking: React.FunctionComponent<PricesAndRankingProps> =
  ({
    inStateTuition,
    outStateTuition,
    ranking,
  }: PricesAndRankingProps) => {
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

type PublicityIndicatorProps = {
  status: 'Public' | 'Private';
};

// Indicates whether the school is public or private
const PublicityIndicator: React.FunctionComponent<PublicityIndicatorProps> =
  ({ status }: PublicityIndicatorProps) => {
    const selectedClassName = 'PublicityLabel Selected';
    const unSelectedClassName = 'PublicityLabel Unselected';
    const publicClassName =
      status === 'Public' ? selectedClassName : unSelectedClassName;
    const privateClassName =
      status === 'Public' ? unSelectedClassName : selectedClassName;

    return (
      <div className="Centering">
        <span>
          <p className="PublicityLabel">This university is </p>
          <p className={publicClassName}>Public</p>
          <p className="PublicityLabel"> | </p>
          <p className={privateClassName}>Private</p>
        </span>
      </div>
    );
  };

type EnrollmentStatsProps = {
  undergradEnrollment?: number;
  graduateEnrollment?: number;
};

// Component to show all available enrollment stats
const EnrollmentStats: React.FunctionComponent<EnrollmentStatsProps> =
  ({
    undergradEnrollment,
    graduateEnrollment,
  }: EnrollmentStatsProps) => {
    if (
      undergradEnrollment !== undefined &&
      graduateEnrollment !== undefined
    ) {
      return (
        <p>
          This university currently has{' '}
          {undergradEnrollment.toLocaleString('en-US')} undergraduate
          students and {graduateEnrollment.toLocaleString('en-US')}{' '}
          graduate students enrolled.
        </p>
      );
    } else if (undergradEnrollment !== undefined) {
      return (
        <p>
          This university currently has{' '}
          {undergradEnrollment.toLocaleString('en-US')} undergraduate
          students enrolled.
        </p>
      );
    } else if (graduateEnrollment !== undefined) {
      return (
        <p>
          This university currently has{' '}
          {graduateEnrollment.toLocaleString('en-US')} graduate
          students enrolled.
        </p>
      );
    }
    return UNAVAILABLE;
  };

type AcceptanceStatsProps = {
  acceptanceRate?: number;
  graduationRate?: number;
};

// Component to show all available enrollment stats
const AcceptanceStats: React.FunctionComponent<AcceptanceStatsProps> =
  ({ acceptanceRate, graduationRate }: AcceptanceStatsProps) => {
    if (
      acceptanceRate !== undefined &&
      graduationRate !== undefined
    ) { acceptanceRate = acceptanceRate * 100
      graduationRate = graduationRate * 100
      return (
        <p>
          The acceptance rate at this university is{' '}
          {acceptanceRate.toFixed(0)}%, and the graduation rate is{' '}
          {graduationRate.toFixed(0)}%.
        </p>
      );
    } else if (acceptanceRate !== undefined) {
      return (
        <p>
          The acceptance rate at this university is{' '}
          {acceptanceRate * 100}%.
        </p>
      );
    } else if (graduationRate !== undefined) {
      return (
        <p>
          The acceptance rate at this university is{' '}
          {graduationRate * 100}%.
        </p>
      );
    }
    return UNAVAILABLE;
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
  const finAid = formatNumberToMoney(uniQuery.avgFinancialAid);

  return (
    <div>
      <h1 className="UniversityName">{uniQuery.schoolName}</h1>
      <h3 className="UniversityLocation">{location}</h3>
      <PricesAndRanking
        ranking={uniQuery.ranking}
        inStateTuition={uniQuery.inStateTuition}
        outStateTuition={uniQuery.outStateTuition}
      />
      {uniQuery.type && <PublicityIndicator status={uniQuery.type} />}
      <h4 className="Stats">University Statistics:</h4>

      {/* Section for all other stats */}
      <h5 className="Section">Financial Aid</h5>
      {uniQuery.avgFinancialAid !== undefined ? (
        <p>
          This university offers an average of {finAid} in financial
          support.
        </p>
      ) : (
        { UNAVAILABLE }
      )}

      <h5 className="Section">Mascot</h5>
      {uniQuery.mascot ? (
        <p>This university&#39;s mascot is {uniQuery.mascot}</p>
      ) : (
        { UNAVAILABLE }
      )}

      <h5 className="Section">Enrollment</h5>
      <EnrollmentStats
        undergradEnrollment={uniQuery.undergradEnrollment}
        graduateEnrollment={uniQuery.graduateEnrollment}
      />

      <h5 className="Section">Acceptance and Graduation</h5>
      <AcceptanceStats
        acceptanceRate={uniQuery.acceptanceRate}
        graduationRate={uniQuery.graduationRate}
      />
    </div>
  );
};

export default University;
