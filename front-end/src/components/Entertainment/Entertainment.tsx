import React from 'react';
import './Entertainment.css';
import { EntertainmentType } from '../../views/Entertainments/EntertainmentsPage';
import { NavLink } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import {
  GoogleMap,
  LoadScript,
  Marker,
} from '@react-google-maps/api';

type Position = {
  lat: number;
  lng: number;
};

type EntertainmentProps = {
  entQuery: EntertainmentType;
  image: string;
  position: Position;
};

const options = {
  disableDefaultUI: true,
};
const mapContainerStyle = {
  width: '50vw',
  height: '50vh',
  margin: 'auto',
};

/*
 * The instance page for a single entertainment building
 * Should contain a list of media relevant to this entertainment
 * Any attribute information should be passed in as a property
 */
const Entertainment: React.FunctionComponent<EntertainmentProps> = ({
  entQuery,
  image,
  position,
}: EntertainmentProps) => {
  return (
    <div className="Entertainment">
      <h1>{entQuery.businessName}</h1>
      <p>
        Welcome to the page for {entQuery.businessName}. It is a{' '}
        {entQuery.category} business.{' '}
      </p>
      <p>
        {' '}
        {entQuery.businessName} is located on {entQuery.location[0]},
        {entQuery.location[1]} {entQuery.location[2]}{' '}
        {entQuery.location[3]}. The age restriction is{' '}
        {entQuery.ageRestriction} and the price is {entQuery.price}.
        Is there delivery? The answer is{' '}
        {entQuery.delivery ?? 'there may or may not be delivery'}.
        Some universities that are close to this business are{' '}
        <NavLink to="/universities/id=1">Harvard University</NavLink>,{' '}
        <NavLink to="/universities/id=3">
          Princeton University
        </NavLink>
        , and{' '}
        <NavLink to="/universities/id=2">
          The University of Texas at Austin
        </NavLink>
        . Apartments that are located near this business include{' '}
        <NavLink to="/apartments/id=1">Parkside Place</NavLink>,{' '}
        <NavLink to="/apartments/id=3">3401 at Red River</NavLink>,
        and{' '}
        <NavLink to="/apartments/id=2">
          Barclay Square at Princeton Forrestal
        </NavLink>
        .
      </p>
      <Image
        src={image}
        style={{ width: '25vm', height: '25vh' }}
      ></Image>
      <LoadScript googleMapsApiKey="AIzaSyCOeYOyODSruMATuBCLEYIO44DJVFF2DzI">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={15}
          center={position}
          options={options}
        >
          <Marker position={position} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Entertainment;
