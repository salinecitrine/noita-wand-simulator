import { actions } from '../calc/__generated__/gun_actions';
import { WandActionDragSource } from './wandAction/WandActionDragSource';
import styled from 'styled-components';
import { useMemo } from 'react';
import SectionHeader from './SectionHeader';
import { WandAction } from './wandAction/WandAction';
import WandActionBorder from './wandAction/WandActionBorder';

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const SpellsDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

type Props = {};

export function SpellSelector(props: Props) {
  const wandActions = useMemo(
    () =>
      actions.map((a, index) => (
        <WandActionDragSource actionId={a.id} key={index}>
          <WandActionBorder size={24}>
            <WandAction action={a} size={24} />
          </WandActionBorder>
        </WandActionDragSource>
      )),
    []
  );
  return (
    <MainDiv>
      <SectionHeader>Spells</SectionHeader>
      <SpellsDiv>{wandActions}</SpellsDiv>
    </MainDiv>
  );
}
