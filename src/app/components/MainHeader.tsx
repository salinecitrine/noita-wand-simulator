import styled from 'styled-components';

type Props = {};

const HeaderDiv = styled.div`
  display: flex;
  flex-direction: row;
  color: #111;
  background-color: #bbb;
  justify-content: space-between;

  h2 {
    font-weight: bold;
    margin: 0 0 0 20px;
  }
`;

const SpacerDiv = styled.div`
  display: flex;
  align-self: center;
`;

const ExtraDiv = styled.div`
  display: flex;
  align-self: center;
  width: 220px;
  margin-right: 15px;
`;

export function MainHeader(props: React.PropsWithChildren<Props>) {
  return (
    <HeaderDiv>
      <h2>Noita Wand Simulator</h2>
      <SpacerDiv />
      <ExtraDiv>{props.children}</ExtraDiv>
    </HeaderDiv>
  );
}
