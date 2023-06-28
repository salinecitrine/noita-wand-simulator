import styled from 'styled-components';

type Props = {};

const HeaderDiv = styled.div`
  display: flex;
  flex-direction: row;
  color: #eee;
  background-color: #000;
  justify-content: space-between;
  background-image: url(/logo.png);
  background-size: contain;
  background-repeat: no-repeat;
  height: 38px;
  image-rendering: pixelated;
  margin: 8px;
`;

const SpacerDiv = styled.div`
  display: flex;
  align-self: center;
`;

const ExtraDiv = styled.div`
  display: flex;
  align-self: end;
  margin-right: 15px;
`;

export function MainHeader({ children }: React.PropsWithChildren<Props>) {
  return (
    <HeaderDiv>
      <SpacerDiv />
      <ExtraDiv>{children}</ExtraDiv>
    </HeaderDiv>
  );
}
