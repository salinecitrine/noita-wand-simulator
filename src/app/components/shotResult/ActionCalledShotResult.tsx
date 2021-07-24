import styled from 'styled-components';
import { WandActionGroup } from '../wandAction/WandActionGroup';
import { GroupedWandShot } from '../../calc/eval/clickWand';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
`;

type Props = {
  shot: GroupedWandShot;
};

// list of all actions played, and sub-ShotResults for triggers
export function ActionCalledShotResult(props: Props) {
  const s = props.shot;
  return (
    <StyledDiv>
      {s.calledActions.map((actionCall, index) => {
        return (
          <div key={index}>
            <WandActionGroup group={actionCall} />
          </div>
        );
      })}
    </StyledDiv>
  );
}
