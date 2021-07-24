import styled from 'styled-components';
import { ProjectileCastState } from './ProjectileCastState';
import { WandActionGroup } from '../wandAction/WandActionGroup';
import { isRawObject } from '../../util/combineGroups';
import { GroupedWandShot } from '../../calc/eval/types';

const StyledShotDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  //background-color: #999;
`;

const StyledManaDrainDiv = styled.div`
  font-size: 12px;
  font-weight: bold;
  color: #eee;
  background-color: #33c;
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
        {shot.manaDrain && (
          <StyledMetadataDiv indent={props.indent}>
            <StyledManaDrainDiv>{shot.manaDrain}</StyledManaDrainDiv>
          </StyledMetadataDiv>
        )}
        <StyledMetadataDiv indent={props.indent}>
          <ProjectileCastState castState={shot.castState} />
        </StyledMetadataDiv>
      </div>
      {shot.projectiles.map((p, index) => {
        let triggerComponent;
        if (isRawObject(p)) {
          triggerComponent = p.trigger && (
            <ProjectileTreeShotResult shot={p.trigger} indent={true} />
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
