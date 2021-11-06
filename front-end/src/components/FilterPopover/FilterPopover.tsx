import React from 'react';

import Button from 'react-bootstrap/Button';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { BsFilterCircle } from 'react-icons/bs';

import styles from './FilterPopover.module.css';

export type FilterPopoverOption = {
  header: string;
  key: string;
  values: Array<{
    value: string;
    displayStr: string;
    checked?: boolean;
  }>;
};

export type FilterPopoverProps = {
  options: Array<FilterPopoverOption>;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
};

const FilterPopover: React.FunctionComponent<FilterPopoverProps> = ({
  options,
  setFilter,
}: FilterPopoverProps) => {
  const applyFilter = () => {
    let output = '';
    options.forEach((option) => {
      let substr = `${option.key}=`;
      option.values.forEach((val) => {
        if (val.checked) {
          if (substr.slice(-1) != '=') substr += ',';
          substr += val.value;
        }
      });
      if (substr.slice(-1) != '=') output += '&' + substr;
    });
    setFilter(output);
  };

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
            onClick={() => {
              applyFilter();
              document.body.click();
            }}
          >
            Apply
          </Button>
        </div>
      </Popover.Title>
      <Popover.Content>
        {options.map((option, index) => {
          return (
            <div key={index}>
              <h4 className={styles.OptionHeader}>{option.header}</h4>

              {option.values.map((val, i2) => (
                <div key={i2} className={styles.InputDiv}>
                  <input
                    className={styles.Input}
                    type="checkbox"
                    defaultChecked={val.checked}
                    value={val.value}
                    id={option.key + '-' + val.value}
                    onClick={() => {
                      val.checked = !val.checked;
                    }}
                  />
                  <label htmlFor={val.value}>{val.displayStr}</label>
                </div>
              ))}
            </div>
          );
        })}
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
