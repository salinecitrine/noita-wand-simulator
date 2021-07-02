import styled from 'styled-components';

type Props = {};

const HeaderDiv = styled.div`
  color: #111;
  background-color: #bbb;
  font-weight: bold;
  text-align: center;

  h2 {
    margin: 0;
  }
`;

export function MainHeader(props: Props) {
  return (
    <HeaderDiv>
      <h2>Noita Wand Simulator</h2>
    </HeaderDiv>
  );
}
