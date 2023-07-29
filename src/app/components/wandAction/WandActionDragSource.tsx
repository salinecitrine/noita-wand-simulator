import { useDrag } from 'react-dnd';

import styled from 'styled-components';

const StyledDiv = styled.div<{
  isDragging: boolean;
}>`
  opacity: ${({ isDragging }) => (isDragging ? 0.3 : 1)};
  flex: 1 1;
  max-width: max-content;
  max-width: fit-content;
  min-width: min-content;

  ${({ isDragging }) =>
    isDragging
      ? `
    `
      : `
    &&:hover > div > div {
      z-index: 1000;
    }
   `}
`;

type Props = {
  actionId: string;
  sourceWandIndex?: number;
};

export function WandActionDragSource(props: React.PropsWithChildren<Props>) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'action',
    item: { actionId: props.actionId, sourceWandIndex: props.sourceWandIndex },
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
