import { useAppSelector } from '../redux/hooks';
import { selectWand } from '../redux/wandSlice';
import { Wand } from '../types';
import styled from 'styled-components';

const fields = [
  {
    name: 'Shuffle',
    render: (wand: Wand) => (wand.shuffle_deck_when_empty ? 'Yes' : 'No'),
  },
  { name: 'Spells/Cast', render: (wand: Wand) => wand.actions_per_round },
  { name: 'Cast delay', render: (wand: Wand) => wand.cast_delay },
  { name: 'Rechrg. Time', render: (wand: Wand) => wand.reload_time },
  { name: 'Mana max', render: (wand: Wand) => wand.mana_max },
  { name: 'Mana chg. Spd', render: (wand: Wand) => wand.mana_charge_speed },
  { name: 'Capacity', render: (wand: Wand) => wand.deck_capacity },
  { name: 'Spread', render: (wand: Wand) => wand.spread },
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

  return (
    <StyledList>
      {fields.map(({ name, render }, index) => (
        <StyledListItem key={index}>
          <StyledName>{name}</StyledName>
          <StyledValue>{render(wand)}</StyledValue>
        </StyledListItem>
      ))}
    </StyledList>
  );
}
