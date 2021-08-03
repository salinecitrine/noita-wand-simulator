import styled from 'styled-components';
import { ReactNode } from 'react';

const ParentDiv = styled.div`
  color: #111;
  background-color: #999;
  display: flex;
  justify-content: center;
  position: relative;
  align-items: center;
  border-top: 2px solid #bbb;
  border-bottom: 2px solid #777;
`;

const HeaderDiv = styled.div`
  font-weight: bold;
  font-size: 18px;
  text-align: center;
`;

const ChildrenDiv = styled.div`
  position: absolute;
  right: 0;
  font-size: 14px;
`;

const ChildrenDiv2 = styled.div`
  position: absolute;
  left: 0;
  font-size: 14px;
`;

type SectionHeaderProps = {
  title: string;
  leftChildren?: ReactNode;
  rightChildren?: ReactNode;
};

export default function SectionHeader(props: SectionHeaderProps) {
  return (
    <ParentDiv>
      <ChildrenDiv2>{props?.leftChildren}</ChildrenDiv2>
      <HeaderDiv>{props.title}</HeaderDiv>
      <ChildrenDiv>{props?.rightChildren}</ChildrenDiv>
    </ParentDiv>
  );
}
