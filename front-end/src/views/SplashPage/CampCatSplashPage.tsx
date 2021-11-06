import React from 'react';
import styles from './CampCatSplashPage.module.css';
import SplashGrid from './SplashGrid';
import FilterPopover from '../../components/FilterPopover/FilterPopover';

/*
 * The Splash Page
 * This is where everyone will arrive by default
 * Should contain links to all model pages and the about page
 */
const CampCatSplashPage: React.FunctionComponent = () => {
  return (
    <div className={styles.Centering}>
      <div className={styles.TextContainer}>
        <h1 className={styles.Title}>Campus Catalog</h1>
      </div>

      <div className={styles.TextContainer}>
        <h2 className={styles.Mission}>
          Struggling to find the right university?
          <br />
          Not sure where to live or where to spend your time?
        </h2>
      </div>
      <div className={styles.TextContainer}>
        <h3 className={styles.Help}>We&#39;re here to help.</h3>
      </div>

      <SplashGrid />

      <FilterPopover />
    </div>
  );
};

export default CampCatSplashPage;
