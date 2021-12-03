import React from 'react';
import Button from 'react-bootstrap/Button';

import styles from './VisualizationsPage.module.css';

import ProviderVizStack from './ProviderViz/ProviderVizStack';

const VisualizationsPage: React.FunctionComponent = () => {
  return (
    <div className={styles.VizContainer}>
      <h1>Provider Visualizations</h1>
      <ProviderVizStack />
      <Button
        onClick={() => {
          window.location.assign('/visualizations');
        }}
      >
        Click here to view our visualizations!
      </Button>
    </div>
  );
};

export default VisualizationsPage;
