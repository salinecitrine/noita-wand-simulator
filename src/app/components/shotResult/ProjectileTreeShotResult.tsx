import styled from 'styled-components';
import { ProjectileCastState } from './ProjectileCastState';
import { WandActionGroup } from '../wandAction/WandActionGroup';
import { isRawObject } from '../../util/combineGroups';
import { GroupedWandShot } from '../../calc/eval/types';
import { ShotMetadata } from './ShotMetadata';

const StyledShotDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-x: hidden;
  margin: 1px;
`;

type StyledProjectileDivProps = {
  indent: boolean;
};

const StyledProjectileDiv = styled.div<StyledProjectileDivProps>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: ${(props) => (props.indent ? 24 : 0)}px;
`;

type StyledCastStateDivProps = {
  indent: boolean;
};

const StyledMetadataDiv = styled.div<StyledCastStateDivProps>`
  margin-top: ${(props) => (props.indent ? 24 : 0)}px;
`;

const TriggerDiv = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 4px solid #777;
  border-top: 0;
  border-bottom: 0;
  margin-bottom: 10px;
`;

type Props = {
  shot: GroupedWandShot;
  indent: boolean;
};

// list of all actions played, and sub-ShotResults for triggers
export function ProjectileTreeShotResult(props: Props) {
  const { shot } = props;

  return (
    <StyledShotDiv>
      <div>
        <StyledMetadataDiv indent={props.indent}>
          {!props.indent && (
            <ShotMetadata
              manaDrain={shot.manaDrain}
              castDelay={shot.castState?.fire_rate_wait}
            />
          )}
          <ProjectileCastState castState={shot.castState} />
        </StyledMetadataDiv>
      </div>
      {shot.projectiles.map((p, index) => {
        let triggerComponent;
        if (isRawObject(p)) {
          triggerComponent = p.trigger && p.trigger.projectiles.length > 0 && (
            <TriggerDiv>
              <ProjectileTreeShotResult shot={p.trigger} indent={true} />
            </TriggerDiv>
          );
        }
        return (
          <StyledProjectileDiv key={index} indent={props.indent}>
            <WandActionGroup group={p} />
            {triggerComponent}
          </StyledProjectileDiv>
        );
      })}
    </StyledShotDiv>
  );
}
