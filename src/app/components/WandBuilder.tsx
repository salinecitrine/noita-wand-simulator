import { WandActionEditor } from './WandActionEditor';
import { WandStatsEditor } from './WandStatsEditor';
import { WandBorder } from './WandBorder';
import { SaveImageButton } from './generic';
import styled from 'styled-components';
import React, { useRef } from 'react';

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #0f0e0e;
  margin: 10px 0px;
`;
const ContentDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #000;
`;

const CopySpells = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: end;
  font-family: 'noita', '04b03', sans-serif;
  font-variant: small-caps;
  color: #929292;
`;

const WandActionEditorWrapper = styled.div`
  height: fit-content;
  width: fit-content;
`;

type Props = {};

export function WandBuilder(props: Props) {
  const wandRef = useRef<HTMLDivElement>();
  const spellsRef = useRef<HTMLDivElement>();

  return (
    <MainDiv>
      <WandBorder>
        <ContentDiv ref={wandRef as any} className={'saveImageRoot'}>
          <WandStatsEditor />
          <WandActionEditorWrapper
            ref={spellsRef as any}
            className={'saveImageRoot'}
          >
            <WandActionEditor />
          </WandActionEditorWrapper>
        </ContentDiv>
      </WandBorder>
      <CopySpells>
        <SaveImageButton
          targetRef={spellsRef}
          fileName={'spells'}
          enabled={true}
        />
        <span>Spells</span>
        <SaveImageButton targetRef={wandRef} fileName={'wand'} enabled={true} />
        <span>Wand</span>
      </CopySpells>
    </MainDiv>
  );
}
