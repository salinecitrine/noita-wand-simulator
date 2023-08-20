import { actions } from '../calc/gun_actions';
import { WandActionDragSource } from './wandAction/WandActionDragSource';
import styled from 'styled-components';
import { useMemo } from 'react';
import SectionHeader from './SectionHeader';
import { WandAction } from './wandAction/WandAction';
import WandActionBorder from './wandAction/WandActionBorder';
import { useAppSelector } from '../redux/hooks';
import { ConfigState, selectConfig } from '../redux/configSlice';
import { Action, actionTypeInfoMap } from '../calc/extra/types';
import { groupBy, objectEntries } from '../util/util';
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

const SpellCategorySpellsDiv = styled.div<{
  size: number;
}>`
  display: grid;
  flex-wrap: wrap;
  flex: 1;
  grid-template-columns: repeat(
    auto-fill,
    minmax(${({ size }) => size}px, 1fr)
  );
  gap: ${({ size }) => size * 0.16}px;
  padding: 7px 6px;
`;

const SpellSelectorWandActionBorder = styled(WandActionBorder)`
  background-image: url(/data/inventory/grid_box.png);
  padding-left: 0px;
  padding-top: 0px;
`;

const SpellShortcuts = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-self: center;
  width: 100%;
`;

const EditButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-self: center;
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

const isBetaEnabled = (
  configBetaEnabled: ConfigState['config']['showBeta'],
  spell: Action,
) => {
  return !spell.beta || configBetaEnabled;
};

type WandActionSelectProps = {
  action: Action;
  size: number;
};

const WandActionSelect = (props: WandActionSelectProps) => (
  <SpellSelectorWandActionBorder size={props.size}>
    <WandActionDragSource actionId={props.action.id} key={props.action.id}>
      <WandAction action={props.action} size={props.size} />
    </WandActionDragSource>
  </SpellSelectorWandActionBorder>
);

type Props = {};

export function SpellSelector(props: Props) {
  const { config } = useAppSelector(selectConfig);

  const spellSize = 40;

  const unlockedActions = useMemo(
    () =>
      actions.filter(
        (a) =>
          isSpellUnlocked(config.unlocks, a) &&
          isBetaEnabled(config.showBeta, a),
      ),
    [config.unlocks, config.showBeta],
  );

  const actionsByType = useMemo(() => {
    return groupBy(unlockedActions, ({ type }) => type);
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
            <SpellCategorySpellsDiv size={spellSize}>
              {actions.map((action) => (
                <WandActionSelect
                  action={action}
                  size={spellSize}
                  key={action.id}
                />
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
          <SpellCategorySpellsDiv size={spellSize}>
            {actions.map((action) => (
              <WandActionSelect
                action={action}
                size={spellSize}
                key={action.id}
              />
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
