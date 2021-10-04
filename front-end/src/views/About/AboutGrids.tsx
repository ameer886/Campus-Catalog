import React from 'react';
import { Nav } from 'react-bootstrap';
import styles from './AboutGrid.module.css';

import type { ToolOrAPI } from './AboutInfo';
import { aboutTools, aboutAPIs } from './AboutInfo';

type ToolOrAPICardProps = {
  toolOrAPI: ToolOrAPI;
};

const AboutCard: React.FunctionComponent<ToolOrAPICardProps> = ({
  toolOrAPI,
}: ToolOrAPICardProps) => {
  return (
    <Nav.Link href={toolOrAPI.link}>
      <div className={styles.ToolCard}>
        <h1 className={styles.ToolName}>{toolOrAPI.name}</h1>

        <div className={styles.ToolLogoContainer}>
          <img
            className={styles.ToolLogo}
            src={toolOrAPI.img}
            alt={toolOrAPI.name + ' logo'}
          />
        </div>
        <p className={styles.Description}>{toolOrAPI.description}</p>
      </div>
    </Nav.Link>
  );
};

type AboutGridProps = {
  toolsOrAPIs: Array<ToolOrAPI>;
};

const AboutGrid: React.FunctionComponent<AboutGridProps> = ({
  toolsOrAPIs,
}: AboutGridProps) => {
  return (
    <div className={styles.Centering}>
      <div className={styles.ToolGridContainer}>
        {toolsOrAPIs.map((toolOrAPI, index) => (
          <AboutCard toolOrAPI={toolOrAPI} key={index} />
        ))}
      </div>
    </div>
  );
};

export const ToolGrid: React.FunctionComponent = () => {
  return <AboutGrid toolsOrAPIs={aboutTools} />;
};

export const APIGrid: React.FunctionComponent = () => {
  return <AboutGrid toolsOrAPIs={aboutAPIs} />;
};
