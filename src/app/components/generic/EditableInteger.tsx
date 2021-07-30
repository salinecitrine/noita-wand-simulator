import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const StaticValue = styled.div`
  height: 15px;
`;
const EditingValue = styled.input`
  height: 15px;
  margin: 0;
  padding: 0 2px;
  border: none;
  width: 70%;
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
  const inputRef = useRef<HTMLInputElement>();

  const {
    value,
    step,
    onChange,
    formatValue,
    convertRawValue,
    convertDisplayValue,
  } = props;

  const handleSaveChange = () => {
    onChange(currentValue);
    setIsEditing(false);
  };

  useEffect(() => {
    if (inputRef && inputRef.current && isEditing) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <EditingValue
        ref={inputRef as any}
        type="number"
        value={convertRawValue ? convertRawValue(currentValue) : currentValue}
        onChange={(e) => {
          const displayValue = Number.parseFloat(e.target.value || '0');
          if (!Number.isNaN(displayValue)) {
            setCurrentValue(
              convertDisplayValue
                ? convertDisplayValue(displayValue)
                : displayValue,
            );
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
      <StaticValue onClick={() => setIsEditing(true)}>
        {formatValue ? formatValue(value) : value}
      </StaticValue>
    );
  }
}
