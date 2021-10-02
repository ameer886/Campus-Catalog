import React from 'react';
import ReactDOM from 'react-dom';
import {
  Redirect,
  Route,
  BrowserRouter,
  Switch,
} from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import CampCatSplashPage from './views/SplashPage/CampCatSplashPage';
import AboutPage from './views/About/AboutPage';
import ApartmentsPage from './views/Apartments/ApartmentsPage';
import EntertainmentsPage from './views/Entertainments/EntertainmentsPage';
import UniversitiesPage from './views/Universities/UniversitiesPage';
import InvalidPage from './views/Invalid/InvalidPage';

import Apartment1 from './views/HardInstances/Apartment1';
import Apartment2 from './views/HardInstances/Apartment2';
import Apartment3 from './views/HardInstances/Apartment3';
import Entertainment1 from './views/HardInstances/Entertainment1';
import Entertainment2 from './views/HardInstances/Entertainment2';
import Entertainment3 from './views/HardInstances/Entertainment3';
import University1 from './views/HardInstances/University1';
import University2 from './views/HardInstances/University2';
import University3 from './views/HardInstances/University3';

import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* put a Route to each page here */}
      <Switch>
        {/* Splash Page */}
        <Route path="/" exact component={CampCatSplashPage} />

        {/* About Page */}
        <Route path="/about" exact component={AboutPage} />

        {/* Apartments Page */}
        <Route path="/apartments" exact component={ApartmentsPage} />

        {/* Entertainments Page */}
        <Route
          path="/entertainments"
          exact
          component={EntertainmentsPage}
        />

        {/* Universities Page */}
        <Route
          path="/universities"
          exact
          component={UniversitiesPage}
        />

        {/* Terrible hard coded instances */}
        <Route path="/apartments/id=1" exact component={Apartment1} />
        <Route path="/apartments/id=2" exact component={Apartment2} />
        <Route path="/apartments/id=3" exact component={Apartment3} />
        <Route
          path="/entertainments/id=1"
          exact
          component={Entertainment1}
        />
        <Route
          path="/entertainments/id=2"
          exact
          component={Entertainment2}
        />
        <Route
          path="/entertainments/id=3"
          exact
          component={Entertainment3}
        />
        <Route
          path="/universities/id=1"
          exact
          component={University1}
        />
        <Route
          path="/universities/id=2"
          exact
          component={University2}
        />
        <Route
          path="/universities/id=3"
          exact
          component={University3}
        />

        {/* Invalid Page for missing links */}
        <Route path="/404" component={InvalidPage} />
        {/* Catch all to the invalid page */}
        <Redirect to="/404" />
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
