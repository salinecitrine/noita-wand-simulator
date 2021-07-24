import { actions } from '../calc/__generated__/gun_actions';
import { WandActionDragSource } from './wandAction/WandActionDragSource';
import styled from 'styled-components';
import { useMemo } from 'react';
import SectionHeader from './SectionHeader';
import { WandAction } from './wandAction/WandAction';
import WandActionBorder from './wandAction/WandActionBorder';
import { useAppSelector } from '../hooks';
import { ConfigState, selectConfig } from '../redux/configSlice';
import { Action } from '../calc/extra/types';

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const SpellsDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const isSpellUnlocked = (
  unlocks: ConfigState['config']['unlocks'],
  spell: Action
) => {
  return !spell.spawn_requires_flag || unlocks[spell.spawn_requires_flag];
};

type Props = {};

export function SpellSelector(props: Props) {
  const { config } = useAppSelector(selectConfig);

  const wandActions = useMemo(
    () =>
      actions
        .filter((a) => isSpellUnlocked(config.unlocks, a))
        .map((a, index) => (
          <WandActionDragSource actionId={a.id} key={index}>
            <WandActionBorder size={24}>
              <WandAction action={a} size={24} />
            </WandActionBorder>
          </WandActionDragSource>
        )),
    [config.unlocks]
  );
  return (
    <MainDiv>
      <SectionHeader>Spells</SectionHeader>
      <SpellsDiv>{wandActions}</SpellsDiv>
    </MainDiv>
  );
}
