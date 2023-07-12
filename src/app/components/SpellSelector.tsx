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
import { Tabs } from './generic';
import {
  ExportButton,
  LoadButton,
  ResetButton,
  UndoButton,
  RedoButton,
} from './buttons';

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1;
  background-color: #100e0e;
`;

const SpellCategorySpellsDiv = styled.div`
  display: grid;
  flex-wrap: wrap;
  flex: 1;
  grid-template-columns: repeat(auto-fill, minmax(33px, 1fr));
  gap: 3px;
  padding: 7px 6px;
`;

const SpellSelectorWandActionBorder = styled(WandActionBorder)`
  ${SpellCategorySpellsDiv}:hover && {
    transform-origin: center;
    transform: scale(150%);
    transition: transform var(--anim-basic-in);
    cursor: move;
    pointer-events: none;
  }
`;

const SpellShortcuts = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-self: center;
  width: 100%;
  background-color: black;
`;

const EditButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-self: center;
  background-color: black;
`;

const SpellHotbar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-self: center;
  background-color: black;
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
    <SpellSelectorWandActionBorder size={props.size}>
      <WandAction action={props.action} size={props.size} />
    </SpellSelectorWandActionBorder>
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
      <SpellShortcuts>
        <EditButtons>
          <UndoButton />
          <RedoButton />
          <ResetButton />
          <LoadButton />
          <ExportButton />
        </EditButtons>
        <SpellHotbar></SpellHotbar>
      </SpellShortcuts>
    </MainDiv>
  );
}
