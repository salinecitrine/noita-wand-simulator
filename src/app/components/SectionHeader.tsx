import styled from 'styled-components';
import { PropsWithChildren } from 'react';

const ParentDiv = styled.div`
  color: #111;
  background-color: #999;
  display: flex;
  justify-content: center;
  position: relative;
  align-items: center;
  margin: 1px 0;
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

type SectionHeaderProps = {
  title: string;
};

export default function SectionHeader(
  props: PropsWithChildren<SectionHeaderProps>,
) {
  return (
    <ParentDiv>
      <HeaderDiv>{props.title}</HeaderDiv>
      <ChildrenDiv>{props.children}</ChildrenDiv>
    </ParentDiv>
  );
}
