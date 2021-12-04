import React from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import styles from './VisualizationsPage.module.css';

import UnivCostChart from './OurViz/UnivCostChart';

import ProviderSunburst from './ProviderViz/ProviderSunburst';

const VisualizationsPage: React.FunctionComponent = () => {
  return (
    <div className={styles.VizContainer}>
      <h1>Visualizations</h1>

      <Tabs
        defaultActiveKey="univCostChart"
        className="mb-3"
        style={{ justifyContent: 'center' }}
        // This will make the sunburst not eat every graph
        // however, it will make queries run every single time
        // that tabs are switched
        unmountOnExit
      >
        <Tab eventKey="univCostChart" title="University Cost">
          <UnivCostChart />
        </Tab>
        <Tab eventKey="providerSunburst" title="Course Sunburst">
          <ProviderSunburst />
        </Tab>
      </Tabs>
    </div>
  );
};

export default VisualizationsPage;
