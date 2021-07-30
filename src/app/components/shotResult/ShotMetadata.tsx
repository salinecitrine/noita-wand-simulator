import styled from 'styled-components';

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
`;

const StyledListItem = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
  width: 100%;
`;

const StyledName = styled.span`
  text-align: left;
  flex: 0 0 150px;
`;

const StyledValue = styled.span`
  text-align: left;
  flex: 0 0 100%;
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

function sign(v: number) {
  return (v < 0 ? '' : '+') + v;
}

function round(v: number, decimalPlaces: number) {
  return (
    Math.round(Number(v) * Math.pow(10, decimalPlaces)) /
    Math.pow(10, decimalPlaces)
  );
}

const fieldRenderers = [
  field('manaDrain', 'Mana Drain', (v) => <span>{round(Number(v), 0)}</span>),
  field('castDelay', 'Cast Delay', (v) => (
    <span>{round(Math.max(0, Number(v) / 60), 2)}s</span>
  )),
  field('rechargeDelay', 'Recharge Delay', (v) => (
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
