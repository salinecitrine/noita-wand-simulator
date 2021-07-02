import { Preset, PresetGroup } from '../../types';
import React from 'react';
import styled from 'styled-components';
import { isPresetGroup } from '../../util/util';

const BackgroundDiv = styled.div`
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
`;

const MainDiv = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #555;
  color: #eee;
  max-height: 100%;
  overflow-y: auto;
  box-shadow: -10px 10px 50px #000;
`;

const PresetGroupNameDiv = styled.div`
  font-weight: bold;
`;

const PresetGroupListDiv = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  position: relative;
  
  li:last-child {
    border-left: 2px solid transparent;
  }
`;

const FirstPresetGroupDiv = styled.div``;

const PresetGroupDiv = styled.li`
  border-left: 2px solid #000;
  margin-left: 1em;
  padding-left: 1em;
  position: relative;
  
  &:before {
    content:'┗';
    color: #000;
    position: absolute;
    top: -5px;
    left: -9px;
  }
  
  li {
    margin-left: 0;
  }
`;
const PresetButtonDiv = styled.li`
  border-left: 2px solid #000;
  margin-left: 1em;
  padding-left: 1em;
  position: relative;

  &:before {
    content:'┗';
    color: #000;
    position: absolute;
    top: -5px;
    left: -9px;
  }
`;

type Props = {
  presets: (Preset | PresetGroup)[];
  onSelect: (p: Preset) => void;
  onClose: () => void;
};

export function WandPresetMenu(props: Props) {
  const { presets, onSelect, onClose } = props;

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const createPresetList = (
    presetGroup: PresetGroup,
    first: boolean = true
  ) => {
    const content = (
      <>
        <PresetGroupNameDiv>{presetGroup.name}</PresetGroupNameDiv>
        <PresetGroupListDiv>
          {presetGroup.presets.map((p, index) => {
            if (isPresetGroup(p)) {
              return createPresetList(p, false);
            } else {
              return (
                <PresetButtonDiv key={index}>
                  <button onClick={(e) => onSelect(p)}>{p.name}</button>
                </PresetButtonDiv>
              );
            }
          })}
        </PresetGroupListDiv>
      </>
    );

    if (first) {
      return (
        <FirstPresetGroupDiv key={presetGroup.name}>
          {content}
        </FirstPresetGroupDiv>
      );
    } else {
      return <PresetGroupDiv key={presetGroup.name}>{content}</PresetGroupDiv>;
    }
  };

  return (
    <BackgroundDiv onClick={handleClose}>
      <MainDiv>{createPresetList({ name: 'Presets', presets })}</MainDiv>
    </BackgroundDiv>
  );
}
