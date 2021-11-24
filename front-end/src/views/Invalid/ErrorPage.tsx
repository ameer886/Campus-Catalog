import React from 'react';
import './InvalidPage.css';

/*
 * The page you go to if you get an error (e.g. 500)
 */
const ErrorPage: React.FunctionComponent = () => {
  return (
    <div className="Invalid">
      <h1>Oops!</h1>
      <p>We appear to have encountered an error.</p>
      <p>Sorry for the inconvenience!</p>
    </div>
  );
};

export default ErrorPage;
