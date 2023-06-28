import styled from 'styled-components';
import { ReactNode } from 'react';

const ParentDiv = styled.div`
  color: #111;
  display: flex;
  align-items: center;
  border: none;
  background-color: #0F0E0E;
  padding: 0.9em 1em 0.4em 2em;
`;

const HeaderDiv = styled.div`
  font-weight: bold;
  font-size: 16px;
  font-family: 'noita', '04b03', sans-serif;
  font-variant-caps: small-caps;
  font-weight: 600;
  color: #929292;
  text-align: center;
  margin-left: 1em;
  margin-right: 1em;
  background-color: #0F0E0E;
  white-space: nowrap;
`;

const RightSideChildDiv = styled.div`
  font-size: 14px;
  background-color: #333;
  height: 2px;
  width: 10%;
`;

const LeftSideChildDiv = styled.div`
  font-size: 14px;
  background-color: #333;
  height: 2px;
  width: 80%;
`;

type SectionHeaderProps = {
  title: string | ReactNode;
  leftChildren?: ReactNode;
  rightChildren?: ReactNode;
};

export default function SectionHeader(props: SectionHeaderProps) {
  return (
    <ParentDiv>
      <LeftSideChildDiv>{props?.leftChildren}</LeftSideChildDiv>
      <HeaderDiv>{props.title}</HeaderDiv>
      <RightSideChildDiv>{props?.rightChildren}</RightSideChildDiv>
    </ParentDiv>
  );
}
