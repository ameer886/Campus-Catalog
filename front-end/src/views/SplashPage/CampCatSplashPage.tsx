import React from 'react';
import './CampCatSplashPage.css';

import GenericTable, {
  ColumnDefinitionType,
} from '../../components/GenericTable/GenericTable';

/*
 * The Splash Page
 * This is where everyone will arrive by default
 * Should contain links to all model pages and the about page
 */
const CampCatSplashPage: React.FunctionComponent = () => {
  type IceCream = {
    flavor: string;
    price: number;
  };

  const exampleRows: Array<IceCream> = [
    {
      flavor: 'Vanilla',
      price: 4.31,
    },
    {
      flavor: 'Chocolate',
      price: 5.88,
    },
    {
      flavor: 'Neopolitan',
      price: 6.99,
    },
  ];
  const exampleHeaders: ColumnDefinitionType<
    IceCream,
    keyof IceCream
  >[] = [
    {
      key: 'flavor',
      header: 'Flavor',
      sortFunc: (a: string, b: string) => a.localeCompare(b),
    },
    {
      key: 'price',
      header: 'Price',
      sortFunc: (a: number, b: number) => a - b,
    },
  ];

  return (
    <div className="App">
      <h1>Hello world!</h1>
      <GenericTable
        columnDefinitions={exampleHeaders}
        data={exampleRows}
      />
    </div>
  );
};

export default CampCatSplashPage;
