import React from 'react';
import './InvalidPage.css';

/*
 * The page you go to if you have a bad linke
 */
const InvalidPage: React.FunctionComponent = () => {
  return (
    <div className="Invalid">
      <h1>ERR 404 - Page Not Found</h1>
    </div>
  );
};

export default InvalidPage;
