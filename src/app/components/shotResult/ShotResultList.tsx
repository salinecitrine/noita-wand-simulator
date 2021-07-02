import {
  ActionSource,
  clickWand,
  condenseActionsAndProjectiles,
  getActionById,
} from '../../calc/util';
import { useAppSelector } from '../../hooks';
import { selectWand } from '../../redux/wandSlice';
import { ProjectileTreeShotResult } from './ProjectileTreeShotResult';
import styled from 'styled-components';
import { ActionCalledShotResult } from './ActionCalledShotResult';
import React, { useMemo } from 'react';
import SectionHeader from '../SectionHeader';
import { notNull } from '../../util/util';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: #333;
  overflow-x: auto;
  overflow-y: hidden;
`;

const StyledHr = styled.hr`
  width: 99%;
  border-color: #666;
  margin: 2px 0;
`;

type Props = {
  condenseShots: boolean;
  hideDivides: boolean;
  hideDirectActionCalls: boolean;
  unlimitedSpells: boolean;
  infiniteSpells: boolean;
};

// list of several ShotResults, generally from clicking/holding until reload, but also for one click
export function ShotResultList(props: Props) {
  const { wand, spells } = useAppSelector(selectWand);

  const spellActions = useMemo(
    () => spells.filter(notNull).map(getActionById),
    [spells]
  );

  const spellActionsWithUses = useMemo(() => {
    if (!props.infiniteSpells) {
      return spellActions.map((action) => {
        if (
          action.max_uses &&
          (action.never_unlimited || !props.unlimitedSpells)
        ) {
          return { ...action, uses_remaining: 0 };
        } else {
          return action;
        }
      });
    } else {
      return spellActions;
    }
  }, [props.infiniteSpells, props.unlimitedSpells, spellActions]);

  const shots = useMemo(
    () => clickWand(wand, spellActionsWithUses, wand.mana_max, true),
    [spellActionsWithUses, wand]
  );

  const shotsWithDivides = useMemo(() => {
    if (props.hideDivides) {
      return shots.map((s) => ({
        ...s,
        calledActions: s.calledActions.filter(
          (ac) => !ac.action.id.startsWith('DIVIDE')
        ),
      }));
    } else {
      return shots;
    }
  }, [props.hideDivides, shots]);

  const shotsWithDirectActionCalls = useMemo(() => {
    if (props.hideDirectActionCalls) {
      return shotsWithDivides.map((s) => ({
        ...s,
        calledActions: s.calledActions.filter(
          (ac) => ac.source !== ActionSource.ACTION
        ),
      }));
    } else {
      return shotsWithDivides;
    }
  }, [props.hideDirectActionCalls, shotsWithDivides]);

  const groupedShots = useMemo(() => {
    if (props.condenseShots) {
      return shotsWithDirectActionCalls.map(condenseActionsAndProjectiles);
    } else {
      return shotsWithDirectActionCalls;
    }
  }, [props.condenseShots, shotsWithDirectActionCalls]);

  return (
    <div>
      <SectionHeader>Actions Called</SectionHeader>
      <StyledDiv>
        {groupedShots.map((shot, index) => (
          <React.Fragment key={index}>
            {index > 0 && <StyledHr />}
            <ActionCalledShotResult key={index} shot={shot} />
          </React.Fragment>
        ))}
      </StyledDiv>
      <SectionHeader>Projectiles</SectionHeader>
      <StyledDiv>
        {groupedShots.map((shot, index) => (
          <React.Fragment key={index}>
            {index > 0 && <StyledHr />}
            <ProjectileTreeShotResult shot={shot} indent={false} />
          </React.Fragment>
        ))}
      </StyledDiv>
    </div>
  );
}
