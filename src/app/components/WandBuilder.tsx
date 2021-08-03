import { WandActionEditor } from './WandActionEditor';
import { WandStatsEditor } from './WandStatsEditor';
import styled from 'styled-components';
import SectionHeader from './SectionHeader';
import { SaveImageButton } from './generic/SaveImageButton';
import React, { useRef } from 'react';
import { WandPermanentActionEditor } from './WandPermanentActionEditor';

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #555;
`;
const ContentDiv = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #555;
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
      <SectionHeader
        title={'Wand'}
        rightChildren={
          <>
            <SaveImageButton
              targetRef={spellsRef}
              fileName={'spells'}
              enabled={true}
            />
            (spells only)
            <SaveImageButton
              targetRef={wandRef}
              fileName={'wand'}
              enabled={true}
            />
            (both)
          </>
        }
      />
      <ContentDiv ref={wandRef as any} className={'saveImageRoot'}>
        <div>
          <WandStatsEditor />
          <WandPermanentActionEditor />
        </div>
        <WandActionEditorWrapper
          ref={spellsRef as any}
          className={'saveImageRoot'}
        >
          <WandActionEditor />
        </WandActionEditorWrapper>
      </ContentDiv>
    </MainDiv>
  );
}
