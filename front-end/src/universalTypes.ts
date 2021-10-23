export type MinMaxPair = {
  min: number;
  max: number;
};

export type Address = {
  city: string;
  neighborhood?: string;
  state: string;
  'street address': string;
  zipcode: string;
};

export type UniversityKey = {
  university_id: string;
  university_name: string;
};

export type PropertyKey = {
  property_id: string;
  property_name: string;
};

export type AmenityKey = {
  amenity_id: string;
  amenity_name: string;
};
