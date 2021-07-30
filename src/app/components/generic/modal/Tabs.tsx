import React, { useState } from 'react';
import styled from 'styled-components';

const MainDiv = styled.div``;

const TabTitlesDiv = styled.div`
  display: flex;
  flex-direction: row;
  //justify-content: space-around;
  //border-bottom: 2px solid #555;
`;

const TitleDiv = styled.div`
  display: flex;
  user-select: none;
  background-color: #333;
  border: 2px solid #111;
  color: #ccc;
  border-bottom: none;
  padding: 0 5px;
  cursor: pointer;
  justify-content: center;
  margin: 0 5px;
`;

const ContentDiv = styled.div`
  display: flex;
  width: 100%;
  background-color: #333;
`;

export type Tab = {
  title: string;
  content: React.ReactElement;
};

type Props = {
  tabs: Tab[];
};

export function Tabs(props: React.PropsWithChildren<Props>) {
  const { tabs } = props;

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  if (tabs.length === 0) {
    return null;
  }

  return (
    <MainDiv>
      <TabTitlesDiv>
        {tabs.map((t, index) => (
          <TitleDiv onClick={() => setSelectedTabIndex(index)} key={t.title}>
            {t.title}
          </TitleDiv>
        ))}
      </TabTitlesDiv>
      <ContentDiv>{tabs[selectedTabIndex].content}</ContentDiv>
    </MainDiv>
  );
}
