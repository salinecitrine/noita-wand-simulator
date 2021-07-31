import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectWand, setWand } from '../redux/wandSlice';
import { Wand } from '../types';
import styled from 'styled-components';
import { AppDispatch } from '../redux/store';
import { EditableInteger } from './generic/EditableInteger';
import { numSign, round, TypedProperties } from '../util/util';

const CheckboxField = styled.input`
  margin: 1px;
`;

type NumberFieldProps = {
  field: keyof TypedProperties<Wand, number>;
  step?: number;
  formatValue?: (value: number) => string;
  convertRawValue?: (rawValue: number) => number;
  convertDisplayValue?: (displayValue: number) => number;
};

const renderNumberField =
  ({
    field,
    step,
    formatValue,
    convertRawValue,
    convertDisplayValue,
  }: NumberFieldProps) =>
  (wand: Wand, dispatch: AppDispatch) => {
    return (
      <EditableInteger
        value={wand[field]}
        onChange={(value) =>
          dispatch(
            setWand({
              wand: { ...wand, [field]: value },
            }),
          )
        }
        step={step}
        formatValue={formatValue}
        convertRawValue={convertRawValue}
        convertDisplayValue={convertDisplayValue}
      />
    );
  };

const fields = [
  {
    name: 'Shuffle',
    render: (wand: Wand, dispatch: AppDispatch) => (
      <CheckboxField
        type="checkbox"
        checked={wand.shuffle_deck_when_empty}
        onChange={(e) =>
          dispatch(
            setWand({
              wand: { ...wand, shuffle_deck_when_empty: e.target.checked },
            }),
          )
        }
      />
    ),
  },
  {
    name: 'Spells/Cast',
    render: renderNumberField({ field: 'actions_per_round' }),
  },
  {
    name: 'Cast delay',
    render: renderNumberField({
      field: 'cast_delay',
      step: 0.01,
      formatValue: (v) => `${round(Number(v) / 60, 2)}s`,
      convertRawValue: (v) => round(v / 60, 2),
      convertDisplayValue: (v) => round(v * 60, 2),
    }),
  },
  {
    name: 'Rechrg. Time',
    render: renderNumberField({
      field: 'reload_time',
      step: 0.01,
      formatValue: (v) => `${round(Number(v) / 60, 2)}s`,
      convertRawValue: (v) => round(v / 60, 2),
      convertDisplayValue: (v) => round(v * 60, 2),
    }),
  },
  { name: 'Mana max', render: renderNumberField({ field: 'mana_max' }) },
  {
    name: 'Mana chg. Spd',
    render: renderNumberField({ field: 'mana_charge_speed' }),
  },
  {
    name: 'Capacity',
    render: renderNumberField({ field: 'deck_capacity' }),
  },
  {
    name: 'Spread',
    render: renderNumberField({
      field: 'spread',
      formatValue: (v) => `${round(Number(v), 1)} deg`,
    }),
  },
];

const StyledList = styled.div`
  display: flex;
  align-self: flex-start;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  font-family: monospace;
  background-color: #333;
  color: #fff;
  font-weight: bold;
  min-width: 200px;
  padding: 1px;
`;
const StyledListItem = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  width: 100%;
`;
const StyledName = styled.span`
  text-align: left;
  flex: 0 0 60%;
`;
const StyledValue = styled.span`
  text-align: left;
  flex: 0 0 40%;
`;

type Props = {};

export function WandStatsEditor(props: Props) {
  const { wand } = useAppSelector(selectWand);
  const dispatch = useAppDispatch();

  return (
    <StyledList>
      {fields.map(({ name, render }, index) => (
        <StyledListItem key={index}>
          <StyledName>{name}</StyledName>
          <StyledValue>{render(wand, dispatch)}</StyledValue>
        </StyledListItem>
      ))}
    </StyledList>
  );
}
