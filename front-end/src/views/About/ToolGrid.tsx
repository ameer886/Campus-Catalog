import React from 'react';
import { Nav } from 'react-bootstrap';
import styles from './ToolGrid.module.css';

import type { Tool } from './AboutInfo';
import { aboutTools } from './AboutInfo';

type ToolCardProps = {
  tool: Tool;
};

const ToolCard: React.FunctionComponent<ToolCardProps> = ({
  tool,
}: ToolCardProps) => {
  return (
    <Nav.Link href={tool.link}>
      <div className={styles.ToolCard}>
        <h1 className={styles.ToolName}>{tool.name}</h1>

        <div className={styles.ToolLogoContainer}>
          <img
            className={styles.ToolLogo}
            src={tool.img}
            alt={tool.name + ' logo'}
          />
        </div>
        <p className={styles.Description}>{tool.description}</p>
      </div>
    </Nav.Link>
  );
};

const ToolGrid: React.FunctionComponent = () => {
  return (
    <div className={styles.Centering}>
      <div className={styles.ToolGridContainer}>
        {aboutTools.map((tool, index) => (
          <ToolCard tool={tool} key={index} />
        ))}
      </div>
    </div>
  );
};

export default ToolGrid;
