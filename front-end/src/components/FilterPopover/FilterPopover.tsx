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
  variant: 'checkbox' | 'radio';
  boxValues: Array<{
    value: string;
    displayStr: string;
    // Generally __checked is for internal use only.
    // However, if you want a component to default to being checked,
    // you can set this to true.
    __checked?: boolean;
  }>;
};

type FilterPopoverInputOption = {
  header: string;
  key: string;
  inputValues: Array<{
    type?: 'string' | 'number';
    min?: number; // Define min and max for number input, if desired
    max?: number; // These values are ignored for string inputs
    cleanFunc?: (e: string) => string; // cleans a user input if needed
    displayStr: string;
    __value?: string; // For internal use only, please don't set this
  }>;
};

export type FilterPopoverOption =
  | FilterPopoverCheckboxOption
  | FilterPopoverInputOption;

export type FilterPopoverProps = {
  options: Array<FilterPopoverOption>;
  setFilter:
    | React.Dispatch<React.SetStateAction<string>>
    | ((value: string) => void);
};

function isCheckboxOption(x: FilterPopoverOption): boolean {
  return (x as FilterPopoverCheckboxOption).variant != null;
}
function isInputOption(x: FilterPopoverOption): boolean {
  return (x as FilterPopoverInputOption).inputValues != null;
}

function getCheckboxElement(
  option: FilterPopoverCheckboxOption,
): JSX.Element {
  const inputs = option.boxValues.map((val, i) => (
    <div key={i} className={styles.CheckDiv}>
      <input
        className={styles.Check}
        type={option.variant ?? 'checkbox'}
        defaultChecked={val.__checked}
        value={val.value}
        id={option.key + '-' + val.value}
        name={option.header}
        onClick={() => {
          if (option.variant === 'radio') {
            option.boxValues.forEach(
              (button) => (button.__checked = false),
            );
          }
          val.__checked = !val.__checked;
        }}
      />
      <label htmlFor={val.value}>{val.displayStr}</label>
    </div>
  ));
  const mid = Math.ceil(inputs.length / 2);

  return (
    <div className={styles.CheckboxRow}>
      <div className={styles.CheckboxColumn}>
        {inputs.slice(0, mid)}
      </div>
      <div className={styles.CheckboxColumn}>{inputs.slice(mid)}</div>
    </div>
  );
}

function getInputElement(
  option: FilterPopoverInputOption,
): JSX.Element {
  return (
    <Form>
      <Form.Group
        style={{
          display: option.inputValues.length === 1 ? 'block' : 'flex',
          marginBottom: '8px',
        }}
      >
        {option.inputValues.map((val, i) => (
          <div key={i} style={{ display: 'flex' }}>
            <Form.Control
              id={option.key}
              defaultValue={val.__value}
              onChange={(e) => (val.__value = e.target.value)}
              placeholder={val.displayStr}
              type={val.type}
              min={val.type === 'number' ? val.min : undefined}
              max={val.type === 'number' ? val.max : undefined}
              style={{ margin: '0px 2px' }}
            />
            {i < option.inputValues.length - 1 && (
              <div className={styles.DashContainer}>
                <p style={{ margin: 0 }}>&#8212;</p>
              </div>
            )}
          </div>
        ))}
      </Form.Group>
    </Form>
  );
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
        (option as FilterPopoverCheckboxOption).boxValues.forEach(
          (val) => {
            if (val.__checked && val.value) {
              // Note: you can specify value = '' to make this
              // not run if you want no substr to be generated
              // This is useful, for example, if you have a boolean
              // decision like "has takeout", "does not have", or "any"
              if (substr.slice(-1) != '=') substr += ',';
              substr += val.value;
            }
          },
        );
      } else if (isInputOption(option)) {
        const cast = option as FilterPopoverInputOption;
        if (
          cast.inputValues.length == 2 &&
          cast.inputValues[0].type === 'number' &&
          cast.inputValues[1].type === 'number'
        ) {
          // NOTE: Assumed here that a 2 number input is a min/max pair
          const k = cast.key;
          const v1 = cast.inputValues[0].__value;
          const v2 = cast.inputValues[1].__value;
          substr = '';
          if (v1) substr += `min_${k}=${v1}`;
          if (v1 && v2) substr += '&';
          if (v2) substr += `max_${k}=${v2}`;
        } else {
          cast.inputValues.forEach((val) => {
            if (val.__value) {
              if (val.cleanFunc) substr += val.cleanFunc(val.__value);
              else substr += val.__value;
            }
          });
        }
      }

      if (substr.length > 0 && substr.slice(-1) != '=')
        output += '&' + substr;
    });
    if (output) setFilter(output);
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
                getCheckboxElement(
                  option as FilterPopoverCheckboxOption,
                )}

              {isInputOption(option) &&
                getInputElement(option as FilterPopoverInputOption)}
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
