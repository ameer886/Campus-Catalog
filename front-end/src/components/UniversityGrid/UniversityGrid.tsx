import React from 'react';

import './UniversityGrid.css';

const UniversityCard: React.FunctionComponent = () => {
  return <div className="UniversityCard">Test1</div>;
};

const UniversityGrid: React.FunctionComponent = () => {
  return (
    <div className="Centering">
      <div className="UniversityGridContainer">
        <UniversityCard />
        <UniversityCard />
        <UniversityCard />
        <UniversityCard />
        <UniversityCard />
        <UniversityCard />
      </div>
    </div>
  );
};

export default UniversityGrid;
