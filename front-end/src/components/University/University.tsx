import React from 'react';
import styles from './University.module.css';
import { NavLink } from 'react-router-dom';

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
      <div className={styles.Centering}>
        <div className={styles.PricesAndRankingContainer}>
          <div className={styles.PricesContainer}>
            <div style={{ width: '100%' }}>
              <div className={styles.SinglePrice}>
                <p className={styles.Tuition + ' ' + styles.InState}>
                  In-State Tuition:
                </p>
                <p className={styles.Tuition + styles.Cost}>
                  {inState}
                </p>
              </div>
              <div className={styles.SinglePrice}>
                <p className={styles.Tuition + ' ' + styles.OutState}>
                  Out-of-State Tuition:
                </p>
                <p className={styles.Tuition + ' ' + styles.Cost}>
                  {outState}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.RankingContainer}>
            <p className={styles.RankingLabel}>Ranking</p>
            <p className={styles.Ranking}>{ranking}</p>
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
    const selectedClassName =
      styles.PublicityLabel + ' ' + styles.Selected;
    const unSelectedClassName =
      styles.PublicityLabel + ' ' + styles.Unselected;

    const publicClassName =
      status === 'Public' ? selectedClassName : unSelectedClassName;
    const privateClassName =
      status === 'Public' ? unSelectedClassName : selectedClassName;

    return (
      <div className={styles.Centering}>
        <span>
          <p className={styles.PublicityLabel}>This university is </p>
          <p className={publicClassName}>Public</p>
          <p className={styles.PublicityLabel}> | </p>
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
    ) {
      return (
        <p>
          The acceptance rate at this university is{' '}
          {acceptanceRate * 100}%, and the graduation rate is{' '}
          {graduationRate * 100}%.
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
      <h1 className={styles.UniversityName}>{uniQuery.schoolName}</h1>
      <h3 className={styles.UniversityLocation}>{location}</h3>
      <PricesAndRanking
        ranking={uniQuery.ranking}
        inStateTuition={uniQuery.inStateTuition}
        outStateTuition={uniQuery.outStateTuition}
      />
      {uniQuery.type && <PublicityIndicator status={uniQuery.type} />}
      <h4 className={styles.Stats}>University Statistics:</h4>

      {/* Section for all other stats */}
      <h5 className={styles.Section}>Financial Aid</h5>
      {uniQuery.avgFinancialAid !== undefined ? (
        <p>
          This university offers an average of {finAid} in financial
          support.
        </p>
      ) : (
        { UNAVAILABLE }
      )}

      <h5 className={styles.Section}>Mascot</h5>
      {uniQuery.mascot ? (
        <p>This university&#39;s mascot is {uniQuery.mascot}.</p>
      ) : (
        { UNAVAILABLE }
      )}

      <h5 className={styles.Section}>Enrollment</h5>
      <EnrollmentStats
        undergradEnrollment={uniQuery.undergradEnrollment}
        graduateEnrollment={uniQuery.graduateEnrollment}
      />

      <h5 className={styles.Section}>Acceptance and Graduation</h5>
      <AcceptanceStats
        acceptanceRate={uniQuery.acceptanceRate}
        graduationRate={uniQuery.graduationRate}
      />
      <p>
        Close by entertainment includes:{' '}
        <NavLink to="/entertainments/id=1">
          Mozarts Coffee Roaters
        </NavLink>
        , <NavLink to="/entertainments/id=2">Target</NavLink>, and{' '}
        <NavLink to="/entertainments/id=3">Lan Ramen</NavLink>
        .Apartments that are located near this university include{' '}
        <NavLink to="/apartments/id=1">Parkside Place</NavLink>,{' '}
        <NavLink to="/apartments/id=3">3401 at Red River</NavLink>,
        and{' '}
        <NavLink to="/apartments/id=2">
          Barclay Square at Princeton Forrestal
        </NavLink>
        .
      </p>
    </div>
  );
};

export default University;
