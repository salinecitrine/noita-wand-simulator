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
`;

const MainDiv = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #555;
  color: #eee;
  max-height: 100%;
  overflow-y: auto;
  box-shadow: -10px 10px 50px #000;
`;

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function Modal(props: React.PropsWithChildren<Props>) {
  const { visible } = props;

  if (!visible) {
    return null;
  }

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      props.onClose();
    }
  };

  return (
    <BackgroundDiv onClick={handleClose}>
      <MainDiv>{props.children}</MainDiv>
    </BackgroundDiv>
  );
}
