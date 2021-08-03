import styled from 'styled-components';
import { WandActionGroup } from '../wandAction/WandActionGroup';
import { ActionCall, GroupedWandShot, TreeNode } from '../../calc/eval/types';

const MainDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 1px;
`;

const NodeDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const ChildrenDiv = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 4px solid #777;
  border-top: 0;
  border-bottom: 0;
  margin-bottom: 10px;
`;

type ActionTreeComponentProps = {
  node: TreeNode<ActionCall>;
};

function ActionTreeComponent(props: ActionTreeComponentProps) {
  const { node } = props;

  let childrenComponent = (
    <>
      {node.children.map((n, index) => (
        <ActionTreeComponent node={n} key={index} />
      ))}
    </>
  );

  if (node.children.length > 1) {
    childrenComponent = <ChildrenDiv>{childrenComponent}</ChildrenDiv>;
  }

  return (
    <NodeDiv>
      <WandActionGroup group={node.value} />
      {node.children.length > 0 && childrenComponent}
    </NodeDiv>
  );
}

type Props = {
  shot: GroupedWandShot;
};

export function ActionTreeShotResult(props: Props) {
  const s = props.shot;
  return (
    <MainDiv>
      {s.actionTree.map((n, index) => (
        <ActionTreeComponent node={n} key={index} />
      ))}
    </MainDiv>
  );
}
