import React from 'react';
import {
  GoogleMap,
  LoadScript,
  Marker,
} from '@react-google-maps/api';

export type Position = {
  lat: number;
  lng: number;
};

type LocationProps = {
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
 * Create an interactive google map centered at the provided
 * latitude and longitude (both in the position prop)
 */
const Location: React.FunctionComponent<LocationProps> = ({
  position,
}: LocationProps) => {
  return (
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
  );
};

export default Location;
