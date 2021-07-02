import styled from 'styled-components';

const StyledList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  font-family: monospace;
  background-color: #333;
  color: #fff;
  font-weight: bold;
  min-width: 230px;
  border: 2px solid black;
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
  mana_drain?: number;
  other_fields?: string;
};

function field<K extends keyof Fields = keyof Fields>(
  name: K,
  displayName: string,
  render: (v: string | number) => string
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
  field('mana_drain', 'Mana Drain', (v) => `${sign(round(Number(v), 0))}`),
  field('other_fields', 'Mana Drain', (v) => `${v}`),
];

type Props = {
  fields: Fields;
};

export function ProjectileMetadata(props: Props) {
  return (
    <StyledList>
      {fieldRenderers.map(({ name, displayName, render }) => {
        const value = props.fields[name];
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
