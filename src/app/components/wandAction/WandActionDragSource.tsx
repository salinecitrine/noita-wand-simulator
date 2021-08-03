import { useDrag } from 'react-dnd';

import styled from 'styled-components';
import { ActionLocation } from '../../types';

const StyledDiv = styled.div<{ isDragging: boolean }>`
  opacity: ${(props) => (props.isDragging ? 0.3 : 1)};
`;

type Props = {
  actionId: string;
  sourceWandIndex?: number;
  sourceList?: ActionLocation['list'];
};

export function WandActionDragSource(props: React.PropsWithChildren<Props>) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'action',
    item: {
      actionId: props.actionId,
      sourceWandIndex: props.sourceWandIndex,
      sourceList: props.sourceList,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <StyledDiv ref={drag} isDragging={isDragging}>
      {props.children}
    </StyledDiv>
  );
}
