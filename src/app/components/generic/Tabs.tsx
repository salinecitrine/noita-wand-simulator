import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const MainDiv = styled.div`
  background-color: black;
  padding: 3px;
`;

const TabTitlesDiv = styled.div`
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap-reverse;
  justify-content: start;
  background-color: black;
  margin-right: 10px;
  padding: 0 10px;
`;

const TitleDiv = styled.div<{
  selected: boolean;
}>`
  display: flex;
  flex: 1 1;
  justify-content: center;
  user-select: none;
  background-color: #100e0e;
  height: 1.6em;
  align-items: center;
  font-family: var(--font-family-noita-default);
  border-radius: 7px 7px 0 0;
  font-size: 14px;
  max-width: 8em;
  min-width: fit-content;
  border-block-end-style: hidden;

  @media screen and (max-width: 720px) {
    font-size: 14px;
  }

  ${({ selected }) =>
    selected
      ? `
    border: 2px solid var(--color-tab-border-active);
    border-bottom: 0px none;
    color: var(--color-tab-active);
    padding: 8px 10px 6px 10px;
    margin: 0 0 -2px -2px;
    cursor: default;
    z-index: var(--zindex-tabs-selected);

    &:hover {
    }
  `
      : `
    border: 2px solid var(--color-tab-border-inactive);
    border-bottom: 0px none;
    color: var(--color-tab-inactive);
    padding: 5px 10px 2px 10px;
    margin: 0 0 0 -2px;
    cursor: pointer;
    transition: var(--transition-hover-out);
    transition-property: border-color, color;

    &:hover {
      transition: var(--transition-hover-in);
      transition-property: border-color, color;
      border-color: var(--tabs-hover-color);
      color: var(--color-tab-border-inactive-hover);
    }
  `}
`;

const ContentDiv = styled.div`
  background-color: #100e0e;
  border: 2px solid #918167;
  border-radius: 2px 6px;
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

  const displayIndex = Math.min(tabs.length - 1, selectedTabIndex);

  useEffect(() => {
    if (displayIndex !== selectedTabIndex) {
      setSelectedTabIndex(displayIndex);
    }
  }, [displayIndex, selectedTabIndex]);

  if (tabs.length === 0) {
    return null;
  }

  return (
    <MainDiv>
      <TabTitlesDiv>
        {tabs.map((t, index) => (
          <TitleDiv
            selected={selectedTabIndex === index}
            onClick={() => setSelectedTabIndex(index)}
            key={t.title}
          >
            {t.title}
          </TitleDiv>
        ))}
      </TabTitlesDiv>
      <ContentDiv>{tabs[displayIndex].content}</ContentDiv>
    </MainDiv>
  );
}
