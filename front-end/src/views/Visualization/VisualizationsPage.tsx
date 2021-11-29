import React from 'react';

import styles from './VisualizationsPage.module.css';

import ProviderVizStack from './ProviderViz/ProviderVizStack';
import VizStack from './OurViz/VizStack';

const VisualizationsPage: React.FunctionComponent = () => {
  return (
    <div className={styles.VizContainer}>
      <h1>Visualizations</h1>
      <VizStack />
      <ProviderVizStack />
    </div>
  );
};

export default VisualizationsPage;
