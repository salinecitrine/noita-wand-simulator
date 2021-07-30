import { getActionById } from '../../calc/eval/util';
import { useAppSelector } from '../../redux/hooks';
import { selectWand } from '../../redux/wandSlice';
import { ProjectileTreeShotResult } from './ProjectileTreeShotResult';
import styled from 'styled-components';
import { ActionCalledShotResult } from './ActionCalledShotResult';
import React, { useMemo, useRef } from 'react';
import SectionHeader from '../SectionHeader';
import { notNull } from '../../util/util';
import { clickWand } from '../../calc/eval/clickWand';
import { selectConfig } from '../../redux/configSlice';
import { ActionTreeShotResult } from './ActionTreeShotResult';
import { condenseActionsAndProjectiles } from '../../calc/eval/condense';
import { ActionSource } from '../../calc/eval/types';
import { ShotMetadata } from './ShotMetadata';
import { exportComponentAsPNG } from 'react-component-export-image';

const GREEK_SPELLS = ['ALPHA', 'GAMMA', 'TAU', 'MU', 'PHI', 'SIGMA', 'ZETA'];

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

const SaveButton = styled.span`
  cursor: pointer;
`;

type Props = {
  condenseShots: boolean;
  unlimitedSpells: boolean;
  infiniteSpells: boolean;
  showDivides: boolean;
  showGreekSpells: boolean;
  showDirectActionCalls: boolean;
};

// list of several ShotResults, generally from clicking/holding until reload, but also for one click
export function ShotResultList(props: Props) {
  const { wand, spells } = useAppSelector(selectWand);
  const { config } = useAppSelector(selectConfig);

  const projectilesRef = useRef<HTMLDivElement>();
  const actionsCalledRef = useRef<HTMLDivElement>();
  const actionCallTreeRef = useRef<HTMLDivElement>();

  const spellActions = useMemo(
    () => spells.filter(notNull).map(getActionById),
    [spells],
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

  let [shots, reloadTime] = useMemo(
    () => clickWand(wand, spellActionsWithUses, wand.mana_max, true),
    [spellActionsWithUses, wand],
  );

  shots = useMemo(() => {
    if (!props.showDivides) {
      return shots.map((s) => ({
        ...s,
        calledActions: s.calledActions.filter(
          (ac) => !ac.action.id.startsWith('DIVIDE'),
        ),
      }));
    } else {
      return shots;
    }
  }, [props.showDivides, shots]);

  shots = useMemo(() => {
    if (!props.showGreekSpells) {
      return shots.map((s) => ({
        ...s,
        calledActions: s.calledActions.filter(
          (ac) => !GREEK_SPELLS.includes(ac.action.id),
        ),
      }));
    } else {
      return shots;
    }
  }, [props.showGreekSpells, shots]);

  shots = useMemo(() => {
    if (!props.showDirectActionCalls) {
      return shots.map((s) => ({
        ...s,
        calledActions: s.calledActions.filter(
          (ac) => ac.source !== ActionSource.ACTION,
        ),
      }));
    } else {
      return shots;
    }
  }, [props.showDirectActionCalls, shots]);

  const groupedShots = useMemo(() => {
    if (props.condenseShots) {
      return shots.map(condenseActionsAndProjectiles);
    } else {
      return shots;
    }
  }, [props.condenseShots, shots]);

  const handleSaveProjectiles =
    (ref: React.MutableRefObject<any>, fileName: string) => () => {
      if (ref.current) {
        exportComponentAsPNG(ref as any, { fileName });
      }
    };

  return (
    <div>
      <SectionHeader>
        <SaveButton
          onClick={handleSaveProjectiles(projectilesRef, 'projectiles')}
        >
          📷
        </SaveButton>
        Projectiles
      </SectionHeader>
      <StyledDiv ref={projectilesRef as any}>
        {groupedShots.length > 0 && <ShotMetadata rechargeDelay={reloadTime} />}
        {groupedShots.map((shot, index) => (
          <React.Fragment key={index}>
            {index > 0 && <StyledHr />}
            <ProjectileTreeShotResult shot={shot} indent={false} />
          </React.Fragment>
        ))}
      </StyledDiv>
      <SectionHeader>
        <SaveButton
          onClick={handleSaveProjectiles(actionsCalledRef, 'actions_called')}
        >
          📷
        </SaveButton>
        Actions Called
      </SectionHeader>
      <StyledDiv ref={actionsCalledRef as any}>
        {groupedShots.map((shot, index) => (
          <React.Fragment key={index}>
            {index > 0 && <StyledHr />}
            <ActionCalledShotResult key={index} shot={shot} />
          </React.Fragment>
        ))}
      </StyledDiv>
      {config.showActionTree && (
        <>
          <SectionHeader>
            <SaveButton
              onClick={handleSaveProjectiles(actionCallTreeRef, 'action_tree')}
            >
              📷
            </SaveButton>
            Action Call Tree
          </SectionHeader>
          <StyledDiv ref={actionCallTreeRef as any}>
            {groupedShots.map((shot, index) => (
              <React.Fragment key={index}>
                {index > 0 && <StyledHr />}
                <ActionTreeShotResult key={index} shot={shot} />
              </React.Fragment>
            ))}
          </StyledDiv>
        </>
      )}
    </div>
  );
}
