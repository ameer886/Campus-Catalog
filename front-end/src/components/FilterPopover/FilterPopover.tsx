import React from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { BsFilterCircle } from 'react-icons/bs';

import styles from './FilterPopover.module.css';

type FilterPopoverCheckboxOption = {
  header: string;
  key: string;
  values: Array<{
    value: string;
    displayStr: string;
    __checked?: boolean; // For internal use only, please don't set this
  }>;
};

type FilterPopoverInputOption = {
  header: string;
  key: string;
  displayStr: string;
  __value?: string; // For internal use only, please don't set this
};

export type FilterPopoverOption =
  | FilterPopoverCheckboxOption
  | FilterPopoverInputOption;

export type FilterPopoverProps = {
  options: Array<FilterPopoverOption>;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
};

function isCheckboxOption(x: FilterPopoverOption): boolean {
  return (x as FilterPopoverCheckboxOption).values != null;
}
function isInputOption(x: FilterPopoverOption): boolean {
  return (x as FilterPopoverInputOption).displayStr != null;
}

const FilterPopover: React.FunctionComponent<FilterPopoverProps> = ({
  options,
  setFilter,
}: FilterPopoverProps) => {
  const applyFilter = () => {
    let output = '';
    options.forEach((option) => {
      let substr = `${option.key}=`;

      if (isCheckboxOption(option)) {
        (option as FilterPopoverCheckboxOption).values.forEach(
          (val) => {
            if (val.__checked) {
              if (substr.slice(-1) != '=') substr += ',';
              substr += val.value;
            }
          },
        );
      } else if (isInputOption(option)) {
        const cast = option as FilterPopoverInputOption;
        substr += cast.__value ?? '';
      }

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

              {isCheckboxOption(option) &&
                (option as FilterPopoverCheckboxOption).values.map(
                  (val, i2) => (
                    <div key={i2} className={styles.CheckDiv}>
                      <input
                        className={styles.Check}
                        type="checkbox"
                        defaultChecked={val.__checked}
                        value={val.value}
                        id={option.key + '-' + val.value}
                        onClick={() => {
                          val.__checked = !val.__checked;
                        }}
                      />
                      <label htmlFor={val.value}>
                        {val.displayStr}
                      </label>
                    </div>
                  ),
                )}

              {isInputOption(option) && (
                <div className={styles.CheckDiv}>
                  <Form>
                    <Form.Group style={{ display: 'flex' }}>
                      <Form.Label className={styles.InputLabel}>
                        Enter a{' '}
                        {
                          (option as FilterPopoverInputOption)
                            .displayStr
                        }{' '}
                        here:
                      </Form.Label>
                      <Form.Control
                        id={option.key}
                        defaultValue={
                          (option as FilterPopoverInputOption).__value
                        }
                        onChange={(e) =>
                          ((
                            option as FilterPopoverInputOption
                          ).__value = e.target.value)
                        }
                      />
                    </Form.Group>
                  </Form>
                </div>
              )}
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
