import React from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import styles from './VisualizationsPage.module.css';

import StateChoropleth from './OurViz/StateChoropleth';
import UnivCostChart from './OurViz/UnivCostChart';
import Scatterplot from './OurViz/Scatterplot';

import ProviderSunburst from './ProviderViz/ProviderSunburst';
import ProviderSankey from './ProviderViz/ProviderSankey';

const VisualizationsPage: React.FunctionComponent = () => {
  return (
    <div className={styles.VizContainer}>
      <h1>Visualizations</h1>

      <Tabs
        defaultActiveKey="stateChoropleth"
        className="mb-3"
        style={{ justifyContent: 'center' }}
        // This will make the sunburst not eat every graph
        // however, it will make queries run every single time
        // that tabs are switched
        unmountOnExit
      >
        <Tab eventKey="stateChoropleth" title="State Density">
          <StateChoropleth />
        </Tab>
        <Tab eventKey="univCostChart" title="University Cost">
          <UnivCostChart />
        </Tab>
        <Tab eventKey="scatterplot" title="Rent Cost Scatterplot">
          <Scatterplot />
        </Tab>
        <Tab eventKey="providerSunburst" title="Course Sunburst">
          <ProviderSunburst />
        </Tab>
        <Tab eventKey="providerSankey" title="Schedule Breakdown">
          <ProviderSankey />
        </Tab>
      </Tabs>
    </div>
  );
};

export default VisualizationsPage;
