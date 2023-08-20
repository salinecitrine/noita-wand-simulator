import styled from 'styled-components';
import { ReactNode } from 'react';

const ParentDiv = styled.div`
  color: #111;
  display: flex;
  align-items: center;
  border: none;
  background-color: #0f0e0e;
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
  margin-left: 0.8em;
  margin-right: 0.8em;
  background-color: #0f0e0e;
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

const ShortDivider = styled.div`
  background-color: #333;
  height: 2px;
  width: 1em;
`;

type SectionHeaderProps = {
  title: string | ReactNode;
  leftChildren?: ReactNode;
  rightChildren?: ReactNode;
};

export default function SectionHeader({
  leftChildren,
  rightChildren,
  title,
}: SectionHeaderProps) {
  return (
    <ParentDiv>
      <LeftSideChildDiv></LeftSideChildDiv>
      {leftChildren && (
        <>
          <HeaderDiv>{leftChildren}</HeaderDiv>
          <ShortDivider />
        </>
      )}
      <HeaderDiv>{title}</HeaderDiv>
      {rightChildren && (
        <>
          <ShortDivider />
          <HeaderDiv>{rightChildren}</HeaderDiv>
        </>
      )}
      <RightSideChildDiv></RightSideChildDiv>
    </ParentDiv>
  );
}
