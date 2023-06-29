import styled from 'styled-components';

type Props = {};

const HeaderDiv = styled.div`
  display: flex;
  flex-direction: row;
  color: #eee;
  background-color: #000;
  justify-content: space-between;
  background-image: url(/logo/logo.png);
  background-size: contain;
  background-repeat: no-repeat;
  height: 60px;
  image-rendering: pixelated;
  margin: 14px 16px;
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
