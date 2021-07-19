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
    margin: 0;
  }
`;

const SpacerDiv = styled.div`
  display: flex;
  align-self: center;
  width: 200px;
  margin-left: 15px;
`;

const ExtraDiv = styled.div`
  display: flex;
  align-self: center;
  width: 200px;
  margin-right: 15px;
`;

export function MainHeader(props: React.PropsWithChildren<Props>) {
  return (
    <HeaderDiv>
      <SpacerDiv />
      <h2>Noita Wand Simulator</h2>
      <ExtraDiv>{props.children}</ExtraDiv>
    </HeaderDiv>
  );
}
