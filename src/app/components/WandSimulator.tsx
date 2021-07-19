import { WandBuilder } from './WandBuilder';
import { ShotResultList } from './shotResult/ShotResultList';
import { WandPresetSelector } from './presetMenu/WandPresetSelector';
import { useAppSelector } from '../hooks';
import { selectConfig } from '../redux/configSlice';
import { ConfigEditor } from './config/ConfigEditor';
import { WandStatsEditor } from './WandStatsEditor';
import { MainHeader } from './MainHeader';
import { SpellSelector } from './SpellSelector';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

type Props = {};

export function WandSimulator(props: Props) {
  const { config } = useAppSelector(selectConfig);
  return (
    <Column>
      <MainHeader />
      <Row>
        <ConfigEditor />
        <WandPresetSelector />
      </Row>
      <Column>
        <DndProvider backend={HTML5Backend}>
          <Row>
            <SpellSelector />
          </Row>
          <WandBuilder />
        </DndProvider>
      </Column>
      <ShotResultList {...config} />
    </Column>
  );
}
