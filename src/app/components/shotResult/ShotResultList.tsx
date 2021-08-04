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
import { SaveImageButton } from '../generic/SaveImageButton';
import { IterationLimitWarning } from './IterationLimitWarning';
import { ScrollWrapper } from '../generic/ScrollWrapper';
import { GREEK_SPELLS } from '../../calc/eval/lookups';

const ParentDiv = styled.div`
  background-color: #333;
`;

const SectionDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: #333;
  width: fit-content;
`;

const StyledHr = styled.hr`
  width: 98%;
  border-color: #666;
  margin: 2px 0;
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

  let [shots, reloadTime, hitIterationLimit] = useMemo(
    () =>
      clickWand(
        wand,
        spellActionsWithUses,
        wand.mana_max,
        wand.cast_delay,
        true,
        config.endSimulationOnRefresh,
        config.requirements,
      ),
    [
      config.endSimulationOnRefresh,
      config.requirements,
      config.random,
      spellActionsWithUses,
      wand,
    ],
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
          (ac) => !GREEK_SPELLS().includes(ac.action.id),
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

  return (
    <ParentDiv>
      <SectionHeader
        title={'Projectiles'}
        leftChildren={
          <IterationLimitWarning hitIterationLimit={hitIterationLimit} />
        }
        rightChildren={
          <SaveImageButton
            targetRef={projectilesRef}
            fileName={'projectiles'}
            enabled={groupedShots.length > 0}
          />
        }
      />
      <ScrollWrapper>
        <SectionDiv ref={projectilesRef as any} className={'saveImageRoot'}>
          {groupedShots.length > 0 && (
            <ShotMetadata rechargeDelay={reloadTime} />
          )}
          {groupedShots.map((shot, index) => (
            <React.Fragment key={index}>
              {index > 0 && <StyledHr />}
              <ProjectileTreeShotResult shot={shot} indent={false} />
            </React.Fragment>
          ))}
        </SectionDiv>
      </ScrollWrapper>
      <SectionHeader
        title={'Actions Called'}
        rightChildren={
          <SaveImageButton
            targetRef={actionsCalledRef}
            fileName={'actions_called'}
            enabled={groupedShots.length > 0}
          />
        }
      />
      <ScrollWrapper>
        <SectionDiv ref={actionsCalledRef as any} className={'saveImageRoot'}>
          {groupedShots.map((shot, index) => (
            <React.Fragment key={index}>
              {index > 0 && <StyledHr />}
              <ActionCalledShotResult key={index} shot={shot} />
            </React.Fragment>
          ))}
        </SectionDiv>
      </ScrollWrapper>
      {config.showActionTree && (
        <>
          <SectionHeader
            title={'Action Call Tree'}
            rightChildren={
              <SaveImageButton
                targetRef={actionCallTreeRef}
                fileName={'action_tree'}
                enabled={groupedShots.length > 0}
              />
            }
          />
          <ScrollWrapper>
            <SectionDiv
              ref={actionCallTreeRef as any}
              className={'saveImageRoot'}
            >
              {groupedShots.map((shot, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <StyledHr />}
                  <ActionTreeShotResult key={index} shot={shot} />
                </React.Fragment>
              ))}
            </SectionDiv>
          </ScrollWrapper>
        </>
      )}
    </ParentDiv>
  );
}
