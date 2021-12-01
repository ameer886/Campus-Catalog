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
import Search from './views/Search/Search';

import Navbar from './components/OurNavbar/OurNavbar';
import CampCatSplashPage from './views/SplashPage/CampCatSplashPage';
import AboutPage from './views/About/AboutPage';
import ApartmentsPage from './views/Apartments/ApartmentsPage';
import Apartment from './components/Apartment/Apartment';
import EntertainmentsPage from './views/Entertainments/EntertainmentsPage';
import Entertainment from './components/Entertainment/Entertainment';
import UniversitiesPage from './views/Universities/UniversitiesPage';
import University from './components/University/University';
import VisualizationsPage from './views/Visualization/VisualizationsPage';
import ProviderVizPage from './views/Visualization/ProviderVizPage';
import ErrorPage from './views/Invalid/ErrorPage';
import InvalidPage from './views/Invalid/InvalidPage';

import reportWebVitals from './reportWebVitals';

// React Popovers don't use React refs and I can't change their code
// but it causes a StrictMode error every single time the popover is
// rendered. This floods my console and makes it hard to debug other
// errors, so this silences that single findDOMNode message.
// eslint-disable-next-line
const consoleError = console.error.bind(console);
// eslint-disable-next-line
console.error = (errObj, ...args) => {
  if (args.includes('findDOMNode')) {
    return;
  }
  consoleError(errObj, ...args);
};

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Navbar */}
      <Navbar />
      {/* put a Route to each page here */}
      <Switch>
        {/* Splash Page */}
        <Route path="/" exact component={CampCatSplashPage} />

        {/* About Page */}
        <Route path="/about" exact component={AboutPage} />

        {/* Apartments Page */}
        <Route path="/housing" exact component={ApartmentsPage} />

        {/* Apartment instance based on id */}
        <Route
          path="/housing/:id"
          render={(props) => <Apartment id={props.match.params.id} />}
        />

        {/* Entertainments Page */}
        <Route
          path="/amenities"
          exact
          component={EntertainmentsPage}
        />

        {/* Entertainment instance based on id */}
        <Route
          path="/amenities/:id"
          render={(props) => (
            <Entertainment id={props.match.params.id} />
          )}
        />

        {/* Universities Page */}
        <Route
          path="/universities"
          exact
          component={UniversitiesPage}
        />

        {/* University instance based on id */}
        <Route
          path="/universities/:id"
          render={(props) => (
            <University id={props.match.params.id} />
          )}
        />

        {/* Search page with query */}
        <Route
          path="/search/q=:q"
          render={(props) => <Search q={props.match.params.q} />}
        />

        {/* Visualizations Page */}
        <Route
          path="/visualizations"
          exact
          component={VisualizationsPage}
        />
        <Route
          path="/provider_visualizations"
          exact
          component={ProviderVizPage}
        />

        {/* Error page */}
        <Route path="/error" exact component={ErrorPage} />

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
