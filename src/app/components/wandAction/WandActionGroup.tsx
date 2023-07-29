import styled from 'styled-components';
import { DEFAULT_SIZE, WandAction } from './WandAction';
import { NextActionArrow } from '../shotResult/TreeArrows';
import {
  GroupedObject,
  isArrayObject,
  isMultipleObject,
  isRawObject,
  simplifyMultipleObject,
} from '../../util/combineGroups';
import WandActionBorder from './WandActionBorder';
import { ActionCall, GroupedProjectile } from '../../calc/eval/types';

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  font-family: monospace;
  font-weight: bold;
  font-size: 12px;
  background-color: rgba(64, 128, 64, 0.2);
`;

const GroupDiv = styled.div`
  display: flex;
  flex-direction: row;
  background-color: rgba(0, 128, 64, 0.2);
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
  background-color: black;
  height: ${(props) => props.size / 3}px;
  font-family: monospace;
  font-weight: bold;
  font-size: 12px;
  border: 1px solid #aaa;
  line-height: ${(props) => props.size / 3}px;
  font-family: var(--font-family-noita-default);
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
/*
  background-image: url(/data/inventory/action_tree_box.png);
 */
const WandActionGroupWandActionBorder = styled(WandActionBorder)`
  padding: 3px;
  border: 3px dotted #656565;
  border-radius: 12px;
  background-image: none;
  background-color: rgba(108, 76, 34, 0.1);
  margin: 4px 0 4px 48px;
  position: relative;
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
      <WandActionGroupWandActionBorder size={size}>
        <NextActionArrow />
        <WandAction {...group} size={size} />
      </WandActionGroupWandActionBorder>
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
          <CountDiv size={size}>x {group.count}</CountDiv>
          <SpacerDiv size={size} />
        </CountParentDiv>
      </MainDiv>
    );
  } else {
    return null;
  }
}
