import styled from 'styled-components';
import { PropsWithChildren } from 'react';

const ParentDiv = styled.div`
  overflow-x: auto;
  transform: rotateX(180deg);
`;

const ChildDiv = styled.div`
  transform: rotateX(180deg);
  width: fit-content;
`;

type Props = {};

export function ScrollWrapper(props: PropsWithChildren<Props>) {
  return (
    <ParentDiv>
      <ChildDiv>{props.children}</ChildDiv>
    </ParentDiv>
  );
}
