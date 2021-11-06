import React from 'react';

import Button from 'react-bootstrap/Button';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { BsFilterCircle } from 'react-icons/bs';

import styles from './FilterPopover.module.css';

const FilterPopover: React.FunctionComponent = () => {
  const inputArray = [
    { value: '1', displayStr: 'Option 1' },
    { value: '2', displayStr: 'Option 2' },
    { value: '3', displayStr: 'Option 3' },
  ];

  const pop = (
    <Popover id="popover-basic" style={{ minWidth: '360px' }}>
      <Popover.Title>
        <div className={styles.TitleSplitter}>
          <h3>Filter Options</h3>

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
            Apply
          </Button>
        </div>
      </Popover.Title>
      <Popover.Content>
        <p>Select one of the following:</p>

        {inputArray.map((item, index) => (
          <div key={index} className={styles.InputDiv}>
            <input
              className={styles.Input}
              type="checkbox"
              value={item.value}
              id={item.value}
            />
            <label htmlFor={item.value}>{item.displayStr}</label>
          </div>
        ))}
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
