import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import styled from 'styled-components';

const StaticValue = styled.div`
  height: 15px;
  margin: 0;
  padding: 0 2px;
  border: none;
`;

const EditingValue = styled.input`
  height: 100%;
  margin: 0;
  padding: 0 2px;
  border: none;

  width: 100%;
  flex: 1 1 100%;
  background-color: #000;
  font-family: 'noita', '04b03', sans-serif;
  font-size: 16px;
  color: #fff;
  text-align: left;

  &:focus,
  &:focus-visible {
    border: none;
    outline: 0px solid #dea71bcf;
    background-color: #000;
    outline-style: none;
    border-style: none;
  }
`;

type EditableIntegerProps = {
  value: number;
  step?: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  convertRawValue?: (rawValue: number) => number;
  convertDisplayValue?: (displayValue: number) => number;
};

export function EditableInteger(props: EditableIntegerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(props.value);
  const [isInvalidValue, setIsInvalidValue] = useState(false);
  const [invalidValue, setInvalidValue] = useState('');
  const inputRef = useRef<HTMLInputElement>();

  const {
    value,
    step,
    onChange,
    formatValue,
    convertRawValue,
    convertDisplayValue,
  } = props;

  const handleSaveChange = useCallback(() => {
    if (!isInvalidValue) {
      onChange(currentValue);
    } else {
      setCurrentValue(value);
      setIsInvalidValue(false);
    }
    setIsEditing(false);
  }, [currentValue, isInvalidValue, onChange, value]);

  const handleStartEditing = useCallback(() => {
    setCurrentValue(value);
    setIsEditing(true);
  }, [value]);

  useEffect(() => {
    if (inputRef && inputRef.current && isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  if (isEditing) {
    let elementValue;
    if (isInvalidValue) {
      elementValue = invalidValue;
    } else {
      elementValue = currentValue;
      if (convertRawValue) {
        elementValue = convertRawValue(currentValue);
      }
    }
    return (
      <EditingValue
        ref={inputRef as any}
        step={step}
        type="number"
        value={elementValue}
        onChange={(e) => {
          const displayValue = Number.parseFloat(e.target.value);
          if (!Number.isNaN(displayValue)) {
            setIsInvalidValue(false);
            setCurrentValue(
              convertDisplayValue
                ? convertDisplayValue(displayValue)
                : displayValue,
            );
          } else {
            setIsInvalidValue(true);
            setInvalidValue(e.target.value);
          }
        }}
        onBlur={(e) => handleSaveChange()}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSaveChange();
          }
        }}
      />
    );
  } else {
    return (
      <StaticValue onClick={handleStartEditing}>
        {formatValue ? formatValue(value) : value}
      </StaticValue>
    );
  }
}
