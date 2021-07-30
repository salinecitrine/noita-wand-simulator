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
import { ACTION_TYPES, constToDisplayString, groupBy } from '../util/util';
import { Tabs } from './generic/modal/Tabs';

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SpellCategorySpellsDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const isSpellUnlocked = (
  unlocks: ConfigState['config']['unlocks'],
  spell: Action,
) => {
  return !spell.spawn_requires_flag || unlocks[spell.spawn_requires_flag];
};

const categoryDisplayNames = ACTION_TYPES.map((c) => constToDisplayString(c));

type WandActionSelectProps = {
  action: Action;
  size: number;
};

const WandActionSelect = (props: WandActionSelectProps) => (
  <WandActionDragSource actionId={props.action.id} key={props.action.id}>
    <WandActionBorder size={props.size}>
      <WandAction action={props.action} size={props.size} />
    </WandActionBorder>
  </WandActionDragSource>
);

type Props = {};

export function SpellSelector(props: Props) {
  const { config } = useAppSelector(selectConfig);

  const unlockedActions = useMemo(
    () => actions.filter((a) => isSpellUnlocked(config.unlocks, a)),
    [config.unlocks],
  );

  const actionsByType = useMemo(() => {
    if (config.showSpellsInCategories) {
      return groupBy(unlockedActions, (a) => categoryDisplayNames[a.type]);
    } else {
      return {
        'All Spells': unlockedActions,
      };
    }
  }, [config.showSpellsInCategories, unlockedActions]);

  const tabs = useMemo(() => {
    return Object.entries(actionsByType).map(([category, actions]) => {
      return {
        title: category,
        content: (
          <SpellCategorySpellsDiv>
            {actions.map((a) => (
              <WandActionSelect action={a} size={32} key={a.id} />
            ))}
          </SpellCategorySpellsDiv>
        ),
      };
    });
  }, [actionsByType]);

  return (
    <MainDiv>
      <SectionHeader>Spells</SectionHeader>
      <Tabs tabs={tabs} />
    </MainDiv>
  );
}
