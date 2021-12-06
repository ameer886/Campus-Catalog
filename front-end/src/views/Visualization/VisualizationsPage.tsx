import React from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import styles from './VisualizationsPage.module.css';

import UnivCostChart from './OurViz/UnivCostChart';

import ProviderSunburst from './ProviderViz/ProviderSunburst';

const VisualizationsPage: React.FunctionComponent = () => {
  return (
    <div>
      <div className={styles.Header}>Visualizations</div>
      <div className={styles.VizContainer}>
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
    </div>
  );
};

export default VisualizationsPage;
