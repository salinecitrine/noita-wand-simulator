import { WandActionEditor } from './WandActionEditor';
import { WandStatsEditor } from './WandStatsEditor';
import styled from 'styled-components';
import SectionHeader from './SectionHeader';
import { SaveImageButton } from './generic';
import React, { useRef } from 'react';

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #0f0e0e;
`;
const ContentDiv = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #0f0e0e;
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
      <ContentDiv ref={wandRef as any} className={'saveImageRoot'}>
        <WandStatsEditor />
        <WandActionEditorWrapper
          ref={spellsRef as any}
          className={'saveImageRoot'}
        >
          <WandActionEditor />
        </WandActionEditorWrapper>
      </ContentDiv>
      <SectionHeader
        title={
          <>
            Save image:&nbsp;&nbsp;&nbsp;
            <SaveImageButton
              targetRef={spellsRef}
              fileName={'spells'}
              enabled={true}
            />
            spells only&nbsp;&nbsp;&nbsp;
            <SaveImageButton
              targetRef={wandRef}
              fileName={'wand'}
              enabled={true}
            />
            both
          </>
        }
      />
    </MainDiv>
  );
}
