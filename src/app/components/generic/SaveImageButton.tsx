import styled from 'styled-components';
import React, { useState } from 'react';
import { ProcessingModal } from './ProcessingModal';
import { exportComponentAsPNG } from 'react-component-export-image';

const StyledSpan = styled.span<{ enabled: boolean }>`
  cursor: pointer;
  font-size: 16px;
  margin: 0 2px;
  pointer-events: ${(props) => (props.enabled ? 'inherit' : 'none')};
  opacity: ${(props) => (props.enabled ? 1 : 0.3)};
`;

type Props = {
  targetRef: React.MutableRefObject<any>;
  fileName: string;
  enabled: boolean;
};

export function SaveImageButton(props: Props) {
  const [isProcessing, setIsProcessing] = useState(false);

  const saveImageHandler =
    (ref: React.MutableRefObject<any>, fileName: string) => () => {
      if (ref.current) {
        setIsProcessing(true);
        exportComponentAsPNG(ref as any, {
          fileName,
          html2CanvasOptions: {
            backgroundColor: '#000',
            imageTimeout: 0,
            onclone: (document) => {
              console.log(document);
              for (const elem of document.getElementsByClassName(
                'saveImageRoot',
              )) {
                console.log(elem);
                (elem as any).style.width = 'fit-content';
                (elem as any).style.overflowX = 'clip';
              }
            },
          },
        }).then(() => {
          setIsProcessing(false);
        });
      }
    };

  return (
    <>
      <StyledSpan
        onClick={saveImageHandler(props.targetRef, props.fileName)}
        enabled={props.enabled}
      >
        📷
      </StyledSpan>
      <ProcessingModal visible={isProcessing}>Processing...</ProcessingModal>
    </>
  );
}
