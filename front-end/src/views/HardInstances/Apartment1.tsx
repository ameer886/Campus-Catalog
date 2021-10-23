import React from 'react';
import Apartment from '../../components/Apartment/Apartment';

import { ApartmentType } from '../Apartments/ApartmentsPage';
import Logo from '../Media/ParksidePlaceImage.png';

export const apartment1: ApartmentType = {
  amenities_nearby: [
    {
      amenity_id: '244565873',
      amenity_name: "Pannie-George's Kitchen",
    },
    {
      amenity_id: '330241705',
      amenity_name: 'Toomers Drugs',
    },
    {
      amenity_id: '376591454',
      amenity_name: 'Fusion Restaurant',
    },
    {
      amenity_id: '385491921',
      amenity_name: 'The Hound',
    },
    {
      amenity_id: '391731074',
      amenity_name: 'Acre',
    },
    {
      amenity_id: '670006396',
      amenity_name: 'The Depot',
    },
    {
      amenity_id: '821469929',
      amenity_name: "Sheila C's Burger Barn",
    },
  ],
  bath: {
    max: 2.5,
    min: 1.0,
  },
  bed: {
    max: 2.0,
    min: 0.0,
  },
  building_amenities: [
    'Washer/Dryer - In Unit',
    'Air Conditioning',
    'Dishwasher',
    'High Speed Internet Access',
    'Hardwood Floors',
    'Granite Countertops',
    'Microwave',
    'Refrigerator',
    'Wi-Fi',
    'Heating',
    'Ceiling Fans',
    'Smoke Free',
    'Cable Ready',
    'Tub/Shower',
    'Disposal',
    'Pantry',
    'Eat-in Kitchen',
    'Kitchen',
    'Oven',
    'Range',
    'Freezer',
    'Tile Floors',
    'Den',
    'Window Coverings',
    'Large Bedrooms',
  ],
  cat_allow: false,
  cat_weight: null,
  dog_allow: false,
  dog_weight: null,
  images: [
    'https://images1.apartments.com/i2/JGn_mFJoCMFpEreoQV63rncrHLRbi9wuYUEQim4Yrc0/111/343-s-gay-st-auburn-al-complex-exterior.jpg?p=1',
    'https://images1.apartments.com/i2/IZ_IsR6kGkDkV-V3bkMc-ub_jyS2McAApodlG8Vypi4/117/343-s-gay-st-auburn-al-building-photo.jpg?p=1',
    'https://images1.apartments.com/i2/kscpcYiVjKkDrEeUwCYFHXUw_DGQoJoRN12Ta508CIk/117/343-s-gay-st-auburn-al-building-photo.jpg?p=1',
    'https://images1.apartments.com/i2/BMc48RmG5t9k42drw4V_jHfYjBVzBrg_khfsU1D5fiQ/117/343-s-gay-st-auburn-al-building-photo.jpg?p=1',
    'https://images1.apartments.com/i2/iT1yriXio4v1KoVQD_7qq8tRYABoJDBtEjx-KtMfXZ8/117/343-s-gay-st-auburn-al-building-photo.jpg?p=1',
  ],
  location: {
    city: 'Auburn',
    neighborhood: 'Downtown Auburn',
    state: 'AL',
    'street address': '343 S Gay St',
    zipcode: '36830',
  },
  max_num_cat: 0,
  max_num_dog: 0,
  max_rent: 800,
  min_rent: 650,
  neighborhood: 'Downtown Auburn',
  property_id: '35erbsf',
  property_name: '343 S Gay St',
  property_type: 'condo',
  rating: 0.0,
  sqft: {
    max: 1000.0,
    min: 400.0,
  },
  transit_score: 0,
  universities_nearby: [
    {
      university_id: '100858',
      university_name: 'Auburn University',
    },
  ],
  util_included: null,
  walk_score: 62,

  id: '35erbsf',
};

/*
 * Hard-code a university here
 */
const Apartment1: React.FunctionComponent = () => {
  return (
    <>
      <Apartment aptQuery={apartment1} />

      <img src={Logo} width="300" alt="Logo" />
      <iframe
        id="HarvardMap"
        title="HarvardMap"
        width="600"
        height="400"
        src="https://www.mapquest.com/search/result?slug=%2Fus%2Fmassachusetts%2Fcambridge%2F02138-4586%2F700-huron-ave-42.380934,-71.154215&query=700%20Huron%20Ave,%20Cambridge,%20MA%2002138-4586&page=0&index=0"
      ></iframe>
    </>
  );
};

export default Apartment1;
