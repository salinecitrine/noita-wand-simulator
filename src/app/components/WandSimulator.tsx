import { WandBuilder } from './WandBuilder';
import { ShotResultList } from './shotResult/ShotResultList';
import { WandPresetButton } from './presetMenu/WandPresetButton';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectConfig } from '../redux/configSlice';
import { ConfigEditor } from './config/ConfigEditor';
import { MainHeader } from './MainHeader';
import { SpellSelector } from './SpellSelector';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import { ConfigButton } from './config/ConfigButton';
import { ResetButton } from './ResetButton';
import { useEffect } from 'react';
import { ActionCreators } from 'redux-undo';

const Column = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-self: center;
  width: 100%;
`;

type Props = {};

export function WandSimulator(props: Props) {
  const { config } = useAppSelector(selectConfig);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        dispatch(ActionCreators.undo());
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [dispatch]);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'z') {
        dispatch(ActionCreators.redo());
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [dispatch]);

  return (
    <Column>
      <MainHeader>
        <Row>
          <ResetButton />
          <ConfigButton />
          <WandPresetButton />
        </Row>
      </MainHeader>
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
