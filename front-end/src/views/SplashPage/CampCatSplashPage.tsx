import React from 'react';
import './CampCatSplashPage.css';
import Logo from '../Media/Crying_Cat.jpg';

/*
 * The Splash Page
 * This is where everyone will arrive by default
 * Should contain links to all model pages and the about page
 */
const CampCatSplashPage: React.FunctionComponent = () => {
  return (
    <div className="App">
      <h1>Hello world!</h1>
      <img src={Logo} width = "300" alt="cat"/>
    </div>
  );
};

export default CampCatSplashPage;
