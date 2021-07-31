import styled from 'styled-components';
import { round } from '../../util/util';

const StyledList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  font-family: monospace;
  background-color: #555;
  color: #fff;
  font-weight: bold;
  min-width: 230px;
  border: 1px solid black;
  border-bottom: none;
  padding: 1px;
`;

const StyledListItem = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
`;

const StyledName = styled.span`
  text-align: left;
  flex: 0 0 150px;
`;

const StyledValue = styled.span`
  text-align: left;
  flex: 0 0 auto;
`;

type Fields = {
  manaDrain?: number;
  castDelay?: number;
  rechargeDelay?: number;
};

function field<K extends keyof Fields = keyof Fields>(
  name: K,
  displayName: string,
  render: (v: string | number) => React.ReactElement,
) {
  return { name, displayName, render };
}

const fieldRenderers = [
  field('manaDrain', 'Σ Mana Drain', (v) => <span>{round(Number(v), 0)}</span>),
  field('castDelay', 'Σ Cast Delay', (v) => (
    <span>{round(Math.max(0, Number(v) / 60), 2)}s</span>
  )),
  field('rechargeDelay', 'Σ Recharge Delay', (v) => (
    <span>{round(Math.max(0, Number(v) / 60), 2)}s</span>
  )),
];

type Props = Fields & {};

export function ShotMetadata(props: Props) {
  return (
    <StyledList>
      {fieldRenderers.map(({ name, displayName, render }) => {
        const value = props[name];
        if (value == null) {
          return null;
        }
        return (
          <StyledListItem key={name}>
            <StyledName>{displayName}</StyledName>
            <StyledValue>{render(value)}</StyledValue>
          </StyledListItem>
        );
      })}
    </StyledList>
  );
}
