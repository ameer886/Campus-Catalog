import React from 'react';

import Button from 'react-bootstrap/Button';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { BsFilterCircle } from 'react-icons/bs';

import styles from './FilterPopover.module.css';

const FilterPopover: React.FunctionComponent = () => {
  const pop = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Filter Options</Popover.Title>
      <Popover.Content>
        <p>You found me!</p>

        {/*
         * This is a very unobvious way to close the popover
         * We make use of the rootClose parameter of the
         * OverlayTrigger and simulate a click onto the document
         * This click hits nothing but still closes the popover
         */}
        <Button
          aria-label="Close"
          onClick={() => document.body.click()}
        >
          Close
        </Button>
      </Popover.Content>
    </Popover>
  );

  return (
    <div>
      <OverlayTrigger
        placement="bottom"
        overlay={pop}
        trigger="click"
        rootClose // Closes popover when clicking outside
      >
        <Button className={styles.PopoverButton}>
          <BsFilterCircle className={styles.IconAdjust} />
        </Button>
      </OverlayTrigger>
    </div>
  );
};

export default FilterPopover;
