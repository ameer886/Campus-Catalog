import React from 'react';
import styles from './SplashGrid.module.css';

import ApartmentImg from './Images/Apartment.png';
import HarvardImg from './Images/Harvard.png';
import EntertainmentImg from './Images/Entertainment.png';
import { Nav } from 'react-bootstrap';

type CardProps = {
  href: string;
  title: string;
  img: string;
};

const allCards: CardProps[] = [
  {
    href: '/amenities',
    title: 'Amenities',
    img: EntertainmentImg,
  },
  {
    href: '/universities',
    title: 'Universities',
    img: HarvardImg,
  },
  {
    href: '/housing',
    title: 'Housing',
    img: ApartmentImg,
  },
];

type SplashCardProps = {
  card: CardProps;
};

const SplashCard: React.FunctionComponent<SplashCardProps> = ({
  card,
}: SplashCardProps) => {
  return (
    <Nav.Link href={card.href}>
      <div className={styles.SplashCardContainer}>
        <span className={styles.CardLabel}>{card.title}</span>
        <div className={styles.SplashCard}>
          <img
            className={styles.SplashImg}
            src={card.img}
            alt={card.title + ' img'}
          />
        </div>
      </div>
    </Nav.Link>
  );
};

/*
 * A grid of 3 cards
 * Each card will link to one models page
 */
const SplashGrid: React.FunctionComponent = () => {
  return (
    <div className={styles.Centering}>
      <div className={styles.SplashGridContainer}>
        {allCards.map((card, index) => (
          <SplashCard card={card} key={index} />
        ))}
      </div>
    </div>
  );
};

export default SplashGrid;
