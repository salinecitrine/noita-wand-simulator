import { actions } from '../calc/__generated__/gun_actions';
import { WandActionDragSource } from './wandAction/WandActionDragSource';
import styled from 'styled-components';
import { useMemo } from 'react';
import SectionHeader from './SectionHeader';
import { WandAction } from './wandAction/WandAction';
import WandActionBorder from './wandAction/WandActionBorder';
import { useAppSelector } from '../redux/hooks';
import { ConfigState, selectConfig } from '../redux/configSlice';
import { Action } from '../calc/extra/types';
import {
  ActionType,
  ActionTypeId,
  groupBy,
  actionTypeToIdMap,
  actionTypeInfoMap,
  objectEntries,
} from '../util/util';
import { Tabs } from './generic/Tabs';

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
    return groupBy(
      unlockedActions,
      ({ type }) => actionTypeToIdMap.get(type as ActionTypeId) as ActionType,
    );
  }, [unlockedActions]);

  const tabPerType = useMemo(() => {
    return objectEntries(actionsByType)
      .reverse()
      .map(([actionType, actions]) => {
        const actionTypeMapping = actionTypeInfoMap[actionType];

        return {
          title: actionTypeMapping?.name,
          iconSrc: actionTypeMapping?.src,
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

  const allInOneTab = useMemo(() => {
    return [
      {
        title: 'All Spells',
        iconSrc: '',
        content: (
          <SpellCategorySpellsDiv>
            {actions.map((a) => (
              <WandActionSelect action={a} size={32} key={a.id} />
            ))}
          </SpellCategorySpellsDiv>
        ),
      },
    ];
  }, []);

  const tabs = useMemo(() => {
    if (config.showSpellsInCategories) {
      return tabPerType;
    } else {
      return allInOneTab;
    }
  }, [allInOneTab, config.showSpellsInCategories, tabPerType]);

  return (
    <MainDiv>
      <SectionHeader title={'Spells'} />
      <Tabs tabs={tabs} />
    </MainDiv>
  );
}
