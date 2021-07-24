import styled from 'styled-components';
import { DEFAULT_SIZE, WandAction } from './WandAction';
import {
  GroupedObject,
  isArrayObject,
  isMultipleObject,
  isRawObject,
  simplifyMultipleObject,
} from '../../util/combineGroups';
import WandActionBorder from './WandActionBorder';
import { ActionCall, GroupedProjectile } from '../../calc/eval/clickWand';

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  font-family: monospace;
  font-weight: bold;
  font-size: 12px;
  background-color: rgba(64, 128, 64, 0.3);
`;

const GroupDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const CountParentDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const CountDiv = styled.div<{
  size: number;
}>`
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
  color: white;
  background-color: green;
  width: 100%;
  height: ${(props) => props.size / 3}px;
  font-family: monospace;
  font-weight: bold;
  font-size: 12px;
  border: 1px solid #aaa;
  line-height: ${(props) => props.size / 3}px;
`;

const SpacerDiv = styled.div<{
  size: number;
}>`
  display: flex;
  flex: 1 1 auto;
  min-width: 5px;
  max-width: ${(props) => props.size / 4}px;
  height: ${(props) => props.size / 4}px;
`;

type Props = {
  size?: number;
  group: GroupedObject<ActionCall | GroupedProjectile>;
};

export function WandActionGroup(props: Props) {
  const size = props.size || DEFAULT_SIZE;

  const group = simplifyMultipleObject(props.group);

  if (isRawObject(group)) {
    return (
      <WandActionBorder size={size}>
        <WandAction {...group} size={size} />
      </WandActionBorder>
    );
  } else if (isArrayObject(group)) {
    return (
      <GroupDiv>
        {group.map((g, i) => (
          <WandActionGroup group={g} key={i} size={size} />
        ))}
      </GroupDiv>
    );
  } else if (isMultipleObject(group)) {
    return (
      <MainDiv>
        <GroupDiv>
          <WandActionGroup group={group.first} size={size} />
        </GroupDiv>
        <CountParentDiv>
          <SpacerDiv size={size} />
          <CountDiv size={size}>x{group.count}</CountDiv>
          <SpacerDiv size={size} />
        </CountParentDiv>
      </MainDiv>
    );
  } else {
    return null;
  }
}
