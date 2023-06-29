import { WandBuilder } from './WandBuilder';
import { ShotResultList } from './shotResult/ShotResultList';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { selectConfig } from '../redux/configSlice';
import { MainHeader } from './MainHeader';
import SectionHeader from './SectionHeader';
import { SpellSelector } from './SpellSelector';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import { ConfigButton } from './buttons';
import { useEffect } from 'react';
import { forceDisableCanvasSmoothing } from '../util/util';
import { CastConfigEditor } from './config/CastConfigEditor';

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-self: center;
  width: 100%;
  background-color: black;
`;

type Props = {};

export function WandSimulator(props: Props) {
  const { config } = useAppSelector(selectConfig);
  useAppDispatch();

  useEffect(() => {
    forceDisableCanvasSmoothing();
  }, []);

  return (
    <Column>
      <MainHeader>
        <Row>
          <ConfigButton />
        </Row>
      </MainHeader>
      <Column>
        <DndProvider backend={HTML5Backend}>
          <Row>
            <SpellSelector />
          </Row>
          <WandBuilder />
          <CastConfigEditor />
        </DndProvider>
      </Column>
      <SectionHeader
        title={`Simulation${config.pauseCalculations ? ' (Paused)' : ''}`}
        rightChildren={<div>Status: Running</div>}
      />
      {!config.pauseCalculations && <ShotResultList {...config} />}
    </Column>
  );
}
