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

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const AllSpellsDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const SpellCategoryDiv = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #333;
  min-width: 100px;
`;

const SpellCategoryHeaderDiv = styled.div`
  display: flex;
  white-space: nowrap;
  background-color: #444;
  color: #ddd;
  justify-content: center;
  padding: 0 2px;
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
    <WandActionBorder size={24}>
      <WandAction action={props.action} size={24} />
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

  const wandActionSelects = useMemo(() => {
    return Object.entries(actionsByType).map(([category, actions]) => {
      return (
        <SpellCategoryDiv>
          <SpellCategoryHeaderDiv>{category}</SpellCategoryHeaderDiv>
          <SpellCategorySpellsDiv>
            {actions.map((a) => (
              <WandActionSelect action={a} size={24} />
            ))}
          </SpellCategorySpellsDiv>
        </SpellCategoryDiv>
      );
    });
  }, [actionsByType]);

  return (
    <MainDiv>
      <SectionHeader>Spells</SectionHeader>
      <AllSpellsDiv>{wandActionSelects}</AllSpellsDiv>
    </MainDiv>
  );
}
