import styled from 'styled-components';
import { ActionCall, Projectile } from '../../calc/util';
import { DEFAULT_SIZE, WandAction } from './WandAction';
import {
  GroupedObject,
  isArrayObject,
  isMultipleObject,
  isRawObject,
  simplifyMultipleObject,
} from '../../util/combineGroups';

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  font-family: monospace;
  font-weight: bold;
  font-size: 12px;
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
  group: GroupedObject<ActionCall | Projectile>;
};

export function WandActionGroup(props: Props) {
  const size = props.size || DEFAULT_SIZE;

  const group = simplifyMultipleObject(props.group);

  if (isRawObject(group)) {
    return <WandAction {...group} size={size} />;
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
