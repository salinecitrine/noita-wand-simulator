import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { CloseButton } from './CloseButton';

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

const HeaderDiv = styled.div`
  display: flex;
  flex-direction: row;
  color: #111;
  background-color: #999;
  font-weight: bold;
  text-align: center;
  justify-content: space-between;
  padding-left: 5px;
`;

const TitleDiv = styled.div``;

const ContentDiv = styled.div`
  padding: 5px;
`;

type Props = {
  title: string;
  visible: boolean;
  onClose: () => void;
};

export function Modal(props: React.PropsWithChildren<Props>) {
  const { title, visible, onClose } = props;

  const handleClose = useCallback(
    (e?: React.MouseEvent<HTMLDivElement>) => {
      if (!e || e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [handleClose]);

  if (!visible) {
    return null;
  }

  return (
    <BackgroundDiv onClick={handleClose}>
      <MainDiv>
        <HeaderDiv>
          <TitleDiv>{title}</TitleDiv>
          <CloseButton onClick={handleClose} />
        </HeaderDiv>
        <ContentDiv>{props.children}</ContentDiv>
      </MainDiv>
    </BackgroundDiv>
  );
}
