import React from 'react';
import Button from 'react-bootstrap/Button';

import styles from './VisualizationsPage.module.css';

import VizStack from './OurViz/VizStack';

const VisualizationsPage: React.FunctionComponent = () => {
  return (
    <div className={styles.VizContainer}>
      <h1>Visualizations</h1>
      <VizStack />
      <Button
        onClick={() => {
          window.location.assign('/provider_visualizations');
        }}
      >
        Click here to view provider visualizations!
      </Button>
    </div>
  );
};

export default VisualizationsPage;
