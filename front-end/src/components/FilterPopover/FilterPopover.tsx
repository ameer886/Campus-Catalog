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
    defaultChecked?: boolean;
    __checked?: boolean; // For internal use only, please don't set this
  }>;
};

type FilterPopoverInputOption = {
  header: string;
  key: string;
  inputValues: Array<{
    type?: 'string' | 'number';
    min?: number; // Define min and max for number input, if desired
    max?: number; // These values are ignored for string inputs
    displayStr: string;
    __value?: string; // For internal use only, please don't set this
  }>;
};

export type FilterPopoverOption =
  | FilterPopoverCheckboxOption
  | FilterPopoverInputOption;

export type FilterPopoverProps = {
  options: Array<FilterPopoverOption>;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
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
        defaultChecked={val.__checked ?? val.defaultChecked}
        value={val.value}
        id={option.key + '-' + val.value}
        name={option.header}
        onClick={() => {
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
      <Form.Group style={{ display: 'flex', marginBottom: '8px' }}>
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
            if (val.__checked) {
              if (substr.slice(-1) != '=') substr += ',';
              substr += val.value;
            }
          },
        );
      } else if (isInputOption(option)) {
        const cast = option as FilterPopoverInputOption;
        cast.inputValues.forEach((val) => {
          if (val.__value) substr += val.__value;
        });
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
