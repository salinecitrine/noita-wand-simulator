import React from 'react';
import styled from 'styled-components';

const BackgroundDiv = styled.div`
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);

  display: flex;
  justify-content: center;
  align-items: center;
`;

const MainDiv = styled.div`
  border: 2px solid #aaa;
  background-color: #ccc;
  padding: 10px;
`;

type Props = {
  visible: boolean;
};

export function ProcessingModal(props: React.PropsWithChildren<Props>) {
  const { visible, children } = props;

  if (!visible) {
    return null;
  }

  return (
    <BackgroundDiv>
      <MainDiv>{children}</MainDiv>
    </BackgroundDiv>
  );
}
