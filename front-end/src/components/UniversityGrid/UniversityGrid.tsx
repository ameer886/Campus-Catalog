import React from 'react';
// import './UniversityGrid.css';
import styles from './UniversityGrid.module.css';

import type { UniversityRowType } from '../../views/Universities/UniversitiesPage';
import { Nav } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { formatNumberToMoney } from '../../utilities';

type CardProps = {
  university: UniversityRowType;
};

const UniversityCard: React.FunctionComponent<CardProps> = ({
  university,
}: CardProps) => {
  const location = useLocation();
  const curPath = location.pathname;

  return (
    <Nav.Link
      className={styles.CardLink}
      href={curPath + '/id=' + university.id}
    >
      <div className={styles.UniversityCard}>
        <h2 className={styles.UniversityName}>
          {university.univ_name}
        </h2>
        {university.state && <p>Located in {university.state}</p>}

        <div className={styles.LeftRightPair}>
          <p className={styles.InState + ' ' + styles.Left}>
            In-State Tuition:
          </p>
          <p className={styles.Tuition}>
            {formatNumberToMoney(university.tuition_in_st)}
          </p>
        </div>
        <div className={styles.LeftRightPair}>
          <p className={styles.OutState + ' ' + styles.Left}>
            Out-of-State Tuition:
          </p>
          <p className={styles.Tuition}>
            {formatNumberToMoney(university.tuition_out_st)}
          </p>
        </div>

        <div className={styles.LeftRightPair}>
          <p className={styles.Left + ' ' + styles.RankingText}>
            Ranking:
          </p>
          <p className={styles.Tuition + ' ' + styles.Ranking}>
            {university.rank}
          </p>
        </div>
      </div>
    </Nav.Link>
  );
};

type UniversityGridProps = {
  cards: Array<UniversityRowType>;
};

/*
 * Grid for displaying universities
 * Each row will have at most 3 equally spaced cards
 * Each card should have info for a single university
 */
const UniversityGrid: React.FunctionComponent<UniversityGridProps> =
  ({ cards }: UniversityGridProps) => {
    return (
      <div className={styles.Centering}>
        <div className={styles.UniversityGridContainer}>
          {cards.map((university, index) => (
            <UniversityCard university={university} key={index} />
          ))}
        </div>
      </div>
    );
  };

export default UniversityGrid;
